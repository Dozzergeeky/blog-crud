import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any

async function initializeDB() {
  try {
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
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

initializeDB()

export async function GET() {
  try {
    const posts = await db.all('SELECT * FROM posts')
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json()
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const result = await db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content])
    const newPost = await db.get('SELECT * FROM posts WHERE id = ?', result.lastID)
    
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}