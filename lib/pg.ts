import { Pool } from 'pg';

// Expect DATABASE_URL in env (Vercel + local .env.local)
let connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('[pg] Missing DATABASE_URL (or NEON_DATABASE_URL) environment variable.');
}

let sanitizeLogged = false;
function sanitizeConnectionString(url?: string) {
  if (!url) return url;
  try {
    const u = new URL(url);
    // Some Neon URLs include channel_binding=require which can cause issues with certain pg client versions.
    if (u.searchParams.get('channel_binding') === 'require') {
      u.searchParams.delete('channel_binding');
      if (!sanitizeLogged) {
        console.warn('[pg] Removed channel_binding=require from connection string for compatibility.');
        sanitizeLogged = true;
      }
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
  if (!connectionString) {
    throw new Error('DATABASE_URL not configured');
  }
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

// Minimal, safe diagnostics (no credentials) for health checks.
export function getConnectionDiagnostics() {
  if (!connectionString) {
    return { hasUrl: false };
  }
  try {
    const u = new URL(connectionString);
    return {
      hasUrl: true,
      protocol: u.protocol.replace(':',''),
      host: u.hostname,
      // Detect if pointing at localhost implicitly
      isLocal: ['localhost','127.0.0.1'].includes(u.hostname)
    };
  } catch {
    return { hasUrl: true, parseError: true };
  }
}
