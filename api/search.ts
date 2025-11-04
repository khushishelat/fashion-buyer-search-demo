import { Parallel } from "parallel-web";
import { createGroq } from "@ai-sdk/groq";
import { streamText, tool, stepCountIs } from "ai";
import { z } from "zod";

export const config = {
  runtime: 'edge',
  maxDuration: 60,
};

export default async function handler(req: Request) {
  console.log('🔍 [API] Search request received');
  
  if (req.method !== 'POST') {
    console.error('❌ [API] Invalid method:', req.method);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get API keys from environment
  const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  console.log('🔑 [API] Environment check:', {
    hasParallelKey: !!PARALLEL_API_KEY,
    hasGroqKey: !!GROQ_API_KEY,
    parallelKeyLength: PARALLEL_API_KEY?.length || 0,
    groqKeyLength: GROQ_API_KEY?.length || 0
  });

  if (!PARALLEL_API_KEY) {
    console.error('❌ [API] Missing PARALLEL_API_KEY');
    return new Response(JSON.stringify({ 
      error: 'Missing PARALLEL_API_KEY',
      details: 'Please set PARALLEL_API_KEY in Vercel environment variables',
      help: 'Get your key from https://parallel.ai'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!GROQ_API_KEY) {
    console.error('❌ [API] Missing GROQ_API_KEY');
    return new Response(JSON.stringify({ 
      error: 'Missing GROQ_API_KEY',
      details: 'Please set GROQ_API_KEY in Vercel environment variables',
      help: 'Get your key from https://console.groq.com'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('📝 [API] Parsing request body...');
    const body = await req.json();
    const { query } = body;
    
    console.log('📝 [API] Query received:', query);
    
    if (!query) {
      console.error('❌ [API] No query provided');
      return new Response(JSON.stringify({ 
        error: 'Query is required',
        received: body
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const execute = async ({ objective }: { objective: string }) => {
      console.log('🔎 [API] Executing search with objective:', objective);
      
      try {
        const parallel = new Parallel({
          apiKey: PARALLEL_API_KEY,
        });

        console.log('🌐 [API] Calling Parallel API...');
        const searchResult = await parallel.beta.search({
          objective,
          search_queries: undefined,
          processor: "base",
          max_results: 12,
          max_chars_per_result: 2000,
        });
        
        console.log('✅ [API] Search completed, results:', searchResult.results?.length || 0);
        return searchResult;
      } catch (error: any) {
        console.error('❌ [API] Parallel API error:', error.message);
        throw error;
      }
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
    console.log('🤖 [API] Initializing Groq...');
    const groq = createGroq({
      apiKey: GROQ_API_KEY,
    });

    // Stream the research process
    console.log('🚀 [API] Starting streamText...');
    const result = streamText({
      model: groq("meta-llama/llama-4-maverick-17b-128e-instruct"),
      system: `You are a strategic fashion buyer search agent. Your approach:

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

    // Return the streaming response in Vercel AI SDK format
    console.log('📡 [API] Returning stream response...');
    
    return new Response(result.toDataStream(), {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error: any) {
    console.error('❌ [API] Fatal error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error',
      type: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


