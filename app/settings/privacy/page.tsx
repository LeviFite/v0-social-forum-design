import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Header from "@/components/layout/header"
import SettingsLayout from "@/components/settings/settings-layout"
import PrivacySettings from "@/components/settings/privacy-settings"

export default async function PrivacySettingsPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <SettingsLayout>
          <PrivacySettings user={userProfile} />
        </SettingsLayout>
      </main>
    </div>
  )
}
