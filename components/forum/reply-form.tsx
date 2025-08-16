"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ReplyFormProps {
  topicId: string
}

export default function ReplyForm({ topicId }: ReplyFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("forum_replies").insert({
        topic_id: topicId,
        user_id: user.id,
        content: content.trim(),
      })

      if (error) {
        console.error("Error creating reply:", error)
        return
      }

      // Update topic reply count and last reply time
      await supabase.rpc("increment_topic_replies", { topic_id: topicId })

      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Add a Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            required
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{content.length}/1000 characters</p>
            <Button type="submit" disabled={isSubmitting || !content.trim()} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? (
                "Posting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Reply
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
