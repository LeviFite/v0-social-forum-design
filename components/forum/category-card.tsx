"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Clock } from "lucide-react"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description: string
    color: string
    icon: string
    topic_count?: number
    reply_count?: number
    last_activity?: string
    is_custom: boolean
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const colorClasses = {
    pink: "bg-primary/10 border-primary/20 hover:bg-primary/15",
    green: "bg-secondary/10 border-secondary/20 hover:bg-secondary/15",
    blue: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15",
    purple: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15",
    orange: "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15",
  }

  const cardClass = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.pink

  return (
    <Link href={`/category/${category.id}`}>
      <Card className={`transition-all duration-200 hover:scale-[1.02] cursor-pointer ${cardClass}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{category.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{category.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
              </div>
            </div>
            {category.is_custom && (
              <Badge variant="secondary" className="text-xs">
                Custom
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{category.topic_count || 0} topics</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{category.reply_count || 0} replies</span>
              </div>
            </div>
            {category.last_activity && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>2h ago</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
