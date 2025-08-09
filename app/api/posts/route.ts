import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any = null;
async function getDB() {
  if (!db) {
    const file = process.env.SQLITE_FILE || '/tmp/blog.db';
    db = await open({
      filename: file,
      driver: sqlite3.Database
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized at', file);
  }
  return db;
}

export async function GET() {
  try {
    const db = await getDB();
    const posts = await db.all('SELECT * FROM posts');
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const result = await db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
    const newPost = await db.get('SELECT * FROM posts WHERE id = ?', result.lastID);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    // Log error stack and message for debugging
    console.error('Error creating post:', error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}