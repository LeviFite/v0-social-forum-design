import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import ReplyForm from "@/components/forum/reply-form"
import ReplyCard from "@/components/forum/reply-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Eye, MessageSquare, Heart, Pin, Lock, Share } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface TopicPageProps {
  params: {
    id: string
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
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

  // Get topic details
  const { data: topic } = await supabase
    .from("forum_topics")
    .select(`
      *,
      users!forum_topics_user_id_fkey (username, avatar_url, display_name),
      forum_categories!forum_topics_category_id_fkey (name, color, icon)
    `)
    .eq("id", params.id)
    .single()

  if (!topic) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("forum_topics")
    .update({ view_count: topic.view_count + 1 })
    .eq("id", params.id)

  // Get replies
  const { data: replies } = await supabase
    .from("forum_replies")
    .select(`
      *,
      users!forum_replies_user_id_fkey (username, avatar_url, display_name)
    `)
    .eq("topic_id", params.id)
    .order("created_at", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/category/${topic.forum_categories.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {topic.forum_categories.name}
            </Link>
          </Button>
        </div>

        {/* Topic Header */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            {topic.is_pinned && <Pin className="h-5 w-5 text-primary" />}
            {topic.is_locked && <Lock className="h-5 w-5 text-muted-foreground" />}
            <Badge variant="outline" className="text-sm">
              {topic.forum_categories.icon} {topic.forum_categories.name}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">{topic.title}</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={topic.users.avatar_url || "/placeholder.svg"} alt={topic.users.username} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {topic.users.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{topic.users.display_name || topic.users.username}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{topic.view_count + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{replies?.length || 0}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-1" />0
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: topic.content }} />
          </div>
        </div>

        {/* Replies */}
        {replies && replies.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </h2>
            {replies.map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={{
                  ...reply,
                  user: reply.users,
                }}
              />
            ))}
          </div>
        )}

        {/* Reply Form */}
        {user && !topic.is_locked ? (
          <ReplyForm topicId={topic.id} />
        ) : !user ? (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">This topic is locked and cannot receive new replies.</p>
          </div>
        )}
      </main>
    </div>
  )
}
