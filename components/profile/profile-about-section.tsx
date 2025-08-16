"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, Calendar, Palette, Edit } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ProfileAboutSectionProps {
  user: {
    id: string
    username: string
    display_name?: string
    bio?: string
    website_url?: string
    location?: string
    theme_color: string
    created_at: string
    privacy_level: string
  }
  isOwnProfile: boolean
}

export default function ProfileAboutSection({ user, isOwnProfile }: ProfileAboutSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Information */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">About</CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile/edit">
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-2">Bio</h3>
            <p className="text-muted-foreground">
              {user.bio || (isOwnProfile ? "Add a bio to tell others about yourself." : "No bio available.")}
            </p>
          </div>

          {user.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.location}</span>
            </div>
          )}

          {user.website_url && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={user.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {user.website_url}
              </a>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Customization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-2">Theme Color</h3>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="capitalize">
                {user.theme_color}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-2">Privacy Level</h3>
            <Badge variant="outline" className="capitalize">
              {user.privacy_level} Profile
            </Badge>
          </div>

          {isOwnProfile && (
            <div className="pt-4">
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/profile/customize">
                  <Palette className="h-4 w-4 mr-2" />
                  Customize Profile
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
