"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Reply, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ProfileActivityFeedProps {
  user: {
    username: string
  }
  userTopics: Array<{
    id: string
    title: string
    created_at: string
    forum_categories: {
      name: string
      icon: string
    }
  }>
  userReplies: Array<{
    id: string
    content: string
    created_at: string
    forum_topics: {
      id: string
      title: string
    }
  }>
}

export default function ProfileActivityFeed({ user, userTopics, userReplies }: ProfileActivityFeedProps) {
  // Combine and sort activities
  const activities = [
    ...userTopics.map((topic) => ({
      type: "topic" as const,
      id: topic.id,
      title: topic.title,
      content: `Created topic in ${topic.forum_categories.name}`,
      created_at: topic.created_at,
      link: `/topic/${topic.id}`,
      icon: topic.forum_categories.icon,
    })),
    ...userReplies.map((reply) => ({
      type: "reply" as const,
      id: reply.id,
      title: reply.forum_topics.title,
      content: reply.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
      created_at: reply.created_at,
      link: `/topic/${reply.forum_topics.id}`,
      icon: "💬",
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <Card key={`${activity.type}-${activity.id}`} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {activity.type === "topic" ? (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Reply className="h-5 w-5 text-secondary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "topic" ? "Created Topic" : "Replied"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <Link href={activity.link}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors mb-2">
                      {activity.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm">{activity.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
            <p className="text-muted-foreground">{user.username} hasn't been active in the forum yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
