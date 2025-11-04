# View Logs - Quick Reference 🚀

## Browser Console (Right Now)
Press `F12` → Console tab → Try a search

You'll see:
```
🔍 Starting search for: [query]
📡 Calling /api/search...
📨 Response status: 500
❌ Server error: { error: "Missing PARALLEL_API_KEY", ... }
```

## Vercel Function Logs (Server Side)

### Option 1: Real-time Logs
```
1. https://vercel.com/dashboard
2. Click your project
3. Click "Logs" (left sidebar)
4. Filter: "Functions"
5. Try a search → Watch logs appear
```

### Option 2: Function-specific Logs
```
1. https://vercel.com/dashboard
2. Click your project
3. "Deployments" → Latest deployment
4. "Functions" tab → /api/search
5. View logs
```

## What You're Looking For

✅ **Keys are set:**
```
🔑 [API] Environment check: {
  hasParallelKey: true,
  hasGroqKey: true,
  parallelKeyLength: 64,
  groqKeyLength: 51
}
```

❌ **Keys are missing:**
```
🔑 [API] Environment check: {
  hasParallelKey: false,
  hasGroqKey: false,
  parallelKeyLength: 0,
  groqKeyLength: 0
}
❌ [API] Missing PARALLEL_API_KEY
```

## Fix Missing Keys

```
Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- PARALLEL_API_KEY = [from https://parallel.ai]
- GROQ_API_KEY = [from https://console.groq.com]

Then: Deployments → ⋯ → Redeploy
```

---

📖 For detailed debugging guide, see `HOW_TO_VIEW_LOGS.md`

