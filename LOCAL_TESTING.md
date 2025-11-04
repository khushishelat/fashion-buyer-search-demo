# Local Testing Guide

## Ready to Test! 🚀

Your fashion buyer search agent is ready. Follow these steps to test on localhost.

## Quick Test (If you already have API keys)

### 1. Navigate to project directory
```bash
cd typescript-recipes-parallel-search-agent-groq
```

### 2. Install dependencies (if not already done)
```bash
npm install
```

### 3. Create `.env` file with your API keys
```bash
cat > .env << 'EOF'
PARALLEL_API_KEY=your_actual_parallel_key
GROQ_API_KEY=your_actual_groq_key
EOF
```

Replace `your_actual_parallel_key` and `your_actual_groq_key` with your real keys.

### 4. Start local development server
```bash
npm run dev
```

You should see:
```
⛅️ wrangler 3.93.0
-------------------
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

### 5. Open in browser
```
http://localhost:8787
```

## Test Checklist

### ✅ Basic Functionality

1. **Test Search Without Filters**
   - Enter: `FW25 shearling coats under $800 EU designers`
   - Click "Search"
   - ✓ Should stream results in real-time
   - ✓ Should show "Searching Web" indicator
   - ✓ Should display structured buyer report

2. **Test Preset Chips**
   - Click "🛍️ Retail" chip
   - ✓ Chip should turn black (active state)
   - Enter: `wool coats under $600`
   - Click "Search"
   - ✓ Should search only retail domains
   - ✓ Results should show Farfetch, SSENSE, etc.

3. **Test Multiple Presets**
   - Click "🛍️ Retail" (if not already active)
   - Click "🇪🇺 EU Retail" 
   - ✓ Both should be active (black)
   - Enter: `designer bags under $1000`
   - Click "Search"
   - ✓ Should search combined domains from both presets

4. **Test Resale Preset**
   - Click active chips to deselect them
   - Click "♻️ Resale"
   - Enter: `Coach brown bags under $400 authenticated`
   - Click "Search"
   - ✓ Should search eBay, Poshmark, Grailed, Vestiaire, TheRealReal

### ✅ Advanced Source Control

5. **Test Sources Panel**
   - Click "⚙️ Configure Sources"
   - ✓ Panel should slide in from right
   - ✓ "Allow List" should be selected by default

6. **Test Mode Switching**
   - In sources panel, click "Block List"
   - ✓ Button should turn black
   - Click "Allow List" again
   - ✓ Button should return to black

7. **Test Adding Custom Domains**
   - In sources panel, paste in textarea:
     ```
     mytheresa.com
     luisaviaroma.com
     brownsfashion.com
     ```
   - Click "Add Domains"
   - ✓ Domains should appear in "Current Domains" list
   - ✓ Each should have an × button

8. **Test Removing Domains**
   - Click × on one domain
   - ✓ Domain should disappear from list

9. **Test Clear All**
   - Add several domains
   - Click "Clear All"
   - ✓ All domains should be removed
   - ✓ Should show "No domains added yet"

10. **Test Preset Add Buttons**
    - In sources panel, click "+ Retail"
    - ✓ Should add 5 retail domains to list
    - Click "+ Resale"
    - ✓ Should add 5 more resale domains

11. **Test Apply and Search**
    - Keep some domains in the list
    - Click "Apply"
    - ✓ Panel should close
    - Enter a query and search
    - ✓ Should use only the domains you configured

### ✅ UI/UX Tests

12. **Test Mobile Responsive**
    - Resize browser to mobile width (< 640px)
    - ✓ Preset chips should wrap
    - ✓ Search bar should be full width
    - ✓ Sources panel should be full width
    - ✓ All buttons should be tappable

13. **Test New Search Button**
    - After a search completes, click "New Search"
    - ✓ Should return to search interface
    - ✓ Previous results should clear
    - ✓ Search input should be empty

14. **Test Results Sources Button**
    - After a search, click "Sources" button in results header
    - ✓ Should open sources panel
    - ✓ Should show currently selected domains

15. **Test System Prompt Config**
    - Click "Configure System Prompt"
    - ✓ Modal should appear
    - Paste custom prompt:
      ```
      You are a buyer for sustainable fashion brands only.
      Focus on eco-friendly materials and ethical production.
      ```
    - Click "Save"
    - ✓ Modal should close
    - Run a search
    - ✓ Results should reflect custom prompt focus

### ✅ Error Handling

16. **Test Empty Search**
    - Leave search input empty
    - Click "Search"
    - ✓ Nothing should happen (graceful handling)

17. **Test Invalid Domains**
    - Add domain: `not a real domain!!!`
    - Try to search
    - ✓ Should either normalize or handle gracefully

18. **Test Overlay Close**
    - Open sources panel
    - Click on dark overlay (outside panel)
    - ✓ Panel should close

19. **Test Keyboard Shortcuts**
    - Focus search input
    - Type query and press Enter
    - ✓ Should trigger search

### ✅ Performance Tests

20. **Test Streaming**
    - Start a search
    - ✓ Tool call should appear immediately
    - ✓ Results should appear while AI is thinking
    - ✓ Final answer should stream word by word

21. **Test Multiple Searches**
    - Run 3-4 searches in a row
    - ✓ Each should complete successfully
    - ✓ No memory leaks or slowdowns

22. **Test Abort/Cancel**
    - Start a search
    - Immediately click "New Search"
    - ✓ Previous search should abort
    - ✓ No errors in console

## Sample Test Queries

### For Retail Testing:
```
FW25 wool coats oversized $600-$900 EU designers
```

### For Resale Testing:
```
Hermès scarves authenticated under $400
```

### For Runway Testing:
```
metallic fabrics SS25 runway looks
```

### For Multi-Market Testing:
```
Scandinavian designers minimalist dresses under $500
```

## Expected Output Format

Each search should return something like:

```
**[Category] Search Results**

