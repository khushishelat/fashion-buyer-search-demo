/// <reference types="@cloudflare/workers-types" />
import { Parallel } from "parallel-web";
import { createGroq } from "@ai-sdk/groq";
import { streamText, tool, stepCountIs } from "ai";
import { z } from "zod/v4";
import { rateLimitMiddleware } from "./ratelimit";
//@ts-ignore
import indexHtml from "./index.html";
//@ts-ignore
import shoppingBagSvg from "../shoppingbag.svg";

export interface Env {
  PARALLEL_API_KEY: string;
  GROQ_API_KEY: string;
  RATE_LIMIT_KV: KVNamespace;
}

function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get("CF-Connecting-IP");
  if (cfConnectingIP) return cfConnectingIP;

  const xForwardedFor = request.headers.get("X-Forwarded-For");
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();

  const xRealIP = request.headers.get("X-Real-IP");
  if (xRealIP) return xRealIP;

  return "unknown";
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Ensure required environment variables are present
    if (!env.PARALLEL_API_KEY || !env.GROQ_API_KEY) {
      return new Response("Missing required API keys", { status: 500 });
    }

    if (!env.RATE_LIMIT_KV) {
      return new Response("Rate limiting service unavailable", { status: 500 });
    }

    // Serve the HTML page
    if (request.method === "GET") {
      const url = new URL(request.url);
      
      // Serve the shopping bag SVG
      if (url.pathname === "/shoppingbag.svg") {
        return new Response(shoppingBagSvg, {
          headers: { "Content-Type": "image/svg+xml" },
        });
      }
      
      // Serve the main HTML
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Handle research requests with rate limiting
    if (request.method === "POST") {
      // Apply rate limiting - config builder gets access to request
      const rateLimitResponse = await rateLimitMiddleware(env.RATE_LIMIT_KV, {
        limits: [
          {
            name: "IP hourly",
            requests: 100,
            windowMs: 60 * 60 * 1000, // 1 hour
            limiter: getClientIP(request), // Actual IP address
          },
          {
            name: "Global per minute",
            requests: 100,
            windowMs: 60 * 1000, // 1 minute
            limiter: "global", // Hardcoded global limiter
          },
          {
            name: "Global daily",
            requests: 10000,
            windowMs: 24 * 60 * 60 * 1000, // 1 day
            limiter: "global", // Hardcoded global limiter
          },
        ],
      });

      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      try {
        const { query, systemPrompt } = await request.json<any>();
        console.log({ query });
        if (!query) {
          return new Response("Query is required", { status: 400 });
        }

        const execute = async ({ objective }) => {
          const parallel = new Parallel({
            apiKey: env.PARALLEL_API_KEY,
          });

          const searchResult = await parallel.beta.search({
            objective,
            search_queries: undefined,
            processor: "base",
            max_results: 12,
            max_chars_per_result: 2000,
          });
          return searchResult;
        };

        // Define the search tool
        const searchTool = tool({
          description: `Fashion search: Find products across retail, resale, runway. Include: season, price, brand, material, region, style.`,
          inputSchema: z.object({
            objective: z
              .string()
              .describe("Fashion search goal: season, price, style, brand, region"),
          }),
          execute,
        });

        // Initialize Groq provider
        const groq = createGroq({
          apiKey: env.GROQ_API_KEY,
        });

        // Stream the research process
        const result = streamText({
          model: groq("meta-llama/llama-4-maverick-17b-128e-instruct"),
          system:
            systemPrompt ||
            `You are a strategic fashion buyer search agent. Your approach:

**Phase 1: PLAN** (Think before searching)
Analyze the query and identify 3-4 distinct search angles:
- Different price tiers
- Retail vs resale markets  
- Different regions (EU/US)
- Specific brands vs general style
- Current season vs past collections

**Phase 2: INITIAL SEARCH** (2-3 searches)
Execute your first 2-3 most important searches to understand the landscape.

**Phase 3: EVALUATE & ADAPT**
Review what you found. What's missing? What gaps need filling?
- If prices too high → search lower tiers or resale
- If low availability → try different regions or brands
- If results unclear → get more specific

**Phase 4: TARGETED FOLLOW-UP** (2-4 searches)
Based on initial findings, execute targeted searches to fill gaps.

**Phase 5: FINAL CHECK** (optional 1-2 searches)
If needed, do 1-2 more searches for missing angles.

**Phase 6: SYNTHESIZE**
After 5-10 total searches, compile findings:

**Summary:** [2-3 sentences on overall findings]

**Highlights:**
- Price Range: $XXX-$XXX  
- Best Sources: [retailers]
- Availability: [status]
- Notable Finds: [standout items]

**Recommendations:** [3-5 bullets with specifics]

**Tips:** [1-2 practical insights]

**Current Date:** ${new Date(Date.now()).toISOString().slice(0, 10)}
**Season Context:** FW25 launching, SS25 in pre-orders

Use fashion terminology: seasons, brands, materials, silhouettes, prices, regions.`,
          prompt: query,
          tools: { search: searchTool },
          toolChoice: "auto",
          stopWhen: stepCountIs(50),
          maxOutputTokens: 8000,
        });

        // Return the streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.fullStream) {
                const data = `data: ${JSON.stringify(chunk)}\n\n`;
                controller.enqueue(encoder.encode(data));
              }
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            } catch (error) {
              console.error("Stream error:", error);
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "error",
                    error: error.message || "Unknown error occurred",
                  })}\n\n`
                )
              );
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (error) {
        console.error("Research error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
