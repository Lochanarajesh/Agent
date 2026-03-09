export interface SourceInfo {
  sourceType: string
  location: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  source?: SourceInfo
  timestamp: Date
}
