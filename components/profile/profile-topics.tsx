import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"

interface ProfileTopicsProps {
  topics: any[]
}

export default function ProfileTopics({ topics }: ProfileTopicsProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground fade-in">
        <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No topics yet</h3>
        <p>This user hasn't created any forum topics yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {topics.map((topic, index) => (
        <Card key={topic.id} className="hover-lift stagger-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: `${topic.forum_categories.color}20`,
                  color: topic.forum_categories.color,
                }}
              >
                {topic.forum_categories.name}
              </Badge>

              <span className="text-sm text-muted-foreground">{formatDistanceToNow(topic.created_at)}</span>
            </div>

            <CardTitle className="text-xl">
              <Link href={`/topic/${topic.slug}`} className="hover:text-primary transition-colors">
                {topic.title}
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground line-clamp-3 mb-4">{topic.content}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{topic.reply_count} replies</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Last activity {formatDistanceToNow(topic.last_reply_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
