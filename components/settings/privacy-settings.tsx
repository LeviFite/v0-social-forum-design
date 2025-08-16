"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, Shield, Eye, Users, Globe, Lock, MessageSquare, FileText, ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface PrivacySettingsProps {
  user: {
    id: string
    username: string
    privacy_level: string
  }
}

export default function PrivacySettings({ user }: PrivacySettingsProps) {
  const [settings, setSettings] = useState({
    profile_privacy: user.privacy_level || "public",
    show_email: false,
    show_activity: true,
    allow_messages: true,
    allow_follows: true,
    blog_default_privacy: "public",
    file_default_privacy: "private",
    search_visibility: true,
    activity_tracking: true,
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          privacy_level: settings.profile_privacy,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating privacy settings:", error)
        return
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating privacy settings:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const privacyOptions = [
    {
      value: "public",
      label: "Public",
      description: "Anyone can view your profile and content",
      icon: Globe,
      color: "text-green-500",
    },
    {
      value: "friends",
      label: "Friends Only",
      description: "Only your followers can view detailed information",
      icon: Users,
      color: "text-blue-500",
    },
    {
      value: "private",
      label: "Private",
      description: "Only you can view your profile content",
      icon: Lock,
      color: "text-red-500",
    },
  ]

  const getCurrentPrivacyOption = (value: string) => {
    return privacyOptions.find((option) => option.value === value) || privacyOptions[0]
  }

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Profile Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Who can view your profile?</label>
              <div className="space-y-3">
                {privacyOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = settings.profile_privacy === option.value

                  return (
                    <div
                      key={option.value}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSettings((prev) => ({ ...prev, profile_privacy: option.value }))}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${option.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{option.label}</span>
                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Privacy */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Default Blog Privacy</p>
                  <p className="text-sm text-muted-foreground">Default privacy level for new blog posts</p>
                </div>
              </div>
              <Select
                value={settings.blog_default_privacy}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, blog_default_privacy: value }))}
              >
                <SelectTrigger className="w-32 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Default File Privacy</p>
                  <p className="text-sm text-muted-foreground">Default privacy level for uploaded files</p>
                </div>
              </div>
              <Select
                value={settings.file_default_privacy}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, file_default_privacy: value }))}
              >
                <SelectTrigger className="w-32 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity & Visibility */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Activity & Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Show Email Address</p>
                <p className="text-sm text-muted-foreground">Display your email on your public profile</p>
              </div>
              <Switch
                checked={settings.show_email}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, show_email: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Show Activity Status</p>
                <p className="text-sm text-muted-foreground">Let others see when you're active</p>
              </div>
              <Switch
                checked={settings.show_activity}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, show_activity: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Allow Direct Messages</p>
                <p className="text-sm text-muted-foreground">Let other users send you private messages</p>
              </div>
              <Switch
                checked={settings.allow_messages}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allow_messages: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Allow Follows</p>
                <p className="text-sm text-muted-foreground">Let other users follow your profile</p>
              </div>
              <Switch
                checked={settings.allow_follows}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allow_follows: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Search Visibility</p>
                <p className="text-sm text-muted-foreground">Allow your profile to appear in search results</p>
              </div>
              <Switch
                checked={settings.search_visibility}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, search_visibility: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Activity Tracking</p>
                <p className="text-sm text-muted-foreground">Help us improve your experience with usage analytics</p>
              </div>
              <Switch
                checked={settings.activity_tracking}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, activity_tracking: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Privacy Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Profile Visibility:</span>
              <div className="flex items-center gap-2">
                {(() => {
                  const option = getCurrentPrivacyOption(settings.profile_privacy)
                  const Icon = option.icon
                  return (
                    <>
                      <Icon className={`h-4 w-4 ${option.color}`} />
                      <span className="font-medium text-foreground">{option.label}</span>
                    </>
                  )
                })()}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Default Blog Privacy:</span>
              <span className="font-medium text-foreground capitalize">{settings.blog_default_privacy}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Default File Privacy:</span>
              <span className="font-medium text-foreground capitalize">{settings.file_default_privacy}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isUpdating} className="bg-primary hover:bg-primary/90">
          {isUpdating ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Privacy Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
