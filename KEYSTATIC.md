# Content editor (Keystatic)

Edit your site's content at **https://www.bijay-paudel.com.np/keystatic** — no code needed.

| In the editor | What it changes on the site | Saved in |
|---|---|---|
| **Projects** | Cards in Projects → "All projects", with the type/tool filters and counts | `content/projects/*.json` |
| **Blog posts** | A card on Writing + its own page at `/writing/<web address name>` | `content/posts/*.mdoc` |
| **Journey** | Experience, Education and Certificates tabs (drag to reorder) | `content/journey.json` |

Every **Save** is a commit to the GitHub repo, so Vercel redeploys and the change is live in about a minute.
Blog posts start as **Draft** (hidden). Untick *Draft* and save when you're ready to publish.

Not editable here (still in the page code): the two big featured project layouts at the top of Projects,
the hand-built "1 API call → 8 layers" post, and the case-study pages.

---

## One-time setup (about 10 minutes)

The editor logs in with GitHub. It needs its own small GitHub App, created once from your computer.
Until this is done, `/keystatic` on the live site says "not set up yet" — the rest of the site works normally.

1. In Terminal, in your site folder:
   ```bash
   npm install
   NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev
   ```
2. Open **http://127.0.0.1:3000/keystatic** and click **Create GitHub App**.
3. GitHub opens. Give the app a name (for example `bijay-site-editor`), click **Create**,
   then choose **Only select repositories → datawithbijay-** and **Install**.
4. You're sent back to the editor, now connected to GitHub. Keystatic wrote four values into a new `.env` file
   in your site folder:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
   (`.env` is already ignored by Git, so these secrets never get committed.)
5. **Vercel** → datawithbijay2 → Settings → Environment Variables → add those four, same names and values.
6. **GitHub** → Settings → Developer settings → GitHub Apps → your app → **Callback URL** → add
   `https://www.bijay-paudel.com.np/api/keystatic/github/oauth/callback` → Save.
7. Vercel → Deployments → **Redeploy** the latest one.
8. Open https://www.bijay-paudel.com.np/keystatic → **Log in with GitHub**. Done.

Only GitHub accounts with write access to the repo can log in.

## Editing on your computer instead

`npm run dev` and open http://127.0.0.1:3000/keystatic. With no extra setting it saves straight into the files
in your folder (no login); commit and push as usual.
