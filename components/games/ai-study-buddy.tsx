"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Heart, Zap, Brain, MessageCircle, Star, Gift, Sparkles } from "lucide-react"

interface StudyBuddy {
  name: string
  level: number
  happiness: number
  energy: number
  evolution: "Egg" | "Baby" | "Teen" | "Adult" | "Master"
  lastFed: Date
  streakDays: number
}

export function AIStudyBuddy() {
  const [buddy, setBuddy] = useState<StudyBuddy>({
    name: "Sage",
    level: 5,
    happiness: 85,
    energy: 70,
    evolution: "Teen",
    lastFed: new Date(),
    streakDays: 7,
  })

  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "buddy",
      text: "Hello! I'm Sage, your AI learning companion! 🌟 I'm here to guide you through your educational journey!",
    },
    { sender: "buddy", text: "I see you've been doing great with your 7-day streak! Keep it up! 💪" },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const getBuddyEmoji = () => {
    switch (buddy.evolution) {
      case "Egg":
        return "🥚"
      case "Baby":
        return "🐣"
      case "Teen":
        return "🦄"
      case "Adult":
        return "🐉"
      case "Master":
        return "✨🐲✨"
      default:
        return "🦄"
    }
  }

  const getBuddyMood = () => {
    if (buddy.happiness >= 80) return "Happy"
    if (buddy.happiness >= 60) return "Content"
    if (buddy.happiness >= 40) return "Okay"
    if (buddy.happiness >= 20) return "Sad"
    return "Very Sad"
  }

  const feedBuddy = () => {
    setBuddy((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      energy: Math.min(100, prev.energy + 15),
      lastFed: new Date(),
    }))

    const responses = [
      "Yummy! Thank you for the knowledge treats! 🍎",
      "I feel so energized now! Ready to learn more! ⚡",
      "That was delicious! I'm growing stronger! 💪",
      "More learning fuel! I love studying with you! 📚",
    ]

    setChatHistory((prev) => [
      ...prev,
      {
        sender: "buddy",
        text: responses[Math.floor(Math.random() * responses.length)],
      },
    ])
  }

  const sendMessage = async () => {
    if (!message.trim()) return

    setChatHistory((prev) => [...prev, { sender: "user", text: message }])
    setIsTyping(true)

    // Simulate AI response with emotion-based adaptation
    setTimeout(() => {
      let response = ""

      if (message.toLowerCase().includes("tired") || message.toLowerCase().includes("bored")) {
        response =
          "I sense you might be feeling tired! 😴 How about we try a fun mini-game instead? Or maybe take a short break and come back refreshed! 🎮"
      } else if (message.toLowerCase().includes("difficult") || message.toLowerCase().includes("hard")) {
        response =
          "Don't worry! Every expert was once a beginner. 🌱 Let's break this down into smaller, easier steps. You've got this! 💪"
      } else if (message.toLowerCase().includes("math")) {
        response =
          "Math is like a puzzle! 🧩 Each problem is a mystery waiting to be solved. Want me to help you with some practice problems? I love math adventures! 🔢"
      } else if (message.toLowerCase().includes("science")) {
        response =
          "Science is amazing! 🔬 It's like being a detective, discovering how the world works. What scientific mystery shall we explore today? 🌟"
      } else {
        const responses = [
          "That's interesting! Tell me more about what you're learning! 🤔",
          "I love learning new things with you! What's your favorite subject? 📚",
          "You're doing amazing! I can see how much you're growing! 🌟",
          "Learning together is the best! What would you like to explore next? 🚀",
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      }

      setChatHistory((prev) => [...prev, { sender: "buddy", text: response }])
      setIsTyping(false)
    }, 1500)

    setMessage("")
  }

  const playWithBuddy = () => {
    setBuddy((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 5),
      energy: Math.max(0, prev.energy - 10),
    }))

    setChatHistory((prev) => [
      ...prev,
      {
        sender: "buddy",
        text: "Yay! Playing is so much fun! 🎉 I feel happier already! Want to play a learning game together? 🎮",
      },
    ])
  }

  return (
    <div className="space-y-6">
      {/* Buddy Status Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {getBuddyEmoji()} {buddy.name}
              </h3>
              <p className="text-sm opacity-90">
                Level {buddy.level} {buddy.evolution}
              </p>
              <p className="text-sm opacity-90">Mood: {getBuddyMood()}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                {buddy.streakDays} Day Streak! 🔥
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buddy Stats */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Heart className="h-4 w-4 text-red-500" />
                    Happiness
                  </span>
                  <span className="text-sm text-gray-600">{buddy.happiness}/100</span>
                </div>
                <Progress value={buddy.happiness} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Energy
                  </span>
                  <span className="text-sm text-gray-600">{buddy.energy}/100</span>
                </div>
                <Progress value={buddy.energy} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button onClick={feedBuddy} size="sm" className="flex-1">
                  <Brain className="h-4 w-4 mr-2" />
                  Feed Knowledge
                </Button>
                <Button onClick={playWithBuddy} variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Star className="h-4 w-4 mr-2" />
                  Play
                </Button>
              </div>
            </div>

            {/* Evolution Preview */}
            <div className="text-center">
              <div className="text-6xl mb-2">{getBuddyEmoji()}</div>
              <p className="text-sm text-gray-600 mb-2">
                {buddy.evolution === "Master"
                  ? "Maximum evolution reached! 🎉"
                  : `${250 - buddy.level * 50} XP to next evolution`}
              </p>
              {buddy.evolution !== "Master" && (
                <div className="text-xs text-gray-500">
                  Next:{" "}
                  {buddy.evolution === "Egg"
                    ? "Baby 🐣"
                    : buddy.evolution === "Baby"
                      ? "Teen 🦄"
                      : buddy.evolution === "Teen"
                        ? "Adult 🐉"
                        : "Master ✨🐲✨"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardContent className="p-6">
          <CardTitle className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5" />
            Chat with {buddy.name}
          </CardTitle>

          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4 space-y-3">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    chat.sender === "user" ? "bg-blue-500 text-white" : "bg-white border shadow-sm"
                  }`}
                >
                  <p className="text-sm">{chat.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm px-3 py-2 rounded-lg">
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
          </div>

          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about learning!"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <Card>
        <CardContent className="p-6">
          <CardTitle className="flex items-center gap-2 mb-4">
            <Gift className="h-5 w-5" />
            Daily Buddy Challenges
          </CardTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Study Streak</span>
              </div>
              <p className="text-sm text-green-700">Study for 15 minutes to keep your buddy happy!</p>
              <Badge variant="secondary" className="mt-2 bg-green-200 text-green-800">
                7/7 days ✓
              </Badge>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Knowledge Feed</span>
              </div>
              <p className="text-sm text-blue-700">Complete 3 learning activities to feed your buddy!</p>
              <Badge variant="secondary" className="mt-2 bg-blue-200 text-blue-800">
                2/3 activities
              </Badge>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Play Time</span>
              </div>
              <p className="text-sm text-purple-700">Play a learning game with your buddy!</p>
              <Badge variant="secondary" className="mt-2 bg-purple-200 text-purple-800">
                Ready to play!
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
