import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;
let initializing: Promise<Database> | null = null;

async function init() {
  const file = process.env.SQLITE_FILE || '/tmp/blog.db';
  const database = await open({ filename: file, driver: sqlite3.Database });
  await database.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const row = await database.get<{ count: number }>(`SELECT COUNT(*) as count FROM posts;`);
  if (row && row.count === 0) {
    await database.run('INSERT INTO posts (title, content) VALUES (?, ?)', [
      'Welcome',
      'This deployment uses ephemeral SQLite (/tmp). Data may reset after cold start.'
    ]);
  }
  return database;
}

export async function getDB() {
  if (db) return db;
  if (!initializing) {
    initializing = init().then(d => { db = d; return d; });
  }
  return initializing;
}
