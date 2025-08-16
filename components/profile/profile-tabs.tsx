"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Eye, ExternalLink, Edit, Plus, File, Upload } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import ProfileActivityFeed from "./profile-activity-feed"
import ProfileAboutSection from "./profile-about-section"

interface ProfileTabsProps {
  user: {
    id: string
    username: string
    display_name?: string
    bio?: string
    website_url?: string
    location?: string
    theme_color: string
    created_at: string
  }
  isOwnProfile: boolean
  userTopics: Array<{
    id: string
    title: string
    content: string
    view_count: number
    reply_count: number
    created_at: string
    forum_categories: {
      name: string
      color: string
      icon: string
    }
  }>
  userReplies: Array<{
    id: string
    content: string
    created_at: string
    forum_topics: {
      id: string
      title: string
    }
  }>
  userBlogs: Array<{
    id: string
    title: string
    content: any
    slug: string
    is_published: boolean
    created_at: string
  }>
}

export default function ProfileTabs({ user, isOwnProfile, userTopics, userReplies, userBlogs }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="activity">
      <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
        <TabsTrigger
          value="activity"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Activity
        </TabsTrigger>
        <TabsTrigger
          value="topics"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Topics ({userTopics?.length || 0})
        </TabsTrigger>
        <TabsTrigger
          value="blogs"
          className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
        >
          Blogs ({userBlogs?.length || 0})
        </TabsTrigger>
        <TabsTrigger
          value="files"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          myFiles
        </TabsTrigger>
        <TabsTrigger
          value="about"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          About
        </TabsTrigger>
      </TabsList>

      <TabsContent value="activity" className="mt-6">
        <ProfileActivityFeed user={user} userTopics={userTopics} userReplies={userReplies} />
      </TabsContent>

      <TabsContent value="topics" className="mt-6">
        <div className="space-y-4">
          {isOwnProfile && (
            <div className="flex justify-end">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/create-topic">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Topic
                </Link>
              </Button>
            </div>
          )}

          {userTopics.length > 0 ? (
            userTopics.map((topic) => (
              <Card key={topic.id} className="bg-card border-border hover:bg-card/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {topic.forum_categories.icon} {topic.forum_categories.name}
                        </Badge>
                      </div>
                      <Link href={`/topic/${topic.id}`}>
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2">
                          {topic.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {topic.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{topic.view_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{topic.reply_count}</span>
                      </div>
                    </div>
                    <span>{formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No topics yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? "You haven't created any topics yet." : "This user hasn't created any topics yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="blogs" className="mt-6">
        <div className="space-y-4">
          {isOwnProfile && (
            <div className="flex justify-end">
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link href="/blog/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Write Blog Post
                </Link>
              </Button>
            </div>
          )}

          {userBlogs.length > 0 ? (
            userBlogs.map((blog) => (
              <Card key={blog.id} className="bg-card border-border hover:bg-card/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link href={`/blog/${user.username}/${blog.slug}`}>
                        <h3 className="text-xl font-semibold text-foreground hover:text-secondary transition-colors mb-2">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-4">
                        {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/edit/${blog.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${user.username}/${blog.slug}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </Link>
                    </Button>
                    <Badge variant={blog.is_published ? "default" : "secondary"}>
                      {blog.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Edit className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile
                    ? "Start writing your first blog post!"
                    : "This user hasn't written any blog posts yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="files" className="mt-6">
        <div className="space-y-4">
          {isOwnProfile && (
            <div className="flex justify-end">
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link href="/files">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Files
                </Link>
              </Button>
            </div>
          )}

          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">File Management</h3>
              <p className="text-muted-foreground mb-4">
                {isOwnProfile ? "Upload and manage your files with privacy controls" : "This user's files are private"}
              </p>
              {isOwnProfile && (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/files">
                    <Upload className="h-4 w-4 mr-2" />
                    Go to File Manager
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="about" className="mt-6">
        <ProfileAboutSection user={user} isOwnProfile={isOwnProfile} />
      </TabsContent>
    </Tabs>
  )
}
