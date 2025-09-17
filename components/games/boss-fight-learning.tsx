"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Sword, Shield, Heart, Zap, Trophy, Star } from "lucide-react"

interface Boss {
  id: string
  name: string
  subject: string
  level: number
  maxHealth: number
  currentHealth: number
  avatar: string
  attacks: string[]
  rewards: { xp: number; badge: string; power: string }
}

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface BossFightLearningProps {
  onBack: () => void
}

export function BossFightLearning({ onBack }: BossFightLearningProps) {
  const [currentBoss, setCurrentBoss] = useState<Boss>({
    id: "math-dragon",
    name: "Algebros the Math Dragon",
    subject: "Mathematics",
    level: 5,
    maxHealth: 100,
    currentHealth: 100,
    avatar: "🐉",
    attacks: ["Number Storm", "Equation Blast", "Division Strike"],
    rewards: { xp: 200, badge: "Dragon Slayer", power: "Math Mastery" },
  })

  const [playerHealth, setPlayerHealth] = useState(100)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [gamePhase, setGamePhase] = useState<"intro" | "battle" | "victory" | "defeat">("intro")
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [playerPower, setPlayerPower] = useState(100)

  const questions: Question[] = [
    {
      id: "1",
      question: "What is 15 + 27?",
      options: ["42", "41", "43", "40"],
      correct: 0,
      explanation: "15 + 27 = 42. Great job!",
    },
    {
      id: "2",
      question: "If you have 8 apples and eat 3, how many are left?",
      options: ["6", "5", "4", "7"],
      correct: 1,
      explanation: "8 - 3 = 5 apples remaining!",
    },
    {
      id: "3",
      question: "What is 6 × 7?",
      options: ["41", "42", "43", "44"],
      correct: 1,
      explanation: "6 × 7 = 42. Multiplication mastery!",
    },
    {
      id: "4",
      question: "What is 100 ÷ 4?",
      options: ["24", "25", "26", "27"],
      correct: 1,
      explanation: "100 ÷ 4 = 25. Perfect division!",
    },
  ]

  const startBattle = () => {
    setGamePhase("battle")
    setBattleLog([`${currentBoss.name} appears! The battle begins!`])
    generateQuestion()
  }

  const generateQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
    setCurrentQuestion(randomQuestion)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    setTimeout(() => {
      if (answerIndex === currentQuestion!.correct) {
        // Correct answer - damage boss
        const damage = Math.floor(Math.random() * 25) + 15
        const newBossHealth = Math.max(0, currentBoss.currentHealth - damage)
        setCurrentBoss((prev) => ({ ...prev, currentHealth: newBossHealth }))
        setBattleLog((prev) => [...prev, `🗡️ Critical hit! You dealt ${damage} damage to ${currentBoss.name}!`])

        if (newBossHealth <= 0) {
          setGamePhase("victory")
          setBattleLog((prev) => [...prev, `🎉 Victory! You defeated ${currentBoss.name}!`])
          return
        }
      } else {
        // Wrong answer - boss attacks
        const damage = Math.floor(Math.random() * 20) + 10
        const newPlayerHealth = Math.max(0, playerHealth - damage)
        setPlayerHealth(newPlayerHealth)
        const attack = currentBoss.attacks[Math.floor(Math.random() * currentBoss.attacks.length)]
        setBattleLog((prev) => [...prev, `💥 ${currentBoss.name} uses ${attack}! You take ${damage} damage!`])

        if (newPlayerHealth <= 0) {
          setGamePhase("defeat")
          setBattleLog((prev) => [...prev, `💀 Defeat! But don't give up - try again!`])
          return
        }
      }

      // Continue battle
      setTimeout(() => {
        generateQuestion()
      }, 2000)
    }, 1500)
  }

  const resetBattle = () => {
    setCurrentBoss((prev) => ({ ...prev, currentHealth: prev.maxHealth }))
    setPlayerHealth(100)
    setGamePhase("intro")
    setBattleLog([])
    setCurrentQuestion(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <Sword className="h-3 w-3 mr-1" />
            Boss Battle Arena
          </Badge>
        </div>

        {gamePhase === "intro" && (
          <div className="text-center space-y-6">
            <Card className="p-8">
              <div className="text-8xl mb-4">{currentBoss.avatar}</div>
              <CardTitle className="text-3xl mb-2">{currentBoss.name}</CardTitle>
              <CardDescription className="text-lg mb-6">
                Level {currentBoss.level} {currentBoss.subject} Boss
              </CardDescription>
              <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  "Foolish student! You dare challenge my mathematical might? Answer my questions correctly to defeat
                  me, but beware - wrong answers will face my wrath!"
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Trophy className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">+{currentBoss.rewards.xp} XP</div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium">{currentBoss.rewards.badge}</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">{currentBoss.rewards.power}</div>
                </div>
              </div>
              <Button onClick={startBattle} size="lg" className="bg-red-600 hover:bg-red-700">
                <Sword className="h-5 w-5 mr-2" />
                Challenge Boss!
              </Button>
            </Card>
          </div>
        )}

        {gamePhase === "battle" && (
          <div className="space-y-6">
            {/* Battle Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Boss Status */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{currentBoss.avatar}</div>
                    <CardTitle className="text-lg">{currentBoss.name}</CardTitle>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Boss Health
                      </span>
                      <span>
                        {currentBoss.currentHealth}/{currentBoss.maxHealth}
                      </span>
                    </div>
                    <Progress value={(currentBoss.currentHealth / currentBoss.maxHealth) * 100} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Player Status */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🛡️</div>
                    <CardTitle className="text-lg">Your Health</CardTitle>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        Player Health
                      </span>
                      <span>{playerHealth}/100</span>
                    </div>
                    <Progress value={playerHealth} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <Card>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-4">{currentQuestion.question}</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          showResult
                            ? index === currentQuestion.correct
                              ? "default"
                              : index === selectedAnswer
                                ? "destructive"
                                : "outline"
                            : selectedAnswer === index
                              ? "secondary"
                              : "outline"
                        }
                        onClick={() => !showResult && handleAnswer(index)}
                        disabled={showResult}
                        className="p-4 h-auto text-left justify-start"
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                  {showResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium mb-2">
                        {selectedAnswer === currentQuestion.correct ? "✅ Correct!" : "❌ Incorrect!"}
                      </p>
                      <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Battle Log */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4">Battle Log</CardTitle>
                <div className="bg-gray-50 rounded-lg p-4 h-32 overflow-y-auto">
                  {battleLog.map((log, index) => (
                    <div key={index} className="text-sm mb-1 text-gray-700">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gamePhase === "victory" && (
          <div className="text-center space-y-6">
            <Card className="p-8">
              <div className="text-8xl mb-4">🏆</div>
              <CardTitle className="text-3xl mb-2 text-green-600">Victory!</CardTitle>
              <CardDescription className="text-lg mb-6">You have defeated {currentBoss.name}!</CardDescription>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-4">Rewards Earned:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>+{currentBoss.rewards.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    <span>{currentBoss.rewards.badge} Badge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-gold-500" />
                    <span>{currentBoss.rewards.power} Power</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetBattle} variant="outline">
                  Fight Again
                </Button>
                <Button onClick={onBack}>Return to Dashboard</Button>
              </div>
            </Card>
          </div>
        )}

        {gamePhase === "defeat" && (
          <div className="text-center space-y-6">
            <Card className="p-8">
              <div className="text-8xl mb-4">💀</div>
              <CardTitle className="text-3xl mb-2 text-red-600">Defeat!</CardTitle>
              <CardDescription className="text-lg mb-6">
                {currentBoss.name} was too powerful this time...
              </CardDescription>
              <div className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  "Don't give up, young warrior! Study harder and return when you're ready. Every defeat is a lesson in
                  disguise!"
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetBattle}>Try Again</Button>
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
