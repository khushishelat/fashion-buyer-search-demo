# Setup Guide - Fashion Buyer Search

## Fixing the 500 Error

The 500 error on `/api/search` is caused by missing environment variables. Follow these steps:

### 1. Create Environment Variables

You need to set up two API keys:

#### Get Parallel API Key
1. Sign up at https://parallel.ai
2. Get your API key from the dashboard

#### Get Groq API Key
1. Sign up at https://console.groq.com
2. Create an API key

### 2. Set Environment Variables in Vercel

If you're deploying on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `PARALLEL_API_KEY` = your_parallel_api_key
   - `GROQ_API_KEY` = your_groq_api_key
4. Redeploy your application

### 3. Local Development

For local testing, create a `.env` file in the root directory:

```bash
PARALLEL_API_KEY=your_parallel_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

**Note:** Never commit the `.env` file to git (it's already in `.gitignore`)

### 4. Test the Application

After setting up the environment variables:
1. Redeploy on Vercel or restart your local server
2. Try a search query like "vintage Hermès bags under $3000"
3. The 500 error should be resolved

## Other Fixed Issues

✅ **Favicon 404 Error** - Added `/favicon.svg`
✅ **Logo Integration** - Updated to use `/logo.svg`
✅ **Zod Import** - Fixed incorrect import path from `zod/v4` to `zod`

## Tailwind CDN Warning

The warning about Tailwind CDN is informational. For production optimization, consider:
- Installing Tailwind CSS via npm: `npm install -D tailwindcss`
- Setting up a build process with PostCSS
- See: https://tailwindcss.com/docs/installation

However, for this demo application, the CDN version works fine.

