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

### Telegram Web App SDK

The app serves its own copy of the Telegram Web App SDK from
`public/vendor/telegram-web-app.124bdff7ba3f.js`, loaded before the React entry point.
It does not download the SDK from Telegram when the app opens.

- Source: https://telegram.org/js/telegram-web-app.js
- Downloaded: 2026-10-07
- SHA-256: `124bdff7ba3fe86c8ba5143467afec21e020405e74abdb92cfdda6c0ee3b5908`

The SDK is an unmodified snapshot. Vercel serves it with
`Cache-Control: public, max-age=31536000, immutable` so browsers can reuse it.
To update it, download the source again, compute its SHA-256, use the first 12
hex characters in the filename, and update the paths in `index.html` and
`vercel.json` along with the date and full checksum here. Do not overwrite the
existing filename with different contents because it is cached for one year.

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
