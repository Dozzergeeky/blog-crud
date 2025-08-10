import { Pool } from 'pg';

// Expect DATABASE_URL in env (Vercel + local .env.local)
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('[pg] DATABASE_URL env var is not set.');
}

function sanitizeConnectionString(url?: string) {
  if (!url) return url;
  try {
    const u = new URL(url);
    // Some Neon URLs include channel_binding=require which can cause issues with certain pg client versions.
    if (u.searchParams.get('channel_binding') === 'require') {
      u.searchParams.delete('channel_binding');
      console.warn('[pg] Removed channel_binding=require from connection string for compatibility.');
    }
    return u.toString();
  } catch (e) {
    return url; // fallback silently
  }
}

connectionString = sanitizeConnectionString(connectionString);

let pool: Pool | null = null;

let ensurePromise: Promise<void> | null = null;

export function getPool() {
  if (!pool) {
  pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const p = getPool();
  const result = await p.query(text, params);
  return { rows: result.rows as T[] };
}

// Ensure posts table exists (id serial, title, content, created_at timestamp)
export async function ensurePostsTable() {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      try {
        await query(`CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )`);
      } catch (e) {
        console.error('[pg] ensurePostsTable error', (e as any)?.message);
        // reset promise so a later attempt can retry
        ensurePromise = null;
        throw e;
      }
    })();
  }
  return ensurePromise;
}
