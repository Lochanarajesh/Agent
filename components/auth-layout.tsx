"use client"

import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Footer */}
      <p className="relative z-10 text-xs text-muted-foreground mt-8">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
