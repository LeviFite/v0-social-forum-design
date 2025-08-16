"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Share, Heart, MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import BlogRenderer from "./blog-renderer"

interface BlogPostProps {
  blogPost: {
    id: string
    title: string
    content: any
    slug: string
    is_published: boolean
    privacy_level: string
    created_at: string
    updated_at: string
  }
  author: {
    id: string
    username: string
    display_name?: string
    avatar_url?: string
    theme_color: string
  }
  isOwner: boolean
}

export default function BlogPost({ blogPost, author, isOwner }: BlogPostProps) {
  const themeColors = {
    pink: "from-primary/10 to-primary/5 border-primary/20",
    green: "from-secondary/10 to-secondary/5 border-secondary/20",
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
    orange: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
  }

  const gradientClass = themeColors[author.theme_color as keyof typeof themeColors] || themeColors.pink

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href={`/profile/${author.username}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {author.display_name || author.username}'s Profile
          </Link>
        </Button>

        {isOwner && (
          <Button variant="outline" asChild>
            <Link href={`/blog/edit/${blogPost.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </Link>
          </Button>
        )}
      </div>

      {/* Blog Header */}
      <Card className={`bg-gradient-to-r ${gradientClass} border`}>
        <CardContent className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={blogPost.is_published ? "default" : "secondary"}>
              {blogPost.is_published ? "Published" : "Draft"}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {blogPost.privacy_level}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-6">{blogPost.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={author.avatar_url || "/placeholder.svg"} alt={author.username} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/profile/${author.username}`}>
                  <p className="font-medium text-foreground hover:text-primary transition-colors">
                    {author.display_name || author.username}
                  </p>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Published {formatDistanceToNow(new Date(blogPost.created_at), { addSuffix: true })}
                  {blogPost.updated_at !== blogPost.created_at && (
                    <span> • Updated {formatDistanceToNow(new Date(blogPost.updated_at), { addSuffix: true })}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-1" />0
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />0
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Content */}
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <BlogRenderer content={blogPost.content} />
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Comments</h3>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
