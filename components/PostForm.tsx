"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface PostFormProps {
  initialData?: {
    id?: number;
    title: string;
    content: string;
  };
}

export default function PostForm({ initialData }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", content: "" };

    if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
      isValid = false;
    }

    if (content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const url = initialData?.id ? `/api/posts/${initialData.id}` : "/api/posts";
    const method = initialData?.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      showToast(
        initialData?.id
          ? "Post updated successfully"
          : "Post created successfully"
      );
      router.push("/");
    } else {
      showToast("Error saving post. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {toastMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{toastMessage}</span>
        </div>
      )}
      <div>
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>
      <div>
        <label htmlFor="content" className="block mb-2">
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={errors.content ? "border-red-500" : ""}
          rows={5}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
      </div>
      <Button type="submit">
        {initialData?.id ? "Update" : "Create"} Post
      </Button>
    </form>
  );
}
