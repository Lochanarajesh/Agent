"use client"

import { Mail, FileText, StickyNote, FileSpreadsheet, MapPin } from "lucide-react"
import type { Message } from "@/lib/types"

interface ChatMessageProps {
  message: Message
}

function getSourceIcon(sourceType: string) {
  const type = sourceType.toLowerCase()
  if (type.includes("email")) return <Mail className="h-4 w-4" />
  if (type.includes("pdf") || type.includes("document")) return <FileText className="h-4 w-4" />
  if (type.includes("note")) return <StickyNote className="h-4 w-4" />
  if (type.includes("csv") || type.includes("spreadsheet")) return <FileSpreadsheet className="h-4 w-4" />
  return <FileText className="h-4 w-4" />
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] space-y-3 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.source && (
          <div className="bg-secondary/50 border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
              <span>Source Information</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                {getSourceIcon(message.source.sourceType)}
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground">{message.source.sourceType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium text-foreground">{message.source.location}</span>
              </div>
            </div>
          </div>
        )}

        <span className="text-xs text-muted-foreground block">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}
