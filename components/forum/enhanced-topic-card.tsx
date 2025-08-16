"use client"

import type React from "react"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { useState } from "react"

interface EnhancedTopicCardProps {
  topic: {
    id: string
    title: string
    content: string
    created_at: string
    reply_count: number
    like_count: number
    user: {
      username: string
      avatar_url?: string
    }
    category: {
      name: string
      color: string
    }
  }
}

export default function EnhancedTopicCard({ topic }: EnhancedTopicCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(topic.like_count)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.share?.({
      title: topic.title,
      url: `/topic/${topic.id}`,
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover-lift hover:border-primary/20 transition-all duration-200 slide-up">
      <Link href={`/topic/${topic.id}`} className="block">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={topic.user.avatar_url || "/placeholder.svg"} alt={topic.user.username} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {topic.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground">{topic.user.username}</span>
              <Badge
                variant="secondary"
                className="text-xs"
                style={{ backgroundColor: `${topic.category.color}20`, color: topic.category.color }}
              >
                {topic.category.name}
              </Badge>
            </div>

            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
              {topic.title}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{topic.content}</p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 h-8 ${isLiked ? "text-red-500" : "text-muted-foreground"} hover:text-red-500 transition-colors`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-xs">{likeCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-8 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{topic.reply_count}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${isBookmarked ? "text-yellow-500" : "text-muted-foreground"} hover:text-yellow-500 transition-colors`}
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
