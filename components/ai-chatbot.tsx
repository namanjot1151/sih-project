"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  Calculator,
  Globe,
  Beaker,
  Palette,
  Trash2,
  RefreshCw,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  subject?: string
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI Study Assistant powered by Gemini AI. I can help you with any subject - math, science, history, English, and more. I can explain concepts, create practice problems, help with homework, or just have an educational conversation. What would you like to learn about today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const subjects = [
    { id: "math", name: "Mathematics", icon: Calculator, color: "bg-blue-500" },
    { id: "science", name: "Science", icon: Beaker, color: "bg-green-500" },
    { id: "english", name: "English", icon: BookOpen, color: "bg-purple-500" },
    { id: "history", name: "History", icon: Globe, color: "bg-orange-500" },
    { id: "art", name: "Art", icon: Palette, color: "bg-pink-500" },
    { id: "general", name: "General", icon: Lightbulb, color: "bg-yellow-500" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string, subject?: string, conversationHistory?: Message[]) => {
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          subject: subject,
          context: "educational_assistant",
          conversationHistory: conversationHistory?.slice(-10) || [], // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      setIsTyping(false)
      return data.response
    } catch (error) {
      console.error("AI Chat Error:", error)
      setIsTyping(false)
      return "I'm having trouble connecting right now. Please try asking your question again in a moment!"
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      subject: selectedSubject || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")

    const aiResponse = await generateAIResponse(currentMessage, selectedSubject || undefined, messages)

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: aiResponse,
      timestamp: new Date(),
      subject: selectedSubject || undefined,
    }

    setMessages((prev) => [...prev, botMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearConversation = () => {
    setMessages([
      {
        id: "1",
        type: "bot",
        content:
          "Hello! I'm your AI Study Assistant powered by Gemini AI. I can help you with any subject - math, science, history, English, and more. I can explain concepts, create practice problems, help with homework, or just have an educational conversation. What would you like to learn about today?",
        timestamp: new Date(),
      },
    ])
  }

  const regenerateLastResponse = async () => {
    if (messages.length < 2) return

    const lastUserMessage = messages.filter((m) => m.type === "user").pop()
    if (!lastUserMessage) return

    // Remove the last bot message
    const messagesWithoutLastBot = messages.slice(0, -1)
    setMessages(messagesWithoutLastBot)

    // Regenerate response
    const aiResponse = await generateAIResponse(
      lastUserMessage.content,
      lastUserMessage.subject,
      messagesWithoutLastBot,
    )

    const botMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: aiResponse,
      timestamp: new Date(),
      subject: lastUserMessage.subject,
    }

    setMessages((prev) => [...prev, botMessage])
  }

  const quickQuestions = [
    "Explain photosynthesis simply",
    "Help me with algebra",
    "What caused World War 1?",
    "Create a math quiz for me",
    "Explain gravity to a 10-year-old",
    "Help with essay writing",
    "What is DNA?",
    "Teach me about fractions",
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-500" />
              AI Study Assistant
              <Badge variant="secondary" className="ml-2">
                Powered by Gemini AI
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={regenerateLastResponse} disabled={messages.length < 2}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearConversation}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Subject Selection */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Choose a Subject (Optional)</h3>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={selectedSubject === subject.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                className="flex items-center gap-2"
              >
                <subject.icon className="h-4 w-4" />
                {subject.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="h-96">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900 border"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.subject && (
                      <Badge variant="outline" className="text-xs">
                        {subjects.find((s) => s.id === message.subject)?.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {message.type === "user" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gray-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3 border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* Quick Questions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Quick Questions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(question)}
                className="text-xs h-auto p-2 text-left justify-start"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {selectedSubject && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Current subject: {subjects.find((s) => s.id === selectedSubject)?.name}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
