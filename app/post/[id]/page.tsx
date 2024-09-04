"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    if (response.ok) {
      router.push("/");
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="content" className="block mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-2 border rounded"
              rows={5}
            />
          </div>
          <Button type="submit">Create Post</Button>
        </form>
      </main>
    </div>
  );
}
