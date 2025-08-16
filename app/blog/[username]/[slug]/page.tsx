import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import BlogPost from "@/components/blog/blog-post"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: {
    username: string
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  if (!isSupabaseConfigured) {
    return {
      title: "Blog Post",
    }
  }

  const supabase = createClient()

  // Get user and blog post
  const { data: user } = await supabase.from("users").select("*").eq("username", params.username).single()

  if (!user) {
    return {
      title: "Blog Post Not Found",
    }
  }

  const { data: blogPost } = await supabase
    .from("user_blogs")
    .select("*")
    .eq("user_id", user.id)
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single()

  if (!blogPost) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: `${blogPost.title} - ${user.display_name || user.username}`,
    description: `Blog post by ${user.display_name || user.username}`,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  // Get current user profile if logged in
  let currentUserProfile = null
  if (currentUser) {
    const { data } = await supabase.from("users").select("*").eq("id", currentUser.id).single()
    currentUserProfile = data
  }

  // Get blog author
  const { data: author } = await supabase.from("users").select("*").eq("username", params.username).single()

  if (!author) {
    notFound()
  }

  // Get blog post
  const { data: blogPost } = await supabase
    .from("user_blogs")
    .select("*")
    .eq("user_id", author.id)
    .eq("slug", params.slug)
    .single()

  if (!blogPost) {
    notFound()
  }

  // Check privacy permissions
  const isOwner = currentUser?.id === author.id
  const canView =
    blogPost.is_published &&
    (blogPost.privacy_level === "public" ||
      isOwner ||
      (blogPost.privacy_level === "friends" && currentUser) || // Simplified friends check
      blogPost.privacy_level === "private")

  if (!canView && !isOwner) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUserProfile} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <BlogPost blogPost={blogPost} author={author} isOwner={isOwner} />
      </main>
    </div>
  )
}
