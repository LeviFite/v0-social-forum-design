"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ProfileEditFormProps {
  user: {
    id: string
    username: string
    display_name?: string
    bio?: string
    avatar_url?: string
    website_url?: string
    location?: string
    theme_color: string
    privacy_level: string
  }
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    display_name: user.display_name || "",
    bio: user.bio || "",
    website_url: user.website_url || "",
    location: user.location || "",
    theme_color: user.theme_color,
    privacy_level: user.privacy_level,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          display_name: formData.display_name || null,
          bio: formData.bio || null,
          website_url: formData.website_url || null,
          location: formData.location || null,
          theme_color: formData.theme_color,
          privacy_level: formData.privacy_level,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        return
      }

      router.push(`/profile/${user.username}`)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href={`/profile/${user.username}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Link>
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Picture
                </Button>
                <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="display_name" className="block text-sm font-medium text-foreground">
                Display Name
              </label>
              <Input
                id="display_name"
                placeholder="Your display name"
                value={formData.display_name}
                onChange={(e) => handleInputChange("display_name", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-foreground">
                Bio
              </label>
              <Textarea
                id="bio"
                placeholder="Tell others about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="bg-input border-border text-foreground resize-none"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">{formData.bio.length}/500 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-foreground">
                Location
              </label>
              <Input
                id="location"
                placeholder="Your location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website_url" className="block text-sm font-medium text-foreground">
                Website
              </label>
              <Input
                id="website_url"
                type="url"
                placeholder="https://your-website.com"
                value={formData.website_url}
                onChange={(e) => handleInputChange("website_url", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customization */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="theme_color" className="block text-sm font-medium text-foreground">
                Theme Color
              </label>
              <Select value={formData.theme_color} onValueChange={(value) => handleInputChange("theme_color", value)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pink">🌸 Pink</SelectItem>
                  <SelectItem value="green">🌿 Green</SelectItem>
                  <SelectItem value="blue">💙 Blue</SelectItem>
                  <SelectItem value="purple">💜 Purple</SelectItem>
                  <SelectItem value="orange">🧡 Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="privacy_level" className="block text-sm font-medium text-foreground">
                Privacy Level
              </label>
              <Select
                value={formData.privacy_level}
                onValueChange={(value) => handleInputChange("privacy_level", value)}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">🌍 Public - Anyone can view your profile</SelectItem>
                  <SelectItem value="friends">👥 Friends - Only followers can view details</SelectItem>
                  <SelectItem value="private">🔒 Private - Only you can view your profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/profile/${user.username}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
