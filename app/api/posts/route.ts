import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any

(async () => {
  db = await open({
    filename: './blog.db',
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT
    )
  `)
})()

export async function GET() {
  const posts = await db.all('SELECT * FROM posts')
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const { title, content } = await request.json()
  
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const result = await db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content])
  const newPost = await db.get('SELECT * FROM posts WHERE id = ?', result.lastID)
  
  return NextResponse.json(newPost, { status: 201 })
}
