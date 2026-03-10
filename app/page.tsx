"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginCard } from "@/components/login-card"
import { AuthLayout } from "@/components/auth-layout"
import { ChatPage } from "@/components/chat-page"

export default function Home() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <LoginCard />
      </AuthLayout>
    )
  }

  return <ChatPage />
}
