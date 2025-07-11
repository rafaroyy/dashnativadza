"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, Phone, Video } from "lucide-react"
import { dbOperations, type User, type Message } from "@/lib/supabase"

interface ChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  currentUserId: string
}

export function ChatModal({ open, onOpenChange, user, currentUserId }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && user.id && currentUserId) {
      fetchMessages()
    }
  }, [open, user.id, currentUserId])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await dbOperations.getMessages(currentUserId, user.id)
      setMessages(data)
    } catch (error: any) {
      console.error("Error fetching messages:", error)
      setError("Erro ao carregar mensagens")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setError(null)
      const messageData = {
        sender_id: currentUserId,
        receiver_id: user.id,
        content: newMessage.trim(),
      }

      const sentMessage = await dbOperations.sendMessage(messageData)
      if (sentMessage) {
        setMessages((prev) => [...prev, sentMessage])
        setNewMessage("")
      }
    } catch (error: any) {
      console.error("Error sending message:", error)
      setError("Erro ao enviar mensagem")
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoje"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem"
    } else {
      return date.toLocaleDateString("pt-BR")
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-left">{user.name}</DialogTitle>
              <DialogDescription className="text-left">
                {user.online_status ? (
                  <span className="text-green-600">Online</span>
                ) : (
                  <span className="text-gray-500">Offline</span>
                )}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Nenhuma mensagem ainda. Inicie a conversa!
            </div>
          ) : (
            <div className="space-y-4">
              {groupMessagesByDate(messages).map(({ date, messages: dayMessages }) => (
                <div key={date}>
                  <div className="flex justify-center mb-4">
                    <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                      {formatDate(dayMessages[0].created_at)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dayMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            message.sender_id === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender_id === currentUserId
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t flex-shrink-0">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim() || loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
