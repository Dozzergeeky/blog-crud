'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { ConfirmationModal } from './ConfirmationModal'

interface BlogCardProps {
  id: number
  title: string
  excerpt: string
  onDelete: (id: number) => void
}

export default function BlogCard({ id, title, excerpt, onDelete }: BlogCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = () => {
    setIsDeleteModalOpen(false)
    onDelete(id)
  }

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{excerpt}</p>
      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/post/${id}`}>View</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/edit/${id}`}>Edit</Link>
        </Button>
        <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
          Delete
        </Button>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  )
}