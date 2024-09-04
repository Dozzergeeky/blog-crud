'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import BlogCard from '@/components/BlogCard'

interface Post {
  id: number
  title: string
  content: string
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const response = await fetch('/api/posts')
    const data = await response.json()
    setPosts(data)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.content.substring(0, 100) + '...'}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
