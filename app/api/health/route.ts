import { NextResponse } from 'next/server';
import { query, getConnectionDiagnostics } from '@/lib/pg';

export const runtime = 'nodejs';

export async function GET() {
  try {
  const diag = getConnectionDiagnostics();
  const { rows } = await query('SELECT 1 as ok');
  return NextResponse.json({ status: 'ok', db: rows[0].ok === 1, diag });
  } catch (e: any) {
  const diag = getConnectionDiagnostics();
  console.error('/api/health error', e?.message);
  return NextResponse.json({ status: 'error', message: e?.message, diag }, { status: 500 });
  }
}
