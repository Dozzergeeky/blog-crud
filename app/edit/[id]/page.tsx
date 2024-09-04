"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import PostForm from "@/components/PostForm";

export default function EditPost() {
  const [post, setPost] = useState(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <PostForm initialData={post} />
      </main>
    </div>
  );
}
