"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Reply } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ReplyCardProps {
  reply: {
    id: string
    content: string
    created_at: string
    user: {
      username: string
      avatar_url?: string
      display_name?: string
    }
  }
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={reply.user.avatar_url || "/placeholder.svg"} alt={reply.user.username} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {reply.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-foreground">{reply.user.display_name || reply.user.username}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
              </span>
            </div>

            <div className="prose prose-invert max-w-none mb-4">
              <div dangerouslySetInnerHTML={{ __html: reply.content }} />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-1" />0
              </Button>
              <Button variant="ghost" size="sm">
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
