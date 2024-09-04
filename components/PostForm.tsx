'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/use-toast'

interface PostFormProps {
  initialData?: {
    id?: number
    title: string
    content: string
  }
}

export default function PostForm({ initialData }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [errors, setErrors] = useState({ title: '', content: '' })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setContent(initialData.content)
    }
  }, [initialData])

  const validateForm = () => {
    let isValid = true
    const newErrors = { title: '', content: '' }

    if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
      isValid = false
    }

    if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const url = initialData?.id ? `/api/posts/${initialData.id}` : '/api/posts'
    const method = initialData?.id ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })

    if (response.ok) {
      toast({
        title: initialData?.id ? 'Post updated' : 'Post created',
        description: 'Your post has been successfully saved.',
      })
      router.push('/')
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem saving your post. Please try again.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="content" className="block mb-2">
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={errors.content ? 'border-red-500' : ''}
          rows={5}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </div>
      <Button type="submit">{initialData?.id ? 'Update' : 'Create'} Post</Button>
    </form>
  )
}
