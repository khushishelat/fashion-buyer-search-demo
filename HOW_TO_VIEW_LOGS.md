# How to View Logs & Debug the 500 Error 🔍

## Quick Log Access

### 1️⃣ **Browser Console Logs** (Immediate)
Open your browser's developer tools:
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: Enable Developer menu, then press `Cmd+Option+C`

**What you'll see:**
- 🔍 Starting search for: [your query]
- 📡 Calling /api/search...
- 📨 Response status: 500
- ❌ Server error: {detailed error object}

### 2️⃣ **Vercel Function Logs** (Server-side)

#### Method A: Real-time Logs (Recommended)
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Click **"Logs"** in the left sidebar
4. Filter by **"Functions"**
5. Try a search in your app
6. Watch logs appear in real-time

**What you'll see:**
```
🔍 [API] Search request received
🔑 [API] Environment check: { hasParallelKey: false, hasGroqKey: false, ... }
❌ [API] Missing PARALLEL_API_KEY
```

#### Method B: Deployment Logs
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Click **"Deployments"**
4. Click on the latest deployment
5. Click **"Functions"** tab
6. Click on `/api/search` function
7. View logs for that specific function

### 3️⃣ **Network Tab** (HTTP Details)
In Browser DevTools:
1. Open DevTools (`F12`)
2. Click **"Network"** tab
3. Try a search
4. Click on the `/api/search` request
5. View:
   - **Headers**: Request/response headers
   - **Payload**: What was sent `{ "query": "..." }`
   - **Response**: Error details returned from server

## Common Errors & What They Mean

### Error: "Missing PARALLEL_API_KEY"
**Logs show:**
```
❌ [API] Missing PARALLEL_API_KEY
```

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `PARALLEL_API_KEY` = [your key from https://parallel.ai]
3. Redeploy

### Error: "Missing GROQ_API_KEY"
**Logs show:**
```
❌ [API] Missing GROQ_API_KEY
```

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `GROQ_API_KEY` = [your key from https://console.groq.com]
3. Redeploy

### Error: "Invalid API key" or "Unauthorized"
**Logs show:**
```
🔑 [API] Environment check: { hasParallelKey: true, parallelKeyLength: 32, ... }
❌ [API] Parallel API error: Unauthorized
```

**Solution:**
- Your API key is set but invalid
- Double-check the key value in Vercel environment variables
- Regenerate key if needed

### Error: Network or timeout issues
**Logs show:**
```
🌐 [API] Calling Parallel API...
❌ [API] Parallel API error: timeout of 60000ms exceeded
```

**Solution:**
- The API call is timing out
- Check Parallel API status
- Verify network connectivity

## Step-by-Step Debugging Process

### Step 1: Check Browser Console
```bash
F12 → Console tab → Try a search → Look for errors
```

### Step 2: Check Network Request
```bash
F12 → Network tab → Try a search → Click /api/search → Check Response tab
```

### Step 3: Check Vercel Logs
```bash
Vercel Dashboard → Your Project → Logs → Filter: Functions → Try a search
```

### Step 4: Verify Environment Variables
```bash
Vercel Dashboard → Your Project → Settings → Environment Variables
✅ PARALLEL_API_KEY should be present
✅ GROQ_API_KEY should be present
```

### Step 5: Redeploy
```bash
Vercel Dashboard → Deployments → ⋯ Menu → Redeploy
```

## Enhanced Logging Features

With the latest update, you now get:
- ✅ Emoji-coded log levels (🔍 Info, ❌ Error, ✅ Success)
- ✅ Detailed environment checks
- ✅ API key length verification (without exposing keys)
- ✅ Stack traces in development mode
- ✅ Timestamp on all errors
- ✅ Specific error messages for each failure point

## Testing the Logs

Try a search query now and you should see detailed logs like:

**Browser Console:**
```
🔍 Starting search for: vintage Hermès bags
📡 Calling /api/search...
📨 Response status: 500
❌ Server error: {
  error: "Missing PARALLEL_API_KEY",
  details: "Please set PARALLEL_API_KEY in Vercel environment variables",
  help: "Get your key from https://parallel.ai",
  timestamp: "2025-11-04T..."
}
```

**Vercel Logs:**
```
🔍 [API] Search request received
🔑 [API] Environment check: {
  hasParallelKey: false,
  hasGroqKey: false,
  parallelKeyLength: 0,
  groqKeyLength: 0
}
❌ [API] Missing PARALLEL_API_KEY
```

## Still Having Issues?

If logs don't appear or you need more help:

1. **Verify you redeployed** after updating the code
2. **Check you're looking at the latest deployment** in Vercel
3. **Try in incognito mode** to rule out cache issues
4. **Share the logs** from both browser console and Vercel function logs for further debugging

## Quick Links

- Vercel Dashboard: https://vercel.com/dashboard
- Parallel AI: https://parallel.ai
- Groq Console: https://console.groq.com

