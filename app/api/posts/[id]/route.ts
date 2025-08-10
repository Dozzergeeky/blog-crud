
import { NextResponse } from "next/server";
import { query, ensurePostsTable } from '@/lib/pg';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
  await ensurePostsTable();
    const { rows } = await query('SELECT id, title, content, created_at FROM posts WHERE id = $1', [params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('GET /api/posts/[id] error:', error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
  await ensurePostsTable();
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
  const updateRes = await query('UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING id', [title, content, params.id]);
  if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const updated = await query('SELECT id, title, content, created_at FROM posts WHERE id = $1', [params.id]);
    return NextResponse.json(updated.rows[0]);
  } catch (error: any) {
    console.error('PUT /api/posts/[id] error:', error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
  await ensurePostsTable();
  const delRes = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [params.id]);
  if (delRes.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/posts/[id] error:', error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
