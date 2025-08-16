import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Header from "@/components/layout/header"
import BlogEditor from "@/components/blog/blog-editor"

interface EditBlogPageProps {
  params: {
    id: string
  }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get blog post
  const { data: blogPost } = await supabase.from("user_blogs").select("*").eq("id", params.id).single()

  if (!blogPost) {
    notFound()
  }

  // Check if user owns this blog post
  if (blogPost.user_id !== user.id) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update your blog post</p>
        </div>

        <BlogEditor mode="edit" blogPost={blogPost} />
      </main>
    </div>
  )
}
