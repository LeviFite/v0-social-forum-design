import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import TopicCard from "@/components/forum/topic-card"
import { Button } from "@/components/ui/button"
import { Plus, MessageCircle } from "lucide-react"
import Link from "next/link"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile if logged in
  let userProfile = null
  if (user) {
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single()
    userProfile = data
  }

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug)

  // Get category by ID or slug
  const { data: category } = await supabase
    .from("forum_categories")
    .select("*")
    .eq(isUUID ? "id" : "slug", params.slug)
    .single()

  if (!category) {
    notFound()
  }

  // Get topics in this category
  const { data: topics } = await supabase
    .from("forum_topics")
    .select(`
      *,
      users!forum_topics_author_id_fkey (username, avatar_url),
      forum_categories!forum_topics_category_id_fkey (name, color)
    `)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background page-transition">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
          {user && (
            <Button asChild className="hover-glow">
              <Link href={`/create-topic?category=${category.slug}`}>
                <Plus className="mr-2 h-4 w-4" />
                New Topic
              </Link>
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {topics && topics.length > 0 ? (
            topics.map((topic, index) => (
              <div key={topic.id} className="stagger-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <TopicCard
                  topic={{
                    ...topic,
                    user: topic.users,
                    category: topic.forum_categories,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 fade-in">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No topics yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to start a discussion in this category!</p>
              {user && (
                <Button asChild className="hover-glow">
                  <Link href={`/create-topic?category=${category.slug}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Topic
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