**Key Findings:**
- Price Range: $X - $Y
- Availability: In stock / Pre-order
- Top Sources: [retailer names]
- Season/Trend: FW25 relevant notes

**Recommended Options:**
• Brand - Item | $XXX | Details | Source
• Brand - Item | $XXX | Details | Source

**Market Insights:**
[Brief analysis of trends]
```

## Troubleshooting

### "Missing required API keys"
- Check your `.env` file exists
- Verify keys are correct (no quotes needed)
- Restart `npm run dev`

### "Rate limiting service unavailable"
- The KV namespace isn't needed for local testing
- This error can be ignored in dev mode
- Or comment out rate limiting check in `worker.ts` (lines 36-38)

### No results / Empty response
- Check browser console for errors (F12)
- Verify API keys are valid
- Try without domain filters first
- Check network tab for 500 errors

### Streaming not working
- Check that `Content-Type: text/event-stream` header is present
- Verify browser supports EventSource/SSE
- Check for ad blockers interfering

### TypeScript errors
- Run `npm install` again
- These are expected and won't prevent testing
- Worker will still compile and run

## Console Debugging

Open browser console (F12) and check:

### Should see:
```javascript
// When sources panel opens:
sourceSelector: {mode: "allow", domains: [{domain: "farfetch.com", weight: 1}]}

// When search starts:
POST / {query: "...", sourceSelector: {...}}

// When streaming:
data: {"type":"tool-call",...}
data: {"type":"text-delta",...}
```

### Should NOT see:
- CORS errors
- 500 errors
- "undefined" in requests
- Failed to fetch

## Success Criteria

✅ All 22 tests pass
✅ No console errors
✅ Streaming works smoothly
✅ Domain filtering affects results
✅ UI is responsive and smooth
✅ Results are fashion-focused and structured

## Next Steps After Testing

Once local testing is successful:

1. **Deploy to Cloudflare**:
   ```bash
   # Upload secrets
   wrangler secret bulk .env
   
   # Deploy
   npm run deploy
   ```

2. **Test production URL**:
   - Run same test checklist
   - Verify rate limiting works
   - Test from different IPs

3. **Share with team**:
   - Send production URL
   - Share example queries
   - Collect feedback

4. **Monitor usage**:
   - Check Parallel dashboard for API usage
   - Check Cloudflare analytics
   - Monitor costs

## Questions?

- Check main [README.md](../README.md)
- Review [EXAMPLE_QUERIES.md](./EXAMPLE_QUERIES.md)
- See [QUICK_START.md](../QUICK_START.md)

---

**Ready to test?** Run `npm run dev` and visit `http://localhost:8787` 🚀

