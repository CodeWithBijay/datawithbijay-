import { neon } from "@neondatabase/serverless";

// One small helper for the stats warehouse. DATABASE_URL is set in Vercel (Neon project "portfolio_stats").
export const db = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
