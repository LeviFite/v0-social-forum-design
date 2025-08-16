"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, Bell, Mail, MessageSquare, UserPlus, Smartphone } from "lucide-react"

interface NotificationSettingsProps {
  user: {
    id: string
    email: string
  }
}

export default function NotificationSettings({ user }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState({
    new_followers: true,
    new_messages: true,
    topic_replies: true,
    blog_comments: false,
    likes_reactions: false,
    weekly_digest: true,
    security_alerts: true,
    product_updates: false,
  })

  const [pushNotifications, setPushNotifications] = useState({
    new_followers: true,
    new_messages: true,
    topic_replies: false,
    blog_comments: false,
    likes_reactions: false,
  })

  const [isUpdating, setIsUpdating] = useState(false)

  const handleSave = async () => {
    setIsUpdating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsUpdating(false)
  }

  const notificationCategories = [
    {
      title: "Social",
      icon: UserPlus,
      items: [
        {
          key: "new_followers",
          label: "New Followers",
          description: "When someone follows your profile",
        },
        {
          key: "new_messages",
          label: "Direct Messages",
          description: "When you receive a private message",
        },
      ],
    },
    {
      title: "Content",
      icon: MessageSquare,
      items: [
        {
          key: "topic_replies",
          label: "Topic Replies",
          description: "When someone replies to your forum topics",
        },
        {
          key: "blog_comments",
          label: "Blog Comments",
          description: "When someone comments on your blog posts",
        },
        {
          key: "likes_reactions",
          label: "Likes & Reactions",
          description: "When someone likes your content",
        },
      ],
    },
    {
      title: "System",
      icon: Bell,
      items: [
        {
          key: "weekly_digest",
          label: "Weekly Digest",
          description: "Summary of your activity and popular content",
        },
        {
          key: "security_alerts",
          label: "Security Alerts",
          description: "Important security notifications",
        },
        {
          key: "product_updates",
          label: "Product Updates",
          description: "New features and platform updates",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Notifications will be sent to <strong>{user.email}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationCategories.map((category, categoryIndex) => {
            const Icon = category.icon

            return (
              <div key={category.title}>
                {categoryIndex > 0 && <Separator className="mb-6" />}

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-foreground">{category.title}</h3>
                  </div>

                  <div className="space-y-4 ml-6">
                    {category.items.map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch
                          checked={emailNotifications[item.key as keyof typeof emailNotifications]}
                          onCheckedChange={(checked) =>
                            setEmailNotifications((prev) => ({ ...prev, [item.key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <p className="text-sm text-muted-foreground">Real-time notifications on your device</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {notificationCategories.slice(0, 2).map((category) => (
              <div key={category.title}>
                <div className="flex items-center gap-2 mb-4">
                  <category.icon className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-foreground">{category.title}</h3>
                </div>

                <div className="space-y-4 ml-6">
                  {category.items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={pushNotifications[item.key as keyof typeof pushNotifications]}
                        onCheckedChange={(checked) =>
                          setPushNotifications((prev) => ({ ...prev, [item.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <Separator className="mt-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Notification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Email Notifications</p>
              <div className="flex items-center gap-2">
                <Badge variant="default">{Object.values(emailNotifications).filter(Boolean).length} enabled</Badge>
                <Badge variant="outline">{Object.values(emailNotifications).filter((v) => !v).length} disabled</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Push Notifications</p>
              <div className="flex items-center gap-2">
                <Badge variant="default">{Object.values(pushNotifications).filter(Boolean).length} enabled</Badge>
                <Badge variant="outline">{Object.values(pushNotifications).filter((v) => !v).length} disabled</Badge>
              </div>
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
              Save Notification Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
