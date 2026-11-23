-- Portfolio stats warehouse (Neon Postgres). Same layering as my St. Louis HELP pipeline:
--   raw        → events exactly as they arrive from the website
--   reporting  → daily tables the /stats page reads, rebuilt nightly by GitHub Actions
--   ops        → a log of every pipeline run
-- Privacy: no cookies, no IP addresses stored. visitor_id is a salted hash that changes every day.

CREATE SCHEMA IF NOT EXISTS raw;
CREATE SCHEMA IF NOT EXISTS reporting;
CREATE SCHEMA IF NOT EXISTS ops;

CREATE TABLE IF NOT EXISTS raw.pageviews (
  id            bigserial PRIMARY KEY,
  ts            timestamptz NOT NULL DEFAULT now(),
  path          text        NOT NULL,
  referrer_host text,
  country       text,
  device        text,
  visitor_id    text
);
CREATE INDEX IF NOT EXISTS pageviews_ts_idx ON raw.pageviews (ts);

-- what visitors ask Tally: topic and length only, never the question text
CREATE TABLE IF NOT EXISTS raw.chat_questions (
  id    bigserial PRIMARY KEY,
  ts    timestamptz NOT NULL DEFAULT now(),
  topic text NOT NULL,
  len   int,
  mode  text NOT NULL DEFAULT 'chat'
);
CREATE INDEX IF NOT EXISTS chat_questions_ts_idx ON raw.chat_questions (ts);

CREATE TABLE IF NOT EXISTS reporting.daily_traffic   (day date PRIMARY KEY, views int NOT NULL, visitors int NOT NULL);
CREATE TABLE IF NOT EXISTS reporting.daily_pages     (day date, path text,    views int NOT NULL, visitors int NOT NULL, PRIMARY KEY (day, path));
CREATE TABLE IF NOT EXISTS reporting.daily_sources   (day date, source text,  visits int NOT NULL, PRIMARY KEY (day, source));
CREATE TABLE IF NOT EXISTS reporting.daily_countries (day date, country text, visitors int NOT NULL, PRIMARY KEY (day, country));
CREATE TABLE IF NOT EXISTS reporting.daily_devices   (day date, device text,  visitors int NOT NULL, PRIMARY KEY (day, device));
CREATE TABLE IF NOT EXISTS reporting.daily_topics    (day date, topic text,   questions int NOT NULL, PRIMARY KEY (day, topic));

CREATE TABLE IF NOT EXISTS ops.pipeline_runs (
  id          bigserial PRIMARY KEY,
  started_at  timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status      text NOT NULL DEFAULT 'running',
  raw_rows    int,
  days_built  int,
  triggered_by text
);
