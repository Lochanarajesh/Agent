"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoginCard } from "@/components/login-card"
import { SignUpCard } from "@/components/signup-card"
import { AuthLayout } from "@/components/auth-layout"
import { ChatPage } from "@/components/chat-page"

type AuthView = "login" | "signup"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [authView, setAuthView] = useState<AuthView>("login")

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        {authView === "login" ? (
          <LoginCard onSwitchToSignUp={() => setAuthView("signup")} />
        ) : (
          <SignUpCard onSwitchToLogin={() => setAuthView("login")} />
        )}
      </AuthLayout>
    )
  }

  return <ChatPage />
}
