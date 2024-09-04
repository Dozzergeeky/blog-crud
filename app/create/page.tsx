import Header from '@/components/Header'
import PostForm from '@/components/PostForm'

export default function CreatePost() {
  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
        <PostForm />
      </main>
    </div>
  )
}