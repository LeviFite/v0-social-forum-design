"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, Upload, Key, Mail, User, Calendar, Shield } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface AccountSettingsProps {
  user: {
    id: string
    email: string
    username: string
    display_name?: string
    avatar_url?: string
    created_at: string
  }
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    display_name: user.display_name || "",
    email: user.email,
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const router = useRouter()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: formData.username,
          display_name: formData.display_name || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        return
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords don't match")
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      })

      if (error) {
        console.error("Error updating password:", error)
        return
      }

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
      setShowPasswordForm(false)
      alert("Password updated successfully")
    } catch (error) {
      console.error("Error updating password:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Username
                </label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="display_name" className="block text-sm font-medium text-foreground">
                  Display Name
                </label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))}
                  className="bg-input border-border text-foreground"
                  placeholder="Your display name"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating} className="bg-primary hover:bg-primary/90">
                {isUpdating ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email Address</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Badge variant="outline">Verified</Badge>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">Last updated recently</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                Change Password
              </Button>
            </div>

            {showPasswordForm && (
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="current_password" className="block text-sm font-medium text-foreground">
                        Current Password
                      </label>
                      <Input
                        id="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, current_password: e.target.value }))}
                        className="bg-input border-border text-foreground"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="new_password" className="block text-sm font-medium text-foreground">
                        New Password
                      </label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, new_password: e.target.value }))}
                        className="bg-input border-border text-foreground"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-foreground">
                        Confirm New Password
                      </label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirm_password: e.target.value }))}
                        className="bg-input border-border text-foreground"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Update Password
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowPasswordForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Account Created</p>
              <p className="font-medium text-foreground">
                {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">User ID</p>
              <p className="font-mono text-xs text-foreground">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
