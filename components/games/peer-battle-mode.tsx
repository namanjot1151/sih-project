"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Zap, Trophy, Clock, Star, Sword, Shield, Loader2 } from "lucide-react"

interface Player {
  id: string
  name: string
  level: number
  avatar: string
  score: number
  streak: number
}

interface BattleQuestion {
  id: string
  question: string
  options: string[]
  correct: string
  explanation: string
  timeLimit: number
  difficulty: number
}

interface PeerBattleModeProps {
  onBack: () => void
}

export function PeerBattleMode({ onBack }: PeerBattleModeProps) {
  const [gamePhase, setGamePhase] = useState<"lobby" | "matchmaking" | "battle" | "results">("lobby")
  const [currentPlayer] = useState<Player>({
    id: "player1",
    name: "You",
    level: 5,
    avatar: "/student-avatar.png",
    score: 0,
    streak: 0,
  })
  const [opponent, setOpponent] = useState<Player | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<BattleQuestion | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [playerAnswer, setPlayerAnswer] = useState<string | null>(null)
  const [opponentAnswer, setOpponentAnswer] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [battleResults, setBattleResults] = useState<{
    winner: string
    playerScore: number
    opponentScore: number
  } | null>(null)
  const [currentRound, setCurrentRound] = useState(1)
  const [battleLevel, setBattleLevel] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  const mockOpponents: Player[] = [
    { id: "bot1", name: "Alex the Explorer", level: 4, avatar: "/placeholder.svg", score: 0, streak: 0 },
    { id: "bot2", name: "Maya the Mathematician", level: 6, avatar: "/placeholder.svg", score: 0, streak: 0 },
    { id: "bot3", name: "Sam the Scientist", level: 5, avatar: "/placeholder.svg", score: 0, streak: 0 },
    { id: "bot4", name: "Luna the Linguist", level: 7, avatar: "/placeholder.svg", score: 0, streak: 0 },
  ]

  const generateAIQuestion = async (level: number, subject = "mixed") => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject,
          difficulty: Math.min(level, 20),
          grade: 6,
          gameType: "quiz-battle-arena",
          count: 1,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate question")

      const data = await response.json()

      if (data.question && data.options && data.correct && data.explanation) {
        return {
          id: `ai-${Date.now()}`,
          question: data.question,
          options: data.options,
          correct: data.correct,
          explanation: data.explanation,
          timeLimit: Math.max(10, 20 - Math.floor(level / 3)),
          difficulty: level,
        }
      }

      throw new Error("Invalid question format")
    } catch (error) {
      console.error("Error generating AI question:", error)
      return generateLocalQuestion(level)
    } finally {
      setIsLoading(false)
    }
  }

  const generateLocalQuestion = (level: number): BattleQuestion => {
    const questionsByLevel = {
      1: [
        {
          question: "What is 5 + 3?",
          options: ["8", "7", "9", "6"],
          correct: "8",
          explanation: "5 + 3 = 8",
        },
      ],
      5: [
        {
          question: "What is 12 × 8?",
          options: ["96", "94", "98", "100"],
          correct: "96",
          explanation: "12 × 8 = 96",
        },
      ],
      10: [
        {
          question: "What is the square root of 144?",
          options: ["12", "11", "13", "14"],
          correct: "12",
          explanation: "√144 = 12 because 12² = 144",
        },
      ],
      15: [
        {
          question: "What is the derivative of x³?",
          options: ["3x²", "x²", "3x", "x³"],
          correct: "3x²",
          explanation: "Using the power rule: d/dx(x³) = 3x²",
        },
      ],
    }

    const levelKey = level <= 3 ? 1 : level <= 8 ? 5 : level <= 12 ? 10 : 15
    const questions = questionsByLevel[levelKey as keyof typeof questionsByLevel]
    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)]

    return {
      id: `local-${Date.now()}`,
      ...selectedQuestion,
      timeLimit: Math.max(10, 20 - Math.floor(level / 3)),
      difficulty: level,
    }
  }

  const findMatch = () => {
    setGamePhase("matchmaking")

    // Simulate matchmaking
    setTimeout(() => {
      const randomOpponent = mockOpponents[Math.floor(Math.random() * mockOpponents.length)]
      setOpponent(randomOpponent)
      setGamePhase("battle")
      startBattle()
    }, 3000)
  }

  const startBattle = async () => {
    setQuestionIndex(0)
    setQuestionsAnswered(0)
    setCurrentRound(1)
    setBattleLevel(1)

    const newQuestion = await generateAIQuestion(battleLevel)
    setCurrentQuestion(newQuestion)
    setTimeLeft(newQuestion.timeLimit)
    setPlayerAnswer(null)
    setOpponentAnswer(null)
    setShowResults(false)
  }

  const handleAnswer = async (answerIndex: number) => {
    if (playerAnswer !== null || !currentQuestion) return

    const selectedAnswer = currentQuestion.options[answerIndex]
    setPlayerAnswer(selectedAnswer)

    // Simulate opponent answer with AI-like behavior
    setTimeout(
      async () => {
        const opponentAccuracy = Math.max(0.3, 0.9 - battleLevel * 0.05) // Gets harder as level increases
        const isOpponentCorrect = Math.random() < opponentAccuracy
        const opponentAnswerIndex = isOpponentCorrect
          ? currentQuestion.options.indexOf(currentQuestion.correct)
          : Math.floor(Math.random() * 4)

        setOpponentAnswer(currentQuestion.options[opponentAnswerIndex])
        setShowResults(true)

        // Update scores
        if (selectedAnswer === currentQuestion.correct) {
          currentPlayer.score += 100 + battleLevel * 10
        }
        if (currentQuestion.options[opponentAnswerIndex] === currentQuestion.correct) {
          opponent!.score += 100 + battleLevel * 10
        }

        // Continue endless battle
        setTimeout(async () => {
          setQuestionsAnswered((prev) => prev + 1)

          // Level up every 5 questions
          if ((questionsAnswered + 1) % 5 === 0) {
            setBattleLevel((prev) => prev + 1)
            setCurrentRound((prev) => prev + 1)
          }

          const nextQuestion = await generateAIQuestion(battleLevel + Math.floor((questionsAnswered + 1) / 5))

          setCurrentQuestion(nextQuestion)
          setTimeLeft(nextQuestion.timeLimit)
          setPlayerAnswer(null)
          setOpponentAnswer(null)
          setShowResults(false)
          setQuestionIndex((prev) => prev + 1)
        }, 3000)
      },
      Math.random() * 3000 + 1000,
    )
  }

  const endBattle = () => {
    const winner =
      currentPlayer.score > opponent!.score ? "player" : currentPlayer.score < opponent!.score ? "opponent" : "tie"

    setBattleResults({
      winner,
      playerScore: currentPlayer.score,
      opponentScore: opponent!.score,
    })
    setGamePhase("results")
  }

  // Timer countdown
  useEffect(() => {
    if (gamePhase === "battle" && timeLeft > 0 && playerAnswer === null && !isLoading) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && playerAnswer === null && !isLoading) {
      handleAnswer(-1) // Time's up, wrong answer
    }
  }, [timeLeft, gamePhase, playerAnswer, isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Zap className="h-3 w-3 mr-1" />
            Endless PvP Arena
          </Badge>
        </div>

        {gamePhase === "lobby" && (
          <div className="text-center space-y-6">
            <Card className="p-8">
              <div className="text-6xl mb-4">⚔️</div>
              <CardTitle className="text-3xl mb-2">Endless Battle Arena</CardTitle>
              <CardDescription className="text-lg mb-6">
                Challenge AI opponents in endless quiz battles with progressive difficulty!
              </CardDescription>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold">Fast-Paced</h3>
                  <p className="text-sm text-gray-600">Adaptive time limits</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-bold">Endless Battles</h3>
                  <p className="text-sm text-gray-600">Never-ending challenges</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold">AI Powered</h3>
                  <p className="text-sm text-gray-600">Smart question generation</p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-bold">Progressive</h3>
                  <p className="text-sm text-gray-600">Increasing difficulty</p>
                </div>
              </div>

              <Button onClick={findMatch} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Sword className="h-5 w-5 mr-2" />
                Start Endless Battle
              </Button>
            </Card>
          </div>
        )}

        {gamePhase === "matchmaking" && (
          <div className="text-center space-y-6">
            <Card className="p-8">
              <div className="text-6xl mb-4">🔍</div>
              <CardTitle className="text-2xl mb-4">Finding Opponent...</CardTitle>
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-gray-600">Matching you with an AI opponent of similar level...</p>
            </Card>
          </div>
        )}

        {gamePhase === "battle" && (
          <div className="space-y-6">
            {/* Battle Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      Round {currentRound} • Level {battleLevel}
                    </div>
                    <div className="text-sm text-gray-600">Question {questionsAnswered + 1}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-500">{timeLeft}s</span>
                  </div>
                </div>
                <Progress value={(timeLeft / (currentQuestion?.timeLimit || 15)) * 100} className="h-2" />
              </CardContent>
            </Card>

            {/* Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Player */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={currentPlayer.avatar || "/placeholder.svg"} alt={currentPlayer.name} />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{currentPlayer.name}</h3>
                      <p className="text-sm text-gray-600">Level {currentPlayer.level}</p>
                    </div>
                    <Shield className="h-6 w-6 text-blue-500 ml-auto" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentPlayer.score}</div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                </CardContent>
              </Card>

              {/* Opponent */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={opponent?.avatar || "/placeholder.svg"} alt={opponent?.name} />
                      <AvatarFallback>{opponent?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{opponent?.name}</h3>
                      <p className="text-sm text-gray-600">Level {opponent?.level}</p>
                    </div>
                    <Sword className="h-6 w-6 text-red-500 ml-auto" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{opponent?.score}</div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question */}
            {isLoading || !currentQuestion ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-lg font-semibold">Generating next challenge...</p>
                  <p className="text-sm text-gray-600 mt-2">AI is creating Level {battleLevel} question</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                    <Badge variant="outline">Difficulty: {currentQuestion.difficulty}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          showResults
                            ? option === currentQuestion.correct
                              ? "default"
                              : option === playerAnswer
                                ? "destructive"
                                : "outline"
                            : playerAnswer === option
                              ? "secondary"
                              : "outline"
                        }
                        onClick={() => handleAnswer(index)}
                        disabled={playerAnswer !== null}
                        className="p-4 h-auto text-left justify-start"
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>

                  {showResults && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`p-4 rounded-lg ${playerAnswer === currentQuestion.correct ? "bg-green-100" : "bg-red-100"}`}
                      >
                        <p className="font-medium">
                          You: {playerAnswer === currentQuestion.correct ? "✅ Correct!" : "❌ Incorrect"}
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${opponentAnswer === currentQuestion.correct ? "bg-green-100" : "bg-red-100"}`}
                      >
                        <p className="font-medium">
                          {opponent?.name}:{" "}
                          {opponentAnswer === currentQuestion.correct ? "✅ Correct!" : "❌ Incorrect"}
                        </p>
                      </div>
                      <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Explanation:</strong> {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {gamePhase === "results" && battleResults && (
          <div className="text-center space-y-6">
            <Card className="p-8">
              <div className="text-6xl mb-4">
                {battleResults.winner === "player" ? "🏆" : battleResults.winner === "opponent" ? "😔" : "🤝"}
              </div>
              <CardTitle className="text-3xl mb-2">
                {battleResults.winner === "player"
                  ? "Victory!"
                  : battleResults.winner === "opponent"
                    ? "Defeat!"
                    : "It's a Tie!"}
              </CardTitle>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-100 p-6 rounded-lg">
                  <h3 className="font-bold text-lg">Your Score</h3>
                  <div className="text-3xl font-bold text-blue-600">{battleResults.playerScore}</div>
                </div>
                <div className="bg-purple-100 p-6 rounded-lg">
                  <h3 className="font-bold text-lg">Level Reached</h3>
                  <div className="text-3xl font-bold text-purple-600">{battleLevel}</div>
                </div>
                <div className="bg-red-100 p-6 rounded-lg">
                  <h3 className="font-bold text-lg">{opponent?.name}'s Score</h3>
                  <div className="text-3xl font-bold text-red-600">{battleResults.opponentScore}</div>
                </div>
              </div>

              {battleResults.winner === "player" && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Rewards Earned!</h3>
                  <div className="flex justify-center gap-4">
                    <Badge variant="secondary">+{50 + battleLevel * 10} Coins</Badge>
                    <Badge variant="secondary">+{25 + battleLevel * 5} XP</Badge>
                    <Badge variant="secondary">Battle Champion Badge</Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setGamePhase("lobby")
                    currentPlayer.score = 0
                    if (opponent) opponent.score = 0
                    setQuestionsAnswered(0)
                    setBattleLevel(1)
                    setCurrentRound(1)
                  }}
                >
                  Battle Again
                </Button>
                <Button onClick={onBack} variant="outline">
                  Return to Dashboard
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
