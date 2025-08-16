"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Bell, Palette, Download, Trash2, Settings, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const settingsItems = [
    {
      id: "account",
      label: "Account",
      icon: User,
      href: "/settings",
      description: "Manage your account details and security",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: Shield,
      href: "/settings/privacy",
      description: "Control who can see your content and profile",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/settings/notifications",
      description: "Manage email and push notification preferences",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      href: "/settings/appearance",
      description: "Customize your theme and display preferences",
    },
    {
      id: "data",
      label: "Data & Export",
      icon: Download,
      href: "/settings/data",
      description: "Download your data and manage exports",
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: Trash2,
      href: "/settings/danger",
      description: "Delete or deactivate your account",
      isDanger: true,
    },
  ]

  const currentItem = settingsItems.find((item) => item.href === pathname) || settingsItems[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account and privacy preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Settings</span>
                </div>
              </div>

              <nav className="p-2">
                {settingsItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link key={item.id} href={item.href}>
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${item.isDanger && !isActive ? "text-destructive" : ""}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.isDanger && !isActive && (
                          <Badge variant="destructive" className="text-xs">
                            Danger
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <currentItem.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{currentItem.label}</h2>
                    <p className="text-muted-foreground text-sm">{currentItem.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">{children}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
