import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CANDIDATES = [
  'DATABASE_URL',
  'NEON_DATABASE_URL',
  'DB_URL',
  'PGHOST', 'PGPORT', 'PGUSER', 'PGDATABASE'
];

export async function GET() {
  const present: Record<string, boolean> = {};
  for (const key of CANDIDATES) {
    present[key] = typeof process.env[key] === 'string' && process.env[key]!.length > 0;
  }
  // Collect any env keys that look like potential DB vars (name only, no values)
  const dynamicDBKeys = Object.keys(process.env).filter(k => /DB|DATABASE|PGHOST|PGUSER/i.test(k));
  return NextResponse.json({ present, dynamicDBKeys, currentNodeEnv: process.env.NODE_ENV, region: process.env.VERCEL_REGION });
}
