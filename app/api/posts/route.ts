import { NextResponse } from 'next/server'
import { query, ensurePostsTable } from '@/lib/pg'

export async function GET() {
  try {
  await ensurePostsTable();
    const { rows } = await query('SELECT id, title, content, created_at FROM posts ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
  await ensurePostsTable();
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    const insert = await query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at',
      [title, content]
    );
    return NextResponse.json(insert.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}