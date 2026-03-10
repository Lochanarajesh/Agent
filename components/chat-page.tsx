"use client"

import { Header } from "@/components/header"
import { ChatContainer } from "@/components/chat-container"

export function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full">
          <ChatContainer />
        </div>
      </main>
    </div>
  )
}
