import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import Header from "@/components/layout/header"
import CategoryCard from "@/components/forum/category-card"
import TopicCard from "@/components/forum/topic-card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Clock, Users } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export default async function HomePage() {
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

  // Get user profile if logged in
  let userProfile = null
  if (user) {
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single()
    userProfile = data
  }

  // Get forum categories
  const { data: categories } = await supabase.from("forum_categories").select("*").order("sort_order")

  // Get recent topics with user and category info
  const { data: recentTopics } = await supabase
    .from("forum_topics")
    .select(`
      *,
      users!forum_topics_user_id_fkey (username, avatar_url),
      forum_categories!forum_topics_category_id_fkey (name, color)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background page-transition">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to the{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Community</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join discussions, share ideas, and connect with like-minded people in our vibrant forum community.
          </p>
          {!user && (
            <div className="flex items-center justify-center gap-4 slide-up">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 hover-glow">
                <Link href="/auth/signup">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="hover-lift bg-transparent">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6 text-center hover-lift hover-glow stagger-fade-in">
            <div className="text-3xl font-bold text-primary mb-2">
              <AnimatedCounter value={15} />+
            </div>
            <div className="text-muted-foreground">Categories</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover-lift hover-glow stagger-fade-in">
            <div className="text-3xl font-bold text-secondary mb-2">
              <AnimatedCounter value={1200} />+
            </div>
            <div className="text-muted-foreground">Topics</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover-lift hover-glow stagger-fade-in">
            <div className="text-3xl font-bold text-primary mb-2">
              <AnimatedCounter value={5800} />+
            </div>
            <div className="text-muted-foreground">Members</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Forum Categories</h2>
              {user && (
                <Button asChild className="bg-secondary hover:bg-secondary/90 hover-glow">
                  <Link href="/create-topic">
                    <Plus className="mr-2 h-4 w-4" />
                    New Topic
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {categories?.slice(0, 6).map((category, index) => (
                <div
                  key={category.id}
                  className="stagger-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>

            {categories && categories.length > 6 && (
              <div className="text-center">
                <Button variant="primary" asChild className="hover-lift bg-transparent font-sans font-extrabold text-base tracking-normal">
                  <Link href="/categories">View All Categories</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Recent Topics
            </h2>

            <div className="space-y-4">
              {recentTopics?.map((topic, index) => (
                <div
                  key={topic.id}
                  className="stagger-fade-in hover-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TopicCard
                    topic={{
                      ...topic,
                      user: topic.users,
                      category: topic.forum_categories,
                    }}
                  />
                </div>
              ))}
            </div>

            {recentTopics && recentTopics.length === 0 && (
              <div className="text-center py-8 text-muted-foreground fade-in">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent topics yet.</p>
                <p className="text-sm">Be the first to start a discussion!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
