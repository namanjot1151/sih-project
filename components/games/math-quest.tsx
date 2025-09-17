"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Star, ArrowLeft, Zap, Loader2 } from "lucide-react"

interface Question {
  question: string
  answer: number
  options?: number[]
  difficulty: number
  explanation?: string
}

export function MathQuest({ onBack }: { onBack: () => void }) {
  const { user, updateUserProgress } = useAuth()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameStarted, setGameStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  const generateAIQuestions = async (level: number, grade: number, count = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "mathematics",
          difficulty: Math.min(level, 20),
          grade: grade || 6,
          gameType: "math-quest",
          count,
          previousQuestions: questions.map((q) => q.question),
        }),
      })

      if (!response.ok) throw new Error("Failed to generate questions")

      const data = await response.json()
      return data.questions || []
    } catch (error) {
      console.error("Error generating AI questions:", error)
      return generateLocalQuestions(level, grade, count)
    } finally {
      setIsLoading(false)
    }
  }

  const generateLocalQuestions = (level: number, grade: number, count = 1) => {
    const questions: Question[] = []

    for (let i = 0; i < count; i++) {
      const difficulty = Math.min(level, 20)
      let question: Question

      if (difficulty <= 3) {
        // Basic arithmetic
        const a = Math.floor(Math.random() * (10 * difficulty)) + 1
        const b = Math.floor(Math.random() * (10 * difficulty)) + 1
        const operation = Math.random() > 0.5 ? "+" : "-"

        if (operation === "+") {
          question = {
            question: `${a} + ${b} = ?`,
            answer: a + b,
            difficulty,
            explanation: `Add ${a} and ${b} together`,
          }
        } else {
          const larger = Math.max(a, b)
          const smaller = Math.min(a, b)
          question = {
            question: `${larger} - ${smaller} = ?`,
            answer: larger - smaller,
            difficulty,
            explanation: `Subtract ${smaller} from ${larger}`,
          }
        }
      } else if (difficulty <= 8) {
        // Multiplication and division
        const a = Math.floor(Math.random() * 12) + 1
        const b = Math.floor(Math.random() * 12) + 1
        const operation = Math.random() > 0.5 ? "*" : "/"

        if (operation === "*") {
          question = {
            question: `${a} × ${b} = ?`,
            answer: a * b,
            difficulty,
            explanation: `Multiply ${a} by ${b}`,
          }
        } else {
          const product = a * b
          question = {
            question: `${product} ÷ ${a} = ?`,
            answer: b,
            difficulty,
            explanation: `Divide ${product} by ${a}`,
          }
        }
      } else if (difficulty <= 15) {
        // Advanced algebra and geometry
        const operations = [
          () => {
            const a = Math.floor(Math.random() * 20) + 1
            const b = Math.floor(Math.random() * 20) + 1
            const c = Math.floor(Math.random() * 10) + 1
            return {
              question: `${a} + ${b} × ${c} = ?`,
              answer: a + b * c,
              difficulty,
              explanation: `Follow order of operations: multiply first, then add`,
            }
          },
          () => {
            const base = Math.floor(Math.random() * 10) + 2
            return {
              question: `${base}² = ?`,
              answer: base * base,
              difficulty,
              explanation: `Square ${base} (multiply by itself)`,
            }
          },
          () => {
            const x = Math.floor(Math.random() * 10) + 1
            const constant = Math.floor(Math.random() * 20) + 1
            return {
              question: `If 2x + 5 = ${2 * x + 5}, what is x?`,
              answer: x,
              difficulty,
              explanation: `Solve for x by isolating the variable`,
            }
          },
        ]

        question = operations[Math.floor(Math.random() * operations.length)]()
      } else {
        // Expert level calculus and advanced math
        const operations = [
          () => {
            const a = Math.floor(Math.random() * 5) + 1
            const b = Math.floor(Math.random() * 5) + 1
            return {
              question: `What is the derivative of ${a}x² + ${b}x?`,
              answer: 2 * a,
              difficulty,
              explanation: `Use power rule: d/dx(ax²) = 2ax, d/dx(bx) = b`,
            }
          },
          () => {
            const sides = [3, 4, 5, 6, 8, 10, 12, 15]
            const side = sides[Math.floor(Math.random() * sides.length)]
            return {
              question: `Area of a square with side ${side}?`,
              answer: side * side,
              difficulty,
              explanation: `Area = side × side = ${side}²`,
            }
          },
        ]

        question = operations[Math.floor(Math.random() * operations.length)]()
      }

      questions.push(question)
    }

    return questions
  }

  // Timer effect
  useEffect(() => {
    if (gameStarted && !showResult && timeLeft > 0 && !isLoading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult && !isLoading) {
      handleAnswer(false)
    }
  }, [timeLeft, gameStarted, showResult, isLoading])

  const startGame = async () => {
    setGameStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setLives(3)
    setTimeLeft(Math.max(15, 35 - currentLevel * 2))
    setQuestionsAnswered(0)

    const newQuestions = await generateAIQuestions(currentLevel, user?.grade || 6, 1)
    setQuestions(newQuestions)
  }

  const handleAnswer = async (correct?: boolean) => {
    const currentQ = questions[currentQuestion]
    const isAnswerCorrect = correct !== undefined ? correct : Number.parseInt(userAnswer) === currentQ?.answer

    setIsCorrect(isAnswerCorrect)
    setShowResult(true)

    if (isAnswerCorrect) {
      const points = Math.max(10, currentQ.difficulty * 15 + currentLevel * 5)
      setScore(score + points)
      updateUserProgress(points)
    } else {
      setLives(lives - 1)
    }

    setTimeout(async () => {
      setShowResult(false)
      setUserAnswer("")
      setQuestionsAnswered(questionsAnswered + 1)

      if (lives <= 1 && !isAnswerCorrect) {
        return
      }

      if (questionsAnswered > 0 && questionsAnswered % 5 === 0) {
        setCurrentLevel(currentLevel + 1)
        setLives(3) // Restore lives on level up
      }

      const nextQuestions = await generateAIQuestions(
        currentLevel + Math.floor(questionsAnswered / 5),
        user?.grade || 6,
        1,
      )

      if (nextQuestions.length > 0) {
        setQuestions([...questions, ...nextQuestions])
        setCurrentQuestion(currentQuestion + 1)
      }

      setTimeLeft(Math.max(10, 35 - Math.floor(questionsAnswered / 5) * 2))
    }, 2000)
  }

  const resetGame = () => {
    setGameStarted(false)
    setCurrentLevel(1)
    setQuestions([])
    setCurrentQuestion(0)
    setQuestionsAnswered(0)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl">Math Quest</CardTitle>
              <CardDescription className="text-lg">
                Endless AI-powered math challenges that adapt to your skill level!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">∞</div>
                  <div className="text-sm text-gray-600">Endless Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">🤖</div>
                  <div className="text-sm text-gray-600">AI Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">📈</div>
                  <div className="text-sm text-gray-600">Adaptive Difficulty</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">How to Play:</h3>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Solve AI-generated math problems</li>
                  <li>• Level up every 5 correct answers</li>
                  <li>• Difficulty increases with each level</li>
                  <li>• Earn XP for every correct answer</li>
                  <li>• Game never ends - keep improving!</li>
                </ul>
              </div>

              <Button onClick={startGame} size="lg" className="w-full">
                Start Endless Adventure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (lives <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Lives Depleted!</CardTitle>
            <CardDescription>
              You reached Level {currentLevel} and answered {questionsAnswered} questions!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">{currentLevel}</div>
                <div className="text-sm text-gray-600">Level Reached</div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={resetGame} className="w-full">
                Start New Game
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full bg-transparent">
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  if (isLoading || !currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-semibold">Generating your next challenge...</p>
            <p className="text-sm text-gray-600 mt-2">AI is creating a perfect question for Level {currentLevel}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Level {currentLevel}</Badge>
            <Badge variant="outline">Question {questionsAnswered + 1}</Badge>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`h-5 w-5 ${i < lives ? "text-red-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Progress to Level {currentLevel + 1}: {questionsAnswered % 5}/5
            </span>
            <span>Score: {score}</span>
          </div>
          <Progress value={(questionsAnswered % 5) * 20} className="mb-2" />
          <div className="text-center">
            <Badge variant={timeLeft > 10 ? "secondary" : "destructive"}>{timeLeft}s remaining</Badge>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-6">{currentQ?.question}</div>

            {!showResult ? (
              <div className="space-y-4">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="text-center text-2xl h-16"
                  onKeyPress={(e) => e.key === "Enter" && handleAnswer()}
                />
                <Button onClick={() => handleAnswer()} size="lg" disabled={!userAnswer} className="w-full">
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className={`text-2xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-8 w-8 fill-current" />
                      Correct! +{Math.max(10, currentQ.difficulty * 15 + currentLevel * 5)} points
                    </div>
                    {currentQ.explanation && <div className="text-sm text-gray-600 mt-2">{currentQ.explanation}</div>}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>Wrong! The answer was {currentQ.answer}</div>
                    {currentQ.explanation && <div className="text-sm text-gray-600 mt-2">{currentQ.explanation}</div>}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Difficulty Indicator */}
        <div className="text-center">
          <Badge variant="outline">Difficulty: {currentQ?.difficulty}/20</Badge>
        </div>
      </div>
    </div>
  )
}
