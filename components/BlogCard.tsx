'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/post/${id}`}>Read More</Link>
        </Button>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link href={`/edit/${id}`}>Edit</Link>
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
        </div>
      </CardFooter>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </Card>
  )
}