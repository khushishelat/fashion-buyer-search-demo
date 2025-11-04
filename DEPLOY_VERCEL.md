# 🚀 Deploy to Vercel in 3 Steps

## 1. Install Vercel CLI

```bash
npm install -g vercel
```

## 2. Set Environment Variables

Create `.env` file in the root:

```bash
PARALLEL_API_KEY=your_parallel_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

## 3. Deploy!

```bash
npm install
vercel
```

That's it! Vercel will:
- Ask you to login (first time only)
- Set up the project
- Deploy in ~30 seconds
- Give you a live URL: `https://fashion-buyer-search-xxx.vercel.app`

---

## Add Environment Variables to Vercel Dashboard

After first deploy, add your secrets:

1. Go to your project dashboard
2. Settings → Environment Variables
3. Add:
   - `PARALLEL_API_KEY` = your key
   - `GROQ_API_KEY` = your key
4. Redeploy: `vercel --prod`

---

## Share with Team

Your URL will look like:
`https://fashion-buyer-search.vercel.app`

Every git push auto-deploys! 🎉


