"use client"

import { Brain, Github, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">Memora</span>
        </div>
        <nav className="flex items-center gap-2">
          {user && (
            <span className="text-sm text-muted-foreground mr-2">
              {user.email}
            </span>
          )}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Docs
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Github className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            onClick={logout}
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
