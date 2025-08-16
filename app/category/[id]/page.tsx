import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import TopicCard from "@/components/forum/topic-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
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

  // Get user profile if logged in
  let userProfile = null
  if (user) {
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single()
    userProfile = data
  }

  // Get category details
  const { data: category } = await supabase.from("forum_categories").select("*").eq("id", params.id).single()

  if (!category) {
    notFound()
  }

  // Get topics in this category
  const { data: topics } = await supabase
    .from("forum_topics")
    .select(`
      *,
      users!forum_topics_user_id_fkey (username, avatar_url),
      forum_categories!forum_topics_category_id_fkey (name, color)
    `)
    .eq("category_id", params.id)
    .order("is_pinned", { ascending: false })
    .order("last_reply_at", { ascending: false })

  const colorClasses = {
    pink: "from-primary/20 to-primary/5",
    green: "from-secondary/20 to-secondary/5",
    blue: "from-blue-500/20 to-blue-500/5",
    purple: "from-purple-500/20 to-purple-500/5",
    orange: "from-orange-500/20 to-orange-500/5",
  }

  const gradientClass = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.pink

  return (
    <div className="min-h-screen bg-background">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className={`bg-gradient-to-r ${gradientClass} rounded-lg p-8 mb-8`}>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{category.icon}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
                  {category.is_custom && (
                    <Badge variant="secondary" className="text-sm">
                      Custom
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg">{category.description}</p>
              </div>
            </div>

            {user && (
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href={`/create-topic?category=${category.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Topic
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {topics && topics.length > 0 ? (
            topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={{
                  ...topic,
                  user: topic.users,
                  category: topic.forum_categories,
                }}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No topics yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to start a discussion in this category!</p>
              {user && (
                <Button asChild className="bg-secondary hover:bg-secondary/90">
                  <Link href={`/create-topic?category=${category.id}`}>
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
