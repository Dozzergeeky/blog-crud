
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db: any = null;
async function getDB() {
  if (!db) {
    db = await open({
      filename: "./blog.db",
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const post = await db.get("SELECT * FROM posts WHERE id = ?", params.id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error: any) {
    console.error("GET /api/posts/[id] error:", error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    const result = await db.run(
      "UPDATE posts SET title = ?, content = ? WHERE id = ?",
      [title, content, params.id]
    );
    if (result.changes === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const updatedPost = await db.get(
      "SELECT * FROM posts WHERE id = ?",
      params.id
    );
    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("PUT /api/posts/[id] error:", error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const result = await db.run("DELETE FROM posts WHERE id = ?", params.id);
    if (result.changes === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/posts/[id] error:", error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
