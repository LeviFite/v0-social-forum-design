import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Header from "@/components/layout/header"
import CreateTopicForm from "@/components/forum/create-topic-form"

interface CreateTopicPageProps {
  searchParams: {
    category?: string
  }
}

export default async function CreateTopicPage({ searchParams }: CreateTopicPageProps) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get categories
  const { data: categories } = await supabase.from("forum_categories").select("*").order("sort_order")

  return (
    <div className="min-h-screen bg-background">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Topic</h1>
          <p className="text-muted-foreground">Start a new discussion in the community</p>
        </div>

        <CreateTopicForm categories={categories || []} defaultCategoryId={searchParams.category} />
      </main>
    </div>
  )
}
