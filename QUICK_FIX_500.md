# Quick Fix for 500 Error ⚡

## Problem
`/api/search` returns 500 error

## Root Cause
Missing API keys in environment variables

## Solution (2 minutes)

### For Vercel Deployment:

1. **Go to Vercel Dashboard**
   - Open your project
   - Click "Settings" → "Environment Variables"

2. **Add These Two Variables:**
   ```
   PARALLEL_API_KEY = [your key from parallel.ai]
   GROQ_API_KEY = [your key from console.groq.com]
   ```

3. **Redeploy**
   - Click "Deployments" → "..." → "Redeploy"

### Where to Get Keys:

- **Parallel API Key**: https://parallel.ai (sign up → dashboard)
- **Groq API Key**: https://console.groq.com (sign up → API keys)

## Verification

After redeploying, test with:
```
vintage Hermès bags under $3000
```

Should see search results instead of 500 error! ✅

## Other Fixes Applied:
- ✅ Fixed zod import error
- ✅ Added favicon.svg (no more 404)
- ✅ Integrated logo.svg
- ✅ Updated vercel.json rewrites
