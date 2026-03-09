"use client"

import { useState, useRef, useEffect } from "react"
import type { Message, SourceInfo } from "@/lib/types"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { LoadingIndicator } from "./loading-indicator"
import { Brain, Sparkles } from "lucide-react"

const WEBHOOK_URL = "http://localhost:5678/webhook-test/ee0a6a26-688e-4ca6-b9f2-808c98ec43f0"

function parseAIResponse(responseText: string): { content: string; source?: SourceInfo } {
  // Try to parse source information from the response
  // Expected format includes "Source:" and "Location:" 
  const sourceMatch = responseText.match(/Source:\s*(.+)/i)
  const locationMatch = responseText.match(/Location:\s*(.+)/i)
  
  let content = responseText
  let source: SourceInfo | undefined
  
  if (sourceMatch && locationMatch) {
    source = {
      sourceType: sourceMatch[1].trim(),
      location: locationMatch[1].trim()
    }
    // Clean up the content to remove source info lines
    content = responseText
      .replace(/Source:\s*.+/gi, "")
      .replace(/Location:\s*.+/gi, "")
      .replace(/Answer:\s*/gi, "")
      .trim()
  }
  
  return { content, source }
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: content })
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.text()
      const { content: aiContent, source } = parseAIResponse(data)

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiContent || "I found relevant information for you.",
        source,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      // If webhook fails, show a demo response for testing
      const demoMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I couldn't connect to the server. Please ensure the webhook endpoint is running at localhost:5678.",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, demoMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Welcome to Memora
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Your personal AI assistant for finding information across emails, documents, notes, and files.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {[
                "What did we decide about the event logistics?",
                "Where is the event plan stored?",
                "Find the budget discussion from last week",
                "Show me notes about the project timeline"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-colors text-left text-sm"
                >
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
