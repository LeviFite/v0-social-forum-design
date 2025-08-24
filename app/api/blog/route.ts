import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const blogData = await request.json()

    // Get user profile to include username in response
    const { data: userProfile } = await supabase.from("users").select("username").eq("id", user.id).single()

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        ...blogData,
        author_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      ...data,
      author_username: userProfile?.username,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...blogData } = await request.json()

    // Get user profile to include username in response
    const { data: userProfile } = await supabase.from("users").select("username").eq("id", user.id).single()

    const { data, error } = await supabase
      .from("blog_posts")
      .update(blogData)
      .eq("id", id)
      .eq("author_id", user.id) // Ensure user can only update their own posts
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      ...data,
      author_username: userProfile?.username,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
