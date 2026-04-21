# 🐨 Billy ([telegram webapp](https://t.me/BillyMoney_bot?start=source=from_github))

## Links
- 🐨 **[Billy](https://t.me/BillyMoney_bot?start=source=from_github)**
- 🌐 [Landing page](https://billy.money)
- 💬 [Community](https://t.me/Billy_Community)

## What is it?

> Your financial assistant.

<a href="https://t.me/BillyMoney_bot?start=source=from_github" target="_blank">
<img src="https://github.com/sotabots/Billy-webapp/assets/35522011/4473bff3-a002-4a10-8cfb-ce5997ca10ce" height="500">
</a>

## How to develop

### Install

```sh
npm i
npm run dev
```

### Deploy

Deployments are handled by Vercel Git Integration after pushes to the production branch.

Vercel settings:

- Framework Preset: `Vite`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `.`

Production and preview environment variables:

- `VITE_FEEDBACK_TOKEN`
- `VITE_API_URL`
- `VITE_FALLBACK_API_URL`
- `VITE_API_URLS`
- `VITE_CLARITY_ID`

`VITE_AUTH` and `VITE_USER_ID` are for local development only.
