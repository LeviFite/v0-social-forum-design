"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

interface BlogEditorProps {
  mode: "create" | "edit"
  blogPost?: {
    id: string
    title: string
    content: any
    slug: string
    is_published: boolean
    privacy_level: string
  }
}

export default function BlogEditor({ mode, blogPost }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: blogPost?.title || "",
    slug: blogPost?.slug || "",
    content: blogPost?.content || [{ type: "paragraph", content: "" }],
    is_published: blogPost?.is_published || false,
    privacy_level: blogPost?.privacy_level || "public",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === "create" && formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, mode, formData.slug])

  const handleSubmit = async (publish = false) => {
    if (!formData.title.trim() || !formData.slug.trim()) return

    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const blogData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content,
        is_published: publish,
        privacy_level: formData.privacy_level,
        updated_at: new Date().toISOString(),
      }

      if (mode === "create") {
        const { data, error } = await supabase
          .from("user_blogs")
          .insert({
            ...blogData,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating blog:", error)
          return
        }

        router.push(`/blog/edit/${data.id}`)
      } else {
        const { error } = await supabase.from("user_blogs").update(blogData).eq("id", blogPost!.id)

        if (error) {
          console.error("Error updating blog:", error)
          return
        }

        if (publish) {
          // Get user profile for redirect
          const { data: userProfile } = await supabase.from("users").select("username").eq("id", user.id).single()
          router.push(`/blog/${userProfile?.username}/${formData.slug}`)
        }
      }
    } catch (error) {
      console.error("Error submitting blog:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    await handleSubmit(false)
    setIsSaving(false)
  }

  const handlePublish = async () => {
    await handleSubmit(true)
  }

  const handleDelete = async () => {
    if (!blogPost || !confirm("Are you sure you want to delete this blog post?")) return

    try {
      const { error } = await supabase.from("user_blogs").delete().eq("id", blogPost.id)

      if (error) {
        console.error("Error deleting blog:", error)
        return
      }

      router.push("/profile")
    } catch (error) {
      console.error("Error deleting blog:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant={formData.is_published ? "default" : "secondary"}>
            {formData.is_published ? "Published" : "Draft"}
          </Badge>
          {mode === "edit" && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Blog Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Blog Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-foreground">
                URL Slug
              </label>
              <Input
                id="slug"
                placeholder="url-friendly-slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="privacy_level" className="block text-sm font-medium text-foreground">
                Privacy Level
              </label>
              <Select
                value={formData.privacy_level}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, privacy_level: value }))}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">🌍 Public - Anyone can read</SelectItem>
                  <SelectItem value="friends">👥 Friends - Only followers can read</SelectItem>
                  <SelectItem value="private">🔒 Private - Only you can read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
              />
              <label htmlFor="is_published" className="text-sm font-medium text-foreground">
                Published
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Editor */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your blog content here..."
            className="min-h-[300px]"
            value={JSON.stringify(formData.content, null, 2)}
            onChange={(e) => {
              try {
                setFormData((prev) => ({ ...prev, content: JSON.parse(e.target.value) }))
              } catch (error) {
                // Handle JSON parsing error if needed
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {mode === "edit" ? "Last saved: Just now" : "Unsaved changes"}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>

          {formData.is_published ? (
            <Button onClick={handlePublish} disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90">
              {isSubmitting ? (
                "Updating..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Post
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handlePublish} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? (
                "Publishing..."
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
