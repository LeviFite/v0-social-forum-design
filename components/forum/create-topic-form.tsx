"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface CreateTopicFormProps {
  categories: Array<{
    id: string
    name: string
    icon: string
    color: string
  }>
  defaultCategoryId?: string
}

export default function CreateTopicForm({ categories, defaultCategoryId }: CreateTopicFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState(defaultCategoryId || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categoryId || isSubmitting) return

    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("forum_topics")
        .insert({
          category_id: categoryId,
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating topic:", error)
        return
      }

      router.push(`/topic/${data.id}`)
    } catch (error) {
      console.error("Error submitting topic:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </Button>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl">Topic Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-foreground">
                Category
              </label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for your topic"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-foreground">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{content.length}/2000 characters</p>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim() || !categoryId}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  "Creating..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Topic
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
