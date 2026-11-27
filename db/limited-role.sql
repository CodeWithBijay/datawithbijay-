-- A limited database user for the website ("site_app").
-- The live site only needs to add visits/messages and read the stats tables, so this user can do exactly that
-- and nothing else: it cannot delete data, change tables, or read the contents of contact messages.
--
-- How to use (one time):
--   1. Neon console → your project → Branches → main → Roles → "New role", name it  site_app
--      Neon shows the password once: copy it straight into the connection string in step 3.
--   2. Neon console → SQL Editor → paste this whole file → Run.
--   3. Neon console → Dashboard → Connect → pick role site_app → copy the connection string.
--      Vercel → datawithbijay2 → Settings → Environment Variables → DATABASE_URL → replace the value → Save → Redeploy.
--   Keep the GitHub Actions secret DATABASE_URL on the owner role: the nightly rollup needs to rebuild reporting tables.

GRANT USAGE ON SCHEMA raw, reporting, ops TO site_app;

-- visit counter (/api/track) and the live numbers on /stats
GRANT INSERT, SELECT ON raw.pageviews TO site_app;

-- what visitors ask Tally (topic and length only)
GRANT INSERT ON raw.chat_questions TO site_app;

-- contact form backup copy: add a message and mark it as emailed, but never read message contents
GRANT INSERT ON raw.contact_messages TO site_app;
GRANT SELECT (id, email), UPDATE (emailed) ON raw.contact_messages TO site_app;

-- the /stats page reads the nightly summary tables
GRANT SELECT ON ALL TABLES IN SCHEMA reporting TO site_app;
-- (if you add a new reporting table later, run this line again so the site can read it)
GRANT SELECT ON ops.pipeline_runs TO site_app;

-- rate limits for the contact form and chat
GRANT SELECT, INSERT, DELETE ON ops.rate_limits TO site_app;

-- auto-numbered id columns need this to insert rows
GRANT USAGE ON ALL SEQUENCES IN SCHEMA raw TO site_app;
