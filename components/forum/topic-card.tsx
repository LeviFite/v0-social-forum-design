"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Eye, Heart, Pin, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TopicCardProps {
  topic: {
    id: string
    title: string
    content: string
    is_pinned: boolean
    is_locked: boolean
    view_count: number
    reply_count: number
    created_at: string
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

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Card className="transition-all duration-200 hover:bg-card/80 border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={topic.user.avatar_url || "/placeholder.svg"} alt={topic.user.username} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {topic.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {topic.is_pinned && <Pin className="h-4 w-4 text-primary" />}
              {topic.is_locked && <Lock className="h-4 w-4 text-muted-foreground" />}
              <Badge variant="outline" className="text-xs">
                {topic.category.name}
              </Badge>
            </div>

            <Link href={`/topic/${topic.id}`}>
              <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors mb-2 line-clamp-2">
                {topic.title}
              </h3>
            </Link>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {topic.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>by {topic.user.username}</span>
                <span>{formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{topic.view_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{topic.reply_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
