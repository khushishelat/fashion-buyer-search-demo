# Quick Start Guide

Get your Fashion Buyer Search Agent running in 5 minutes.

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Cloudflare account created
- [ ] Parallel API key from [platform.parallel.ai](https://platform.parallel.ai/)
- [ ] Groq API key from [console.groq.com](https://console.groq.com/)

## Step-by-Step Setup

### 1. Install Dependencies (1 min)

```bash
cd typescript-recipes-parallel-search-agent-groq
npm install
```

### 2. Configure API Keys (1 min)

Create `.env` file in the project root:

```bash
PARALLEL_API_KEY=your_parallel_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Set Up Cloudflare (2 min)

**a) Login to Cloudflare:**
```bash
npx wrangler login
```

**b) Create KV namespace:**
```bash
npx wrangler kv:namespace create "RATE_LIMIT_KV"
```

Copy the ID from output (looks like: `id = "abc123..."`).

**c) Update `wrangler.jsonc`:**
```jsonc
{
  "name": "fashion-buyer-search",
  "main": "worker.ts",
  "compatibility_date": "2025-01-01",
  "kv_namespaces": [
    {
      "binding": "RATE_LIMIT_KV",
      "id": "PASTE_YOUR_KV_ID_HERE"  // ← Paste here
    }
  ]
}
```

**d) Upload secrets:**
```bash
npx wrangler secret bulk .env
```

### 4. Test Locally (1 min)

```bash
npm run dev
```

Visit: `http://localhost:8787`

Try a search:
```
FW25 shearling coats under $800 EU designers
```

### 5. Deploy to Production (30 seconds)

```bash
npm run deploy
```

Your agent will be live at: `https://fashion-buyer-search.[your-subdomain].workers.dev`

## First Search Tutorial

### Example 1: Basic Retail Search

1. **Open the app** (localhost or deployed URL)

2. **Click preset**: Click "🛍️ Retail" chip

3. **Enter query**:
   ```
   FW25 wool coats oversized under $800
   ```

4. **Click Search**

**What to expect:**
- AI searches across Farfetch, SSENSE, Net-a-Porter, etc.
- Returns structured report with prices, availability, brands
- Shows source links for each result

### Example 2: Resale Market Search

1. **Clear previous selection**: Click "🛍️ Retail" again to deselect

2. **Click "♻️ Resale"**

3. **Enter query**:
   ```
   Coach brown leather bags authenticated under $400
   ```

4. **Click Search**

**What to expect:**
- Searches eBay, Poshmark, Grailed, Vestiaire, TheRealReal
- Focuses on authenticated/verified listings
- Shows pricing trends across resale platforms

### Example 3: Advanced Source Control

1. **Click "⚙️ Configure Sources"**

2. **Select Mode**: Click "Allow List"

3. **Add domains**:
   - Click "+ Retail" button
   - Click "+ EU Retail" button

4. **Add custom domain**: Type in textarea:
   ```
   brownsfashion.com
   ```

5. **Click "Add Domains"**, then **"Apply"**

6. **Enter query**:
   ```
   Scandinavian designers minimalist dresses under $500
   ```

7. **Click Search**

**What to expect:**
- Searches only European luxury retailers
- More focused results from EU market
- Pricing in EUR and GBP

## Troubleshooting

### "Missing required API keys"
```bash
# Re-upload secrets
npx wrangler secret bulk .env
```

### "Rate limiting service unavailable"
```bash
# Check KV namespace is created
npx wrangler kv:namespace list

# Verify wrangler.jsonc has correct ID
```

### "Command 'wrangler' not found"
```bash
# Use npx prefix
npx wrangler dev
npx wrangler deploy
```

### No results returned
- Try searching without domain filters first
- Check if query is too specific
- Verify API keys are correct

## What's Next?

### Customize for Your Use Case

**1. Add Your Favorite Brands/Retailers:**

Edit `index.html`, line ~652:
```javascript
const DOMAIN_PRESETS = {
  // Add your custom preset
  'my-brands': ['brand1.com', 'brand2.com', 'brand3.com'],
  // ...existing presets
};
```

**2. Adjust System Prompt:**

Click "Configure System Prompt" in the app and paste:
```
You are a fashion buyer specializing in [YOUR NICHE].
Focus on [YOUR SPECIFIC CRITERIA].
Always highlight [YOUR PRIORITIES].
```

**3. Modify Rate Limits:**

Edit `worker.ts`, line ~51:
```typescript
requests: 50,  // Reduce for demo, increase for production
```

## Production Checklist

Before going live with clients:

- [ ] Test with 10+ diverse queries
- [ ] Verify all domain presets work
- [ ] Add user authentication (Clerk, Auth0)
- [ ] Set up monitoring (Sentry, Cloudflare Analytics)
- [ ] Configure usage tracking per user
- [ ] Set budget alerts in Parallel dashboard
- [ ] Add custom domain in Cloudflare
- [ ] Test rate limiting with multiple IPs
- [ ] Document any custom presets for your team

## Example Workflows

### Workflow 1: Weekly Inventory Sourcing

**Goal**: Find 20 new items across 3 categories for boutique

**Steps**:
1. Monday AM: Search FW25 outerwear ($400-$800)
2. Monday PM: Search accessories/bags ($200-$500)
3. Tuesday: Search footwear ($250-$600)
4. Use Retail preset for each search
5. Click through top 5 results per search
6. Add to buying sheet

**Time saved**: ~2 hours vs manual browsing

### Workflow 2: Client Personal Shopping

**Goal**: Find specific item for high-value client

**Steps**:
1. Parse client request: "navy wool coat, Italian, under $1200"
2. Configure sources: Allow List → EU Retail + Sustainability
3. Search: "navy wool coats Italian designers under $1200 FW25"
4. Review top 3 recommendations
5. Send client links with AI's market insights

**Time saved**: ~45 minutes vs manual searching

### Workflow 3: Market Research

**Goal**: Understand FW25 shearling trend pricing

**Steps**:
1. Search: "FW25 shearling coats runway looks designer brands"
2. Note: Runway preset selected
3. Review trend analysis from AI
4. Switch to Retail preset
5. Search: "FW25 shearling coats $500-$1500 available now"
6. Compare runway looks vs retail pricing
7. Compile trend report with insights

**Time saved**: ~3 hours vs manual research

## Support & Resources

- **Documentation**: [README.md](../README.md)
- **Example Queries**: [EXAMPLE_QUERIES.md](./EXAMPLE_QUERIES.md)
- **Parallel API Docs**: [docs.parallel.ai](https://docs.parallel.ai/)
- **Issues**: Open a GitHub issue

## Tips from Pro Users

💡 **"I save common searches in a doc"** - Create a personal query library for your frequently searched categories.

💡 **"Use block list for competitors"** - Block competitor domains to focus on your own sourcing channels.

💡 **"Preset combos are powerful"** - Retail + EU Retail gives comprehensive European coverage.

💡 **"Include 'in stock' for urgency"** - Client needs something this week? Add "available now" or "in stock".

💡 **"Save custom presets in comments"** - Document your custom domain lists in code comments for team reference.

---

🎉 **You're ready to search!**

Try these starter queries:
- `FW25 shearling coats under $800 EU designers`
- `Coach brown bags under $400 authenticated resale`
- `SS25 linen dresses sustainable brands under $300`

