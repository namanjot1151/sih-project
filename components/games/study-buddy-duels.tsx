"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Zap,
  Users,
  Trophy,
  Clock,
  Star,
  Sword,
  Shield,
  Heart,
  Camera,
  Smartphone,
  Wifi,
  WifiOff,
  Crown,
} from "lucide-react"

interface DuelOpponent {
  id: string
  name: string
  avatar: string
  level: number
  winRate: number
  location: string
  subject: string
  isOnline: boolean
}

interface DuelQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  subject: string
  arCharacter?: string
}

interface DuelState {
  phase: "matchmaking" | "countdown" | "battle" | "results"
  opponent: DuelOpponent | null
  currentQuestion: DuelQuestion | null
  playerScore: number
  opponentScore: number
  timeLeft: number
  round: number
  totalRounds: number
  playerAnswer: number | null
  opponentAnswer: number | null
  isARMode: boolean
}

export function StudyBuddyDuels({ onBack }: { onBack: () => void }) {
  const { user, updateUserProgress } = useAuth()
  const [duelState, setDuelState] = useState<DuelState>({
    phase: "matchmaking",
    opponent: null,
    currentQuestion: null,
    playerScore: 0,
    opponentScore: 0,
    timeLeft: 15,
    round: 1,
    totalRounds: 5,
    playerAnswer: null,
    opponentAnswer: null,
    isARMode: false,
  })
  const [selectedSubject, setSelectedSubject] = useState("math")
  const [isLoading, setIsLoading] = useState(false)

  // Mock opponents for demonstration
  const mockOpponents: DuelOpponent[] = [
    {
      id: "1",
      name: "Alex from Village Creek",
      avatar: "/placeholder.svg?height=40&width=40",
      level: user?.level || 1,
      winRate: 78,
      location: "Village Creek (2.3km away)",
      subject: "Mathematics",
      isOnline: true,
    },
    {
      id: "2",
      name: "Maya from Riverside",
      avatar: "/placeholder.svg?height=40&width=40",
      level: (user?.level || 1) + 1,
      winRate: 85,
      location: "Riverside (4.1km away)",
      subject: "History",
      isOnline: true,
    },
    {
      id: "3",
      name: "Sam from Pine Valley",
      avatar: "/placeholder.svg?height=40&width=40",
      level: (user?.level || 1) - 1,
      winRate: 72,
      location: "Pine Valley (1.8km away)",
      subject: "Science",
      isOnline: false,
    },
  ]

  const subjects = [
    { id: "math", name: "Mathematics", icon: "📊", color: "from-blue-500 to-blue-600" },
    { id: "history", name: "History", icon: "🏛️", color: "from-amber-500 to-amber-600" },
    { id: "science", name: "Science", icon: "🔬", color: "from-green-500 to-green-600" },
    { id: "english", name: "English", icon: "📚", color: "from-purple-500 to-purple-600" },
    { id: "geography", name: "Geography", icon: "🌍", color: "from-teal-500 to-teal-600" },
  ]

  const arCharacters = {
    math: "🧮 Mathematical Wizard",
    history: "⚔️ Historical Knight",
    science: "🔬 Lab Scientist",
    english: "📖 Literary Scholar",
    geography: "🗺️ World Explorer",
  }

  // Generate AI question for duel
  const generateDuelQuestion = async (subject: string): Promise<DuelQuestion> => {
    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          difficulty: user?.level || 1,
          gameType: "duel",
        }),
      })

      if (!response.ok) throw new Error("Failed to generate question")

      const data = await response.json()
      return {
        id: Date.now().toString(),
        question: data.question,
        options: data.options,
        correct: data.correct,
        explanation: data.explanation,
        subject,
        arCharacter: arCharacters[subject as keyof typeof arCharacters],
      }
    } catch (error) {
      console.error("Error generating duel question:", error)
      // Fallback question
      return {
        id: Date.now().toString(),
        question: `What is 2 + 2?`,
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "2 + 2 equals 4",
        subject,
        arCharacter: arCharacters[subject as keyof typeof arCharacters],
      }
    }
  }

  // Start matchmaking
  const startMatchmaking = async () => {
    setIsLoading(true)
    setDuelState((prev) => ({ ...prev, phase: "matchmaking" }))

    // Simulate matchmaking delay
    setTimeout(() => {
      const availableOpponents = mockOpponents.filter((opp) => opp.isOnline)
      const randomOpponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)]

      setDuelState((prev) => ({
        ...prev,
        opponent: randomOpponent,
        phase: "countdown",
      }))
      setIsLoading(false)

      // Start countdown
      setTimeout(() => {
        startBattle()
      }, 3000)
    }, 2000)
  }

  // Start battle phase
  const startBattle = async () => {
    const question = await generateDuelQuestion(selectedSubject)
    setDuelState((prev) => ({
      ...prev,
      phase: "battle",
      currentQuestion: question,
      timeLeft: 15,
      playerAnswer: null,
      opponentAnswer: null,
    }))

    // Start timer
    const timer = setInterval(() => {
      setDuelState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return { ...prev, timeLeft: 0 }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)
  }

  // Handle answer selection
  const handleAnswer = (answerIndex: number) => {
    if (duelState.playerAnswer !== null) return

    setDuelState((prev) => ({ ...prev, playerAnswer: answerIndex }))

    // Simulate opponent answer (random delay)
    setTimeout(
      () => {
        const opponentAnswer =
          Math.random() < 0.7 ? duelState.currentQuestion?.correct || 0 : Math.floor(Math.random() * 4)
        setDuelState((prev) => ({ ...prev, opponentAnswer }))

        // Show results after both answered
        setTimeout(() => {
          processRoundResults(answerIndex, opponentAnswer)
        }, 1500)
      },
      Math.random() * 3000 + 1000,
    )
  }

  // Handle time up
  const handleTimeUp = () => {
    if (duelState.playerAnswer === null) {
      setDuelState((prev) => ({ ...prev, playerAnswer: -1 }))
    }

    // Simulate opponent answer if not answered
    setTimeout(() => {
      const opponentAnswer =
        Math.random() < 0.5 ? duelState.currentQuestion?.correct || 0 : Math.floor(Math.random() * 4)
      setDuelState((prev) => ({ ...prev, opponentAnswer }))

      setTimeout(() => {
        processRoundResults(duelState.playerAnswer || -1, opponentAnswer)
      }, 1500)
    }, 1000)
  }

  // Process round results
  const processRoundResults = (playerAnswer: number, opponentAnswer: number) => {
    const correctAnswer = duelState.currentQuestion?.correct || 0
    const playerCorrect = playerAnswer === correctAnswer
    const opponentCorrect = opponentAnswer === correctAnswer

    let newPlayerScore = duelState.playerScore
    let newOpponentScore = duelState.opponentScore

    if (playerCorrect) newPlayerScore += 100
    if (opponentCorrect) newOpponentScore += 100

    setDuelState((prev) => ({
      ...prev,
      playerScore: newPlayerScore,
      opponentScore: newOpponentScore,
    }))

    // Check if duel is complete
    if (duelState.round >= duelState.totalRounds) {
      setTimeout(() => {
        finishDuel(newPlayerScore, newOpponentScore)
      }, 2000)
    } else {
      // Next round
      setTimeout(() => {
        setDuelState((prev) => ({
          ...prev,
          round: prev.round + 1,
        }))
        startBattle()
      }, 3000)
    }
  }

  // Finish duel and show results
  const finishDuel = (finalPlayerScore: number, finalOpponentScore: number) => {
    const won = finalPlayerScore > finalOpponentScore
    const xpGained = won ? 150 : 75

    setDuelState((prev) => ({
      ...prev,
      phase: "results",
      playerScore: finalPlayerScore,
      opponentScore: finalOpponentScore,
    }))

    // Update user progress
    if (user) {
      updateUserProgress(xpGained, selectedSubject, won ? "duel_won" : "duel_participated")
    }
  }

  // Toggle AR mode
  const toggleARMode = () => {
    setDuelState((prev) => ({ ...prev, isARMode: !prev.isARMode }))
  }

  if (duelState.phase === "matchmaking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Study Buddy Duels</h1>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">AR Enhanced</Badge>
          </div>

          {/* Subject Selection */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Choose Your Battle Subject</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {subjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.id ? "default" : "outline"}
                    onClick={() => setSelectedSubject(subject.id)}
                    className="h-20 flex-col gap-2"
                  >
                    <span className="text-2xl">{subject.icon}</span>
                    <span className="text-sm">{subject.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AR Mode Toggle */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">AR Flashcard Mode</h3>
                    <p className="text-sm text-gray-600">Use your camera for immersive AR battles</p>
                  </div>
                </div>
                <Button
                  variant={duelState.isARMode ? "default" : "outline"}
                  onClick={toggleARMode}
                  className="flex items-center gap-2"
                >
                  {duelState.isARMode ? <Smartphone className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                  {duelState.isARMode ? "AR ON" : "AR OFF"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Opponents */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Nearby Study Buddies
              </h2>
              <div className="space-y-3">
                {mockOpponents.map((opponent) => (
                  <div
                    key={opponent.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={opponent.avatar || "/placeholder.svg"} alt={opponent.name} />
                          <AvatarFallback>{opponent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {opponent.isOnline ? (
                          <Wifi className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
                        ) : (
                          <WifiOff className="h-3 w-3 text-gray-400 absolute -top-1 -right-1" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{opponent.name}</h3>
                        <p className="text-sm text-gray-600">{opponent.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Level {opponent.level}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {opponent.winRate}% Win Rate
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={opponent.isOnline ? "default" : "secondary"}
                        className={opponent.isOnline ? "bg-green-500" : ""}
                      >
                        {opponent.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Duel Button */}
          <Card>
            <CardContent className="p-6 text-center">
              <Button
                onClick={startMatchmaking}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Finding Opponent...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Start Duel Battle
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-2">Challenge nearby students to quick learning duels!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (duelState.phase === "countdown") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Duel Starting!</h2>
              <p className="text-gray-600">Get ready to battle</p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-medium">{user?.name}</p>
                <Badge variant="outline">Level {user?.level}</Badge>
              </div>

              <div className="text-center">
                <Sword className="h-8 w-8 text-red-500 mx-auto animate-pulse" />
                <p className="text-sm text-gray-600 mt-2">VS</p>
              </div>

              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={duelState.opponent?.avatar || "/placeholder.svg"} alt={duelState.opponent?.name} />
                  <AvatarFallback>{duelState.opponent?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-medium">{duelState.opponent?.name}</p>
                <Badge variant="outline">Level {duelState.opponent?.level}</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="text-6xl font-bold text-purple-600 animate-pulse">3</div>
              <p className="text-sm text-gray-600 mt-2">Subject: {selectedSubject}</p>
              {duelState.isARMode && (
                <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500">
                  <Camera className="h-3 w-3 mr-1" />
                  AR Mode Active
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (duelState.phase === "battle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Battle Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-bold text-red-600">{duelState.playerScore}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-lg font-bold text-orange-600">{duelState.timeLeft}s</span>
              </div>
              <Badge variant="outline">
                Round {duelState.round}/{duelState.totalRounds}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{duelState.opponent?.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">{duelState.opponentScore}</span>
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <Avatar>
                <AvatarImage src={duelState.opponent?.avatar || "/placeholder.svg"} alt={duelState.opponent?.name} />
                <AvatarFallback>{duelState.opponent?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* AR Mode Indicator */}
          {duelState.isARMode && (
            <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <Camera className="h-5 w-5" />
                  <span className="font-medium">AR Mode: {duelState.currentQuestion?.arCharacter}</span>
                  <div className="animate-pulse">📱</div>
                </div>
                <p className="text-center text-sm opacity-90 mt-1">
                  Point your camera to see the {duelState.currentQuestion?.arCharacter} in action!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Question Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Badge className="mb-4" variant="secondary">
                  {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}
                </Badge>
                <h2 className="text-2xl font-bold mb-4">{duelState.currentQuestion?.question}</h2>
                <Progress value={(15 - duelState.timeLeft) * (100 / 15)} className="w-full max-w-md mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {duelState.currentQuestion?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      duelState.playerAnswer === index
                        ? duelState.playerAnswer === duelState.currentQuestion?.correct
                          ? "default"
                          : "destructive"
                        : "outline"
                    }
                    onClick={() => handleAnswer(index)}
                    disabled={duelState.playerAnswer !== null}
                    className="h-16 text-left justify-start p-4"
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>

              {/* Answer Status */}
              {duelState.playerAnswer !== null && (
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">You</p>
                      <div className="flex items-center gap-2">
                        {duelState.playerAnswer === duelState.currentQuestion?.correct ? (
                          <Badge className="bg-green-500">Correct!</Badge>
                        ) : (
                          <Badge variant="destructive">Wrong</Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">Opponent</p>
                      <div className="flex items-center gap-2">
                        {duelState.opponentAnswer === null ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        ) : duelState.opponentAnswer === duelState.currentQuestion?.correct ? (
                          <Badge className="bg-green-500">Correct!</Badge>
                        ) : (
                          <Badge variant="destructive">Wrong</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (duelState.phase === "results") {
    const won = duelState.playerScore > duelState.opponentScore
    const xpGained = won ? 150 : 75

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {won ? (
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              ) : (
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              )}
              <h2 className="text-3xl font-bold mb-2">{won ? "Victory!" : "Good Fight!"}</h2>
              <p className="text-gray-600">{won ? "You defeated your opponent!" : "Better luck next time!"}</p>
            </div>

            {/* Final Scores */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-medium">{user?.name}</p>
                <div className="text-2xl font-bold text-blue-600">{duelState.playerScore}</div>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-2">⚔️</div>
                <p className="text-sm text-gray-600">Final Score</p>
              </div>

              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={duelState.opponent?.avatar || "/placeholder.svg"} alt={duelState.opponent?.name} />
                  <AvatarFallback>{duelState.opponent?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-medium">{duelState.opponent?.name}</p>
                <div className="text-2xl font-bold text-red-600">{duelState.opponentScore}</div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Battle Rewards</h3>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">XP Gained</p>
                  <p className="font-bold text-lg">+{xpGained}</p>
                </div>
                {won && (
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Achievement</p>
                    <p className="font-bold text-sm">Duel Winner</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setDuelState({
                    phase: "matchmaking",
                    opponent: null,
                    currentQuestion: null,
                    playerScore: 0,
                    opponentScore: 0,
                    timeLeft: 15,
                    round: 1,
                    totalRounds: 5,
                    playerAnswer: null,
                    opponentAnswer: null,
                    isARMode: duelState.isARMode,
                  })
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Duel Again
              </Button>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
