import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, Calendar, User, Shield } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"

interface ProfileAboutProps {
  user: any
}

export default function ProfileAbout({ user }: ProfileAboutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Display Name</label>
            <p className="text-foreground">{user.display_name || "Not set"}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <p className="text-foreground">@{user.username}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Bio</label>
            <p className="text-foreground">{user.bio || "No bio provided"}</p>
          </div>

          {user.location && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <p className="text-foreground">{user.location}</p>
            </div>
          )}

          {user.website && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Website
              </label>
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {user.website}
              </a>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Member Since
            </label>
            <p className="text-foreground">{formatDistanceToNow(user.created_at)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" />
            Privacy & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Privacy Level</label>
            <Badge variant="outline" className="capitalize">
              {user.privacy_level}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Theme Color</label>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-border"
                style={{ backgroundColor: user.theme_color }}
              />
              <span className="text-foreground font-mono text-sm">{user.theme_color}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-foreground">{formatDistanceToNow(user.updated_at)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
