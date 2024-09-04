import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db: any;

(async () => {
  db = await open({
    filename: "./blog.db",
    driver: sqlite3.Database,
  });
})();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await db.get("SELECT * FROM posts WHERE id = ?", params.id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const result = await db.run("DELETE FROM posts WHERE id = ?", params.id);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Post deleted successfully" });
}
