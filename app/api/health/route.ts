import { NextResponse } from 'next/server';
import { query } from '@/lib/pg';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { rows } = await query('SELECT 1 as ok');
    return NextResponse.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e: any) {
    console.error('/api/health error', e?.message);
    return NextResponse.json({ status: 'error', message: e?.message }, { status: 500 });
  }
}
