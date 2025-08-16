import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import ProfileHeader from "@/components/profile/profile-header"
import ProfileTabs from "@/components/profile/profile-tabs"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
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

  // Get current user profile if logged in
  let currentUserProfile = null
  if (user) {
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single()
    currentUserProfile = data
  }

  // Get profile user
  const { data: profileUser } = await supabase.from("users").select("*").eq("username", params.username).single()

  if (!profileUser) {
    notFound()
  }

  const isOwnProfile = user?.id === profileUser.id

  // Get user's topics
  const { data: userTopics } = await supabase
    .from("forum_topics")
    .select(`
      *,
      forum_categories!forum_topics_category_id_fkey (name, color, icon)
    `)
    .eq("user_id", profileUser.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get user's replies
  const { data: userReplies } = await supabase
    .from("forum_replies")
    .select(`
      *,
      forum_topics!forum_replies_topic_id_fkey (id, title)
    `)
    .eq("user_id", profileUser.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get user's blogs
  const { data: userBlogs } = await supabase
    .from("user_blogs")
    .select("*")
    .eq("user_id", profileUser.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get follower/following counts
  const { count: followerCount } = await supabase
    .from("user_follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profileUser.id)

  const { count: followingCount } = await supabase
    .from("user_follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profileUser.id)

  // Check if current user follows this profile
  let isFollowing = false
  if (user && user.id !== profileUser.id) {
    const { data: followData } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", profileUser.id)
      .single()
    isFollowing = !!followData
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUserProfile} />

      <main className="container mx-auto px-4 py-8">
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          followerCount={followerCount || 0}
          followingCount={followingCount || 0}
        />

        <div className="mt-8">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="topics"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Topics ({userTopics?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="blogs"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              >
                Blogs ({userBlogs?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                About
              </TabsTrigger>
            </TabsList>

            <ProfileTabs
              user={profileUser}
              isOwnProfile={isOwnProfile}
              userTopics={userTopics || []}
              userReplies={userReplies || []}
              userBlogs={userBlogs || []}
            />
          </Tabs>
        </div>
      </main>
    </div>
  )
}
