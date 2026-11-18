# DataWithBijay — portfolio (Next.js)

Bijay Paudel's portfolio site, built with Next.js 15 (App Router) and React 19.

## Run it on your computer

```bash
npm install
cp .env.example .env.local     # then paste your Gemini key into .env.local
npm run dev                    # open http://localhost:3000
```

## Before you publish

1. **Résumé:** put your PDF at `public/resume.pdf`. The nav button and the contact links point there.
2. **Pixel's chat:** set `GEMINI_API_KEY` (from https://aistudio.google.com/apikey). Without a key, Pixel still works and answers from his built-in answers.
3. **Contact form:** it sends to your Pageclip inbox. That address is in `components/Contact.tsx`, in the form's `action`.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project** and import the repository.
3. Under **Environment Variables**, add `GEMINI_API_KEY`, then deploy.

## Where things are

| Path | What it holds |
| --- | --- |
| `app/page.tsx` | The page: the order of all the sections |
| `app/layout.tsx` | Title, description, fonts |
| `app/globals.css` | All styles (black and mint theme) |
| `app/api/chat/route.ts` | Pixel's answers through Gemini. The key stays on the server, with a limit of 20 questions per visitor every 10 minutes |
| `lib/pixelBrain.ts` | What Pixel knows about you and how he answers. Edit this when your details change |
| `components/*.tsx` | The page sections: Nav, Hero, About, Work, Activity, Journey, Contact, Pixel and others |
| `lib/effects/*.js` | Everything that moves: the BIJAY particles, the ISS and Tiangong background, the liquid button, Pixel's flights and chat, the GitHub numbers, the clock, the pipeline run log, the skill chips, Journey tabs, the nav, the ⌘K menu |

### Live data

- **Space stations:** fresh orbit data comes from CelesTrak in the visitor's browser, cached for 6 hours. Built-in data from Nov 17, 2026 is the fallback.
- **GitHub:** the repository count, stars and "last pushed" list refresh from the GitHub API, at most once an hour per visitor. The contribution total and the longest streak are fixed numbers in `lib/effects/githubActivity.js`, read on Nov 17, 2026.
