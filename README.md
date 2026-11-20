# DataWithBijay — Blueprint design

Bijay Paudel's portfolio (Next.js 15). Live at https://www.bijay-paudel.com.np

## Where things live
| File | What it is |
|---|---|
| `components/markup.ts` | All page text and layout (edit wording here; keep ids and class names) |
| `app/globals.css` | All styles |
| `lib/site.js` | All behaviour: SQL loaders, pages (`#/work`, `#/blog`…), Pixel, case studies, résumé, blog post, contact form |
| `components/Site.tsx` | Puts the markup on the page and starts `lib/site.js` |
| `app/api/chat/route.ts` + `lib/pixelBrain.ts` | Pixel's AI answers (Gemini). Needs `GEMINI_API_KEY` in Vercel |
| `public/resume.pdf` | Résumé that the Download buttons serve |
| `app/layout.tsx` | SEO title, description, Open Graph, fonts |
| `next.config.mjs` | Security headers |

## Run locally
```bash
npm install
npm run dev     # http://localhost:3000
```
