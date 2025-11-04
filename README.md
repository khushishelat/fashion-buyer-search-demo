# Fashion Buyer Search Agent

A specialized AI-powered search agent for fashion buyers, personal shoppers, and retail professionals. Built on Parallel Search API with domain-specific filtering for fashion sources.

![Fashion Buyer Search](https://img.shields.io/badge/Powered%20by-Parallel%20Search%20API-black)

## Overview

This application transforms a generalist web search agent into a specialized fashion buying tool with intelligent source selection, seasonal awareness, and buyer-focused output formatting. It searches across retail, resale, and runway sources with customizable domain controls.

## Key Features

### 🎯 Fashion-Specific Intelligence
- **Seasonal Context**: Aware of current fashion seasons (FW25, SS25)
- **Buyer-Focused Output**: Structured reports with pricing, availability, and market insights
- **Fashion Terminology**: Understands designer names, materials, silhouettes, and style attributes

### 🌐 Source Control System
- **Domain Presets**: Quick-select from curated fashion source collections
  - 🛍️ **Retail**: Farfetch, SSENSE, Net-a-Porter, Mytheresa, Matches Fashion
  - ♻️ **Resale**: eBay, Poshmark, Grailed, Vestiaire Collective, TheRealReal
  - ✨ **Runway**: Vogue, WWD, Fashion Week Daily
  - 🇪🇺 **EU Retail**: European luxury retailers
  - 🇺🇸 **US Retail**: American fashion retailers
  - 🌱 **Sustainable**: Ethical fashion sources

- **Flexible Modes**:
  - **Allow List**: Search only selected domains
  - **Block List**: Search everywhere except blocked domains
  - **Weighted**: Apply priority multipliers to specific sources (future enhancement)

### 💼 Professional Use Cases
- **Fashion Buyers**: Source inventory for boutiques and department stores
- **Personal Shoppers**: Find specific items for clients across multiple channels
- **Trend Researchers**: Track emerging styles and designer collections
- **Resale Professionals**: Find authenticated luxury items in secondary markets

## Architecture

### Technology Stack
- **Search**: [Parallel Search API](https://parallel.ai/) - AI-optimized web search
- **AI Model**: Groq Llama 4 Maverick 17B - Fast inference with 128K context
- **Framework**: Vanilla HTML/JS with Tailwind CSS
- **Deployment**: Cloudflare Workers (serverless)

### Key Advantages
1. **Single-Call Search**: Parallel API returns relevant content in one call (vs. traditional SERP + scraping)
2. **Streaming Responses**: Real-time results as the AI searches and analyzes
3. **Domain Filtering**: Native support for include/exclude domain lists
4. **Rate Limited**: Protected with configurable IP and global rate limits

## Setup

### Prerequisites
```bash
node >= 18.0.0
npm or pnpm
Cloudflare account (for deployment)
```

### API Keys Required
1. **Parallel API Key**: Get yours at [platform.parallel.ai](https://platform.parallel.ai/)
2. **Groq API Key**: Get yours at [console.groq.com](https://console.groq.com/)

### Installation

1. **Navigate to the project**:
```bash
cd typescript-recipes-parallel-search-agent-groq
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment** - Create `.env` file:
```bash
PARALLEL_API_KEY=your_parallel_key_here
GROQ_API_KEY=your_groq_key_here
```

4. **Upload secrets to Cloudflare**:
```bash
wrangler secret bulk .env
```

5. **Create KV namespace for rate limiting**:
```bash
wrangler kv:namespace create "RATE_LIMIT_KV"
```

6. **Update `wrangler.jsonc`** with your KV namespace ID:
```json
{
  "name": "fashion-buyer-search",
  "main": "worker.ts",
  "compatibility_date": "2025-01-01",
  "kv_namespaces": [
    {
      "binding": "RATE_LIMIT_KV",
      "id": "your_kv_namespace_id_here"
    }
  ]
}
```

### Development

Run locally with Wrangler:
```bash
npm run dev
# or
wrangler dev
```

Visit `http://localhost:8787`

### Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
# or
wrangler deploy
```

Your fashion search agent will be live at your Cloudflare Workers URL.

## Usage Guide

### Basic Search
1. Enter a fashion query in natural language:
   - "FW25 shearling coats under $800 from EU designers"
   - "Coach brown bags under $400 US resale market"
   - "Metallic dresses SS25 runway looks"

2. Click preset chips to filter sources (optional)

3. Click **Search** to begin

### Advanced Source Control

#### Option 1: Preset Chips (Quick Start)
- Click preset chips below search bar
- Active presets are highlighted in black
- Click again to deselect

#### Option 2: Source Panel (Advanced)
1. Click **"⚙️ Configure Sources"**
2. Select mode (Allow List / Block List / Weighted)
3. Add domains:
   - Click preset buttons (+ Retail, + Resale, etc.)
   - Or paste domains manually (one per line)
4. Click **Apply** to save

### Query Tips for Best Results

**Include These Details**:
- Season: FW25, SS25, Resort, Pre-Fall
- Price range: "under $500", "$800-$1200"
- Region: EU, US, Asia
- Material: leather, cashmere, silk, denim
- Style: oversized, tailored, vintage, minimalist

**Example Queries**:
```
✅ "FW25 oversized wool coats $600-$1000 Scandinavian designers EU retail"
✅ "Vintage Hermès Kelly bags under $5000 authenticated resale"
✅ "SS25 linen dresses sustainable brands US shipping"
✅ "Men's Chelsea boots Italian leather under $400"
```

## Output Format

The AI provides structured buyer reports:

```markdown
**[Product Category] Search Results**

**Key Findings:**
- Price Range: $X - $Y (actual prices found)
- Availability: In stock / Pre-order / Resale
- Top Sources: Farfetch, SSENSE (with standout options)
- Season/Trend: FW25 arrival, trending style notes

**Recommended Options:**
• Brand/Designer - Item Name | $XXX | Key details | Source
• Brand/Designer - Item Name | $XXX | Key details | Source

**Market Insights:**
[Brief analysis of pricing trends, availability patterns, or notable observations]
```

## Customization

### Modify System Prompt
Click **"Configure System Prompt"** to customize the AI's behavior:
- Change output format
- Adjust search strategy
- Add specific brand preferences
- Include regional requirements

### Add Custom Domain Presets
Edit `index.html`, line ~652:
```javascript
const DOMAIN_PRESETS = {
    retail: ['farfetch.com', 'ssense.com', ...],
    // Add your custom presets:
    'japanese-brands': ['beams.co.jp', 'united-arrows.co.jp', ...],
    'sneakers': ['stockx.com', 'goat.com', 'flightclub.com']
};
```

### Adjust Rate Limits
Edit `worker.ts`, line ~51:
```typescript
limits: [
  {
    name: "IP hourly",
    requests: 100,  // Adjust as needed
    windowMs: 60 * 60 * 1000,
    limiter: getClientIP(request),
  },
  // ... more limits
]
```

## Production Considerations

### For Demo/Testing (Current Setup)
✅ Rate limiting with KV storage
✅ Basic error handling
✅ Streaming responses

### For Production Deployment (Add These)
- [ ] **Authentication**: Add user login (Clerk, Auth0, or Cloudflare Access)
- [ ] **Usage Tracking**: Log queries per user for billing
- [ ] **Enhanced Rate Limiting**: Per-user quotas
- [ ] **Monitoring**: Add Sentry or Cloudflare Analytics
- [ ] **Caching**: Cache common queries to reduce API costs
- [ ] **Domain Validation**: Robots.txt checking for blocked domains
- [ ] **Cost Alerts**: Monitor Parallel API usage

### Estimated Costs (Production)
- **Parallel API**: ~$0.01-0.03 per search (varies by results)
- **Groq API**: Free tier available, ~$0.10/1M tokens after
- **Cloudflare Workers**: Free up to 100K requests/day

## Troubleshooting

### "Missing required API keys" error
- Ensure you've run `wrangler secret bulk .env`
- Check that `.env` has both `PARALLEL_API_KEY` and `GROQ_API_KEY`

### Rate limit errors
- Wait for the rate limit window to reset
- Check KV namespace is properly configured
- Adjust limits in `worker.ts` if needed

### No results returned
- Check if domains are too restrictive (try removing domain filters)
- Verify domain names are correct (no typos)
- Try a broader query

### Slow responses
- Parallel "base" processor is optimized for speed
- Consider reducing `max_results` or `max_chars_per_result` in `worker.ts` (line ~110)
- Check Groq API status

## API Reference

### POST /
Request body:
```json
{
  "query": "FW25 shearling coats under $800 EU designers",
  "systemPrompt": "Optional custom system prompt",
  "sourceSelector": {
    "mode": "allow",  // or "block" or "weighted"
    "domains": [
      { "domain": "farfetch.com", "weight": 1.0 },
      { "domain": "ssense.com", "weight": 1.0 }
    ]
  }
}
```

Response: Server-Sent Events (SSE) stream
```
data: {"type":"tool-call","toolName":"search","args":{...}}

data: {"type":"tool-result","output":{...}}

data: {"type":"text-delta","text":"**FW25 Shearling Coats..."}

data: [DONE]
```

## Contributing

This is a demo application. To contribute:
1. Fork the repository
2. Create a feature branch
3. Test thoroughly with your own API keys
4. Submit a pull request with clear description

## License

MIT License - See LICENSE file for details

## Resources

- [Parallel Search API Documentation](https://docs.parallel.ai/)
- [Groq API Documentation](https://console.groq.com/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Original Recipe (Generalist Agent)](https://github.com/parallel-web/parallel-cookbook/tree/main/typescript-recipes/parallel-search-agent-groq)

## Support

For issues specific to:
- **Parallel Search API**: [support@parallel.ai](mailto:support@parallel.ai)
- **Groq API**: [Groq Discord](https://discord.gg/groq)
- **This Application**: Open an issue on GitHub

---

**Built for fashion professionals** | Powered by [Parallel Search API](https://parallel.ai/)

