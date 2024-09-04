"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(posts) ? (
            posts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.content.substring(0, 100) + "..."}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </main>
    </div>
  );
}