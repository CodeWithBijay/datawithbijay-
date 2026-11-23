-- Nightly rollup: raw.pageviews → reporting.*   (run by .github/workflows/stats-rollup.yml)
-- Rebuilds the last 3 complete days in Central Time, so it is safe to re-run (idempotent).
-- psql variable :trigger is 'schedule' or 'manual'.
\set ON_ERROR_STOP on
BEGIN;

INSERT INTO ops.pipeline_runs (triggered_by) VALUES (:'trigger');

CREATE TEMP TABLE w ON COMMIT DROP AS
SELECT (ts AT TIME ZONE 'America/Chicago')::date AS day,
       ts,
       path,
       visitor_id,
       country,
       device,
       CASE
         WHEN referrer_host IS NULL OR referrer_host = ''          THEN 'Direct'
         WHEN referrer_host ~* 'linkedin|lnkd\.in'                 THEN 'LinkedIn'
         WHEN referrer_host ~* '(^|\.)google\.'                    THEN 'Google'
         WHEN referrer_host ~* 'bing\.com'                         THEN 'Bing'
         WHEN referrer_host ~* 'duckduckgo'                        THEN 'DuckDuckGo'
         WHEN referrer_host ~* 'github\.com'                       THEN 'GitHub'
         WHEN referrer_host ~* 'chatgpt\.com|openai\.com'          THEN 'ChatGPT'
         WHEN referrer_host ~* 'perplexity'                        THEN 'Perplexity'
         WHEN referrer_host ~* 't\.co$|twitter\.com|x\.com'        THEN 'X / Twitter'
         ELSE referrer_host
       END AS source
FROM raw.pageviews
WHERE ts >= (((now() AT TIME ZONE 'America/Chicago')::date - 3)::timestamp AT TIME ZONE 'America/Chicago')
  AND ts <  (((now() AT TIME ZONE 'America/Chicago')::date)::timestamp     AT TIME ZONE 'America/Chicago');

-- clear the window, then rebuild it
DELETE FROM reporting.daily_traffic   WHERE day >= (now() AT TIME ZONE 'America/Chicago')::date - 3;
DELETE FROM reporting.daily_pages     WHERE day >= (now() AT TIME ZONE 'America/Chicago')::date - 3;
DELETE FROM reporting.daily_sources   WHERE day >= (now() AT TIME ZONE 'America/Chicago')::date - 3;
DELETE FROM reporting.daily_countries WHERE day >= (now() AT TIME ZONE 'America/Chicago')::date - 3;
DELETE FROM reporting.daily_devices   WHERE day >= (now() AT TIME ZONE 'America/Chicago')::date - 3;

INSERT INTO reporting.daily_traffic   SELECT day, COUNT(*), COUNT(DISTINCT visitor_id) FROM w GROUP BY day;
INSERT INTO reporting.daily_pages     SELECT day, path, COUNT(*), COUNT(DISTINCT visitor_id) FROM w GROUP BY day, path;
-- where people came from = the source of each visitor's FIRST page view that day
INSERT INTO reporting.daily_sources
SELECT day, source, COUNT(*)
FROM (SELECT DISTINCT ON (day, visitor_id) day, source FROM w ORDER BY day, visitor_id, ts) first_views
GROUP BY day, source;
INSERT INTO reporting.daily_countries SELECT day, COALESCE(country, 'Unknown'), COUNT(DISTINCT visitor_id) FROM w GROUP BY 1, 2;
INSERT INTO reporting.daily_devices   SELECT day, COALESCE(device, 'unknown'),  COUNT(DISTINCT visitor_id) FROM w GROUP BY 1, 2;

-- what visitors ask Tally
DELETE FROM reporting.daily_topics WHERE day >= (now() AT TIME ZONE 'America/Chicago')::date - 3;
INSERT INTO reporting.daily_topics
SELECT (ts AT TIME ZONE 'America/Chicago')::date, topic, COUNT(*)
FROM raw.chat_questions
WHERE ts >= (((now() AT TIME ZONE 'America/Chicago')::date - 3)::timestamp AT TIME ZONE 'America/Chicago')
  AND ts <  (((now() AT TIME ZONE 'America/Chicago')::date)::timestamp     AT TIME ZONE 'America/Chicago')
GROUP BY 1, 2;

-- keep raw events for 90 days only
DELETE FROM raw.pageviews WHERE ts < now() - interval '90 days';
DELETE FROM raw.chat_questions WHERE ts < now() - interval '90 days';

UPDATE ops.pipeline_runs
   SET finished_at = now(), status = 'success',
       raw_rows   = (SELECT COUNT(*) FROM w),
       days_built = (SELECT COUNT(DISTINCT day) FROM w)
 WHERE id = (SELECT max(id) FROM ops.pipeline_runs);

COMMIT;
