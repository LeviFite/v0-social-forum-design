"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, UserPlus, UserMinus, MapPin, Globe, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ProfileHeaderProps {
  user: {
    id: string
    username: string
    display_name?: string
    bio?: string
    avatar_url?: string
    website_url?: string
    location?: string
    theme_color: string
    created_at: string
    privacy_level: string
  }
  isOwnProfile: boolean
  isFollowing: boolean
  followerCount: number
  followingCount: number
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  isFollowing,
  followerCount,
  followingCount,
}: ProfileHeaderProps) {
  const [following, setFollowing] = useState(isFollowing)
  const [followers, setFollowers] = useState(followerCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFollowToggle = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      if (following) {
        // Unfollow
        await supabase.from("user_follows").delete().eq("follower_id", currentUser.id).eq("following_id", user.id)
        setFollowing(false)
        setFollowers(followers - 1)
      } else {
        // Follow
        await supabase.from("user_follows").insert({
          follower_id: currentUser.id,
          following_id: user.id,
        })
        setFollowing(true)
        setFollowers(followers + 1)
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const themeColors = {
    pink: "from-primary/20 to-primary/5 border-primary/20",
    green: "from-secondary/20 to-secondary/5 border-secondary/20",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
  }

  const gradientClass = themeColors[user.theme_color as keyof typeof themeColors] || themeColors.pink

  return (
    <Card className={`bg-gradient-to-r ${gradientClass} border`}>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.display_name || user.username}</h1>
              <p className="text-muted-foreground mb-2">@{user.username}</p>
              {user.bio && <p className="text-foreground max-w-md">{user.bio}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {isOwnProfile ? (
              <>
                <Button asChild variant="outline">
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleFollowToggle}
                disabled={isLoading}
                className={following ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"}
              >
                {following ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Stats and Meta Info */}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{followingCount}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website_url && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <a
                  href={user.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Website
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
            </div>
          </div>

          <div className="ml-auto">
            <Badge variant="outline" className="capitalize">
              {user.privacy_level} Profile
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
