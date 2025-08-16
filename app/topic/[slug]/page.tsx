import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import ReplyForm from "@/components/forum/reply-form"
import ReplyCard from "@/components/forum/reply-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "@/lib/utils"
import { MessageCircle, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TopicPageProps {
  params: {
    slug: string
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
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

  // Get topic with author and category info
  const { data: topic } = await supabase
    .from("forum_topics")
    .select(`
      *,
      users!forum_topics_author_id_fkey (username, avatar_url, display_name),
      forum_categories!forum_topics_category_id_fkey (name, color, slug)
    `)
    .eq("slug", params.slug)
    .single()

  if (!topic) {
    notFound()
  }

  // Get replies for this topic
  const { data: replies } = await supabase
    .from("forum_replies")
    .select(`
      *,
      users!forum_replies_author_id_fkey (username, avatar_url, display_name)
    `)
    .eq("topic_id", topic.id)
    .order("created_at", { ascending: true })

  return (
    <div className="min-h-screen bg-background page-transition">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="hover-lift">
            <Link href={`/category/${topic.forum_categories.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {topic.forum_categories.name}
            </Link>
          </Button>
        </div>

        {/* Topic */}
        <Card className="mb-8 fade-in">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                style={{ backgroundColor: `${topic.forum_categories.color}20`, color: topic.forum_categories.color }}
              >
                {topic.forum_categories.name}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{topic.title}</h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={topic.users.avatar_url || "/placeholder.svg"} alt={topic.users.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {topic.users.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{topic.users.display_name || topic.users.username}</p>
                  <p className="text-sm text-muted-foreground">@{topic.users.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{topic.reply_count} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDistanceToNow(topic.created_at)}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{topic.content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Replies ({replies?.length || 0})</h2>

          {replies && replies.length > 0 && (
            <div className="space-y-4">
              {replies.map((reply, index) => (
                <div key={reply.id} className="stagger-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ReplyCard reply={reply} />
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {user ? (
            <div className="slide-up">
              <ReplyForm topicId={topic.id} />
            </div>
          ) : (
            <Card className="fade-in">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
                <div className="flex items-center justify-center gap-4">
                  <Button asChild variant="outline" className="hover-lift bg-transparent">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild className="hover-glow">
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
