"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Target,
  Zap,
  Heart,
  Star,
  Beaker,
  Hammer,
  TreePine,
  Clock,
  BookOpen,
  Sword,
  Map,
  Gamepad2,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Games2DProps {
  gameType: string
  onBack: () => void
}

interface Question {
  question: string
  options: string[]
  correct: string
  explanation: string
}

export function Games2D({ gameType, onBack }: Games2DProps) {
  const { updateUserProgress } = useAuth()
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [gameSpeed, setGameSpeed] = useState(1)
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false)
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([])
  const [streak, setStreak] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null)

  const gameConfigs = {
    "physics-forge": {
      title: "Physics Forge",
      description: "Apply physics principles to forge tools and weapons!",
      color: "from-orange-600 to-red-700",
      icon: Hammer,
      subject: "Physics",
      gradeLevel: "9-12",
      concept: "Forces, torque, momentum, and energy in blacksmithing simulation",
    },
    "elemental-alchemist": {
      title: "Elemental Alchemist",
      description: "Combine elements and balance chemical equations!",
      color: "from-purple-600 to-indigo-700",
      icon: Beaker,
      subject: "Chemistry",
      gradeLevel: "9-12",
      concept: "Periodic table, compounds, and chemical reactions",
    },
    "ecosystem-architect": {
      title: "Ecosystem Architect",
      description: "Build and manage biomes while learning ecology!",
      color: "from-green-600 to-emerald-700",
      icon: TreePine,
      subject: "Biology",
      gradeLevel: "6-12",
      concept: "Food chains, evolution, and climate change impacts",
    },
    "timeline-tactician": {
      title: "Timeline Tactician",
      description: "Rewind history and learn cause-and-effect!",
      color: "from-amber-600 to-yellow-700",
      icon: Clock,
      subject: "History",
      gradeLevel: "6-12",
      concept: "Historical events, primary sources, and branching narratives",
    },
    "word-weaver-worlds": {
      title: "Word Weaver Worlds",
      description: "Build platforms with sentences and grammar!",
      color: "from-blue-600 to-cyan-700",
      icon: BookOpen,
      subject: "English",
      gradeLevel: "3-12",
      concept: "Grammar, synonyms, literary genres, and essay structure",
    },
    "quiz-runner": {
      title: "Quiz Runner",
      description: "Run and jump over question obstacles!",
      color: "from-cyan-500 to-blue-600",
      icon: Target,
      subject: "Mathematics",
      gradeLevel: "1-8",
      concept: "Basic arithmetic and mental math skills",
    },
    "puzzle-tower": {
      title: "Puzzle Tower",
      description: "Climb the tower by solving puzzles!",
      color: "from-purple-500 to-indigo-600",
      icon: Trophy,
      subject: "Logic",
      gradeLevel: "3-12",
      concept: "Problem solving and logical reasoning",
    },
    "word-ninja": {
      title: "Word Ninja",
      description: "Slice the correct words with ninja precision!",
      color: "from-red-500 to-pink-600",
      icon: Sword,
      subject: "English",
      gradeLevel: "2-8",
      concept: "Vocabulary, spelling, and word recognition",
    },
    "math-invaders": {
      title: "Math Invaders",
      description: "Defend Earth by solving math problems!",
      color: "from-green-500 to-emerald-600",
      icon: Target,
      subject: "Mathematics",
      gradeLevel: "3-10",
      concept: "Mental math and quick problem solving",
    },
    "knowledge-platformer": {
      title: "Knowledge Platformer",
      description: "Jump through platforms and answer questions!",
      color: "from-orange-500 to-red-600",
      icon: Gamepad2,
      subject: "Science",
      gradeLevel: "4-12",
      concept: "Mixed science topics and concepts",
    },
    "memory-match": {
      title: "Memory Match Quest",
      description: "Match question-answer pairs to progress!",
      color: "from-teal-500 to-cyan-600",
      icon: Heart,
      subject: "History",
      gradeLevel: "2-10",
      concept: "Historical facts and memorization",
    },
    "quiz-battle-arena": {
      title: "Quiz Battle Arena",
      description: "Fight opponents with your knowledge!",
      color: "from-violet-500 to-purple-600",
      icon: Sword,
      subject: "General Knowledge",
      gradeLevel: "5-12",
      concept: "Competitive learning across subjects",
    },
    "treasure-hunt": {
      title: "Treasure Hunt 2D",
      description: "Navigate mazes and unlock treasure chests!",
      color: "from-amber-500 to-orange-600",
      icon: Map,
      subject: "Geography",
      gradeLevel: "3-10",
      concept: "World geography and cultural awareness",
    },
  }

  const config = gameConfigs[gameType as keyof typeof gameConfigs]

  const generateAIQuestion = useCallback(async () => {
    setIsLoadingQuestion(true)
    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: config.subject,
          difficulty: level,
          gameType: gameType,
          previousQuestions: previousQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate question")
      }

      const questionData = await response.json()

      // Add to previous questions to avoid repeats
      setPreviousQuestions((prev) => [...prev.slice(-10), questionData.question])

      setCurrentQuestion(questionData)
    } catch (error) {
      console.error("AI Question Generation Error:", error)
      // Fallback to local question generation
      setCurrentQuestion(generateLocalQuestion())
    } finally {
      setIsLoadingQuestion(false)
    }
  }, [level, gameType, config.subject, previousQuestions])

  const generateLocalQuestion = useCallback((): Question => {
    const questionTypes = [
      {
        type: "math",
        generate: () => {
          const a = Math.floor(Math.random() * (10 * level)) + 1
          const b = Math.floor(Math.random() * (10 * level)) + 1
          const operations = ["+", "-", "*"]
          const op = operations[Math.floor(Math.random() * operations.length)]
          let answer: number
          let question: string

          switch (op) {
            case "+":
              answer = a + b
              question = `${a} + ${b}`
              break
            case "-":
              answer = Math.abs(a - b)
              question = `${Math.max(a, b)} - ${Math.min(a, b)}`
              break
            case "*":
              answer = a * b
              question = `${a} × ${b}`
              break
            default:
              answer = a + b
              question = `${a} + ${b}`
          }

          const wrongOptions = [
            (answer + Math.floor(Math.random() * 10) + 1).toString(),
            (answer - Math.floor(Math.random() * 10) - 1).toString(),
            (answer + Math.floor(Math.random() * 20) + 5).toString(),
          ]

          return {
            question: `What is ${question}?`,
            options: [answer.toString(), ...wrongOptions].sort(() => Math.random() - 0.5),
            correct: answer.toString(),
            explanation: `${question} = ${answer}`,
          }
        },
      },
      {
        type: "english",
        generate: () => {
          const words = [
            { word: "beautiful", meaning: "attractive or pleasing" },
            { word: "knowledge", meaning: "information and understanding" },
            { word: "adventure", meaning: "exciting or unusual experience" },
            { word: "creative", meaning: "having original ideas" },
            { word: "friendship", meaning: "close relationship between friends" },
            { word: "courage", meaning: "bravery in facing danger" },
            { word: "wisdom", meaning: "deep understanding and knowledge" },
            { word: "harmony", meaning: "peaceful agreement" },
          ]

          const selected = words[Math.floor(Math.random() * words.length)]
          const wrongOptions = words
            .filter((w) => w.word !== selected.word)
            .slice(0, 3)
            .map((w) => w.meaning)

          return {
            question: `What does "${selected.word}" mean?`,
            options: [selected.meaning, ...wrongOptions].sort(() => Math.random() - 0.5),
            correct: selected.meaning,
            explanation: `"${selected.word}" means ${selected.meaning}.`,
          }
        },
      },
    ]

    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    return questionType.generate()
  }, [level])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setLevel(1)
    setLives(3)
    setTimeLeft(60)
    setGameSpeed(1)
    setStreak(0)
    setPreviousQuestions([])
    setShowExplanation(false)
    setLastAnswer(null)
    generateAIQuestion()
  }

  const pauseGame = () => {
    setGameState(gameState === "paused" ? "playing" : "paused")
  }

  const resetGame = () => {
    setGameState("menu")
    setScore(0)
    setLevel(1)
    setLives(3)
    setTimeLeft(60)
    setGameSpeed(1)
    setStreak(0)
    setPreviousQuestions([])
    setShowExplanation(false)
    setLastAnswer(null)
  }

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return

    const isCorrect = answer === currentQuestion.correct

    setLastAnswer({
      correct: isCorrect,
      explanation: currentQuestion.explanation,
    })

    setShowExplanation(true)

    if (isCorrect) {
      const points = 10 * level * gameSpeed
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)

      // Level up every 5 correct answers
      if ((score + points) % 50 === 0) {
        setLevel((prev) => prev + 1)
        setGameSpeed((prev) => Math.min(prev + 0.2, 3))
        setTimeLeft((prev) => prev + 10) // Bonus time
      }

      // Update user progress
      updateUserProgress(Math.floor(points / 10), `${gameType}-${level}`, config.subject)
    } else {
      setStreak(0)
      setLives((prev) => {
        const newLives = prev - 1
        if (newLives <= 0) {
          setGameState("gameOver")
        }
        return newLives
      })
    }

    // Auto-hide explanation and load next question after 2 seconds
    setTimeout(() => {
      setShowExplanation(false)
      setLastAnswer(null)
      if (gameState !== "gameOver") {
        generateAIQuestion()
      }
    }, 2000)
  }

  // Game timer
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("gameOver")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState, timeLeft, showExplanation])

  // Generate first question when starting
  useEffect(() => {
    if (gameState === "playing" && !currentQuestion && !isLoadingQuestion) {
      generateAIQuestion()
    }
  }, [gameState, currentQuestion, isLoadingQuestion, generateAIQuestion])

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className={`h-64 bg-gradient-to-r ${config.color} flex items-center justify-center relative`}>
              <config.icon className="h-24 w-24 text-white/80" />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{config.title}</h1>
                <p className="text-xl opacity-90">{config.description}</p>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">How to Play</h3>
                  <div className="space-y-3 text-gray-600">
                    {gameType === "physics-forge" && (
                      <>
                        <p>• Apply real physics principles to forge items</p>
                        <p>• Calculate forces, torque, and energy correctly</p>
                        <p>• Wrong calculations break your tools</p>
                        <p>• Master blacksmithing through science!</p>
                      </>
                    )}
                    {gameType === "elemental-alchemist" && (
                      <>
                        <p>• Match elements to form chemical compounds</p>
                        <p>• Balance chemical equations to unlock reactions</p>
                        <p>• Learn periodic table trends from historical alchemists</p>
                        <p>• Create complex molecules through chemistry!</p>
                      </>
                    )}
                    {gameType === "ecosystem-architect" && (
                      <>
                        <p>• Build and manage different biomes</p>
                        <p>• Introduce species and observe food chains</p>
                        <p>• Use AI to simulate climate change impacts</p>
                        <p>• Learn ecology through ecosystem management!</p>
                      </>
                    )}
                    {gameType === "timeline-tactician" && (
                      <>
                        <p>• Rewind timelines to alter historical events</p>
                        <p>• Learn cause-and-effect through branching stories</p>
                        <p>• Collect primary sources as historical evidence</p>
                        <p>• Debate decisions with other players!</p>
                      </>
                    )}
                    {gameType === "word-weaver-worlds" && (
                      <>
                        <p>• Build platforms using correct grammar</p>
                        <p>• Jump requires proper sentence structure</p>
                        <p>• Levels based on different literary genres</p>
                        <p>• Boss fights involve essay writing skills!</p>
                      </>
                    )}
                    {gameType === "quiz-runner" && (
                      <>
                        <p>• Your character runs automatically</p>
                        <p>• Answer questions correctly to jump over obstacles</p>
                        <p>• Wrong answers make you stumble and lose speed</p>
                        <p>• Survive as long as possible to get high scores!</p>
                      </>
                    )}
                    {gameType === "puzzle-tower" && (
                      <>
                        <p>• Climb the tower floor by floor</p>
                        <p>• Each floor has a puzzle to solve</p>
                        <p>• Difficulty increases with each level</p>
                        <p>• Reach the top to face the Boss Quiz!</p>
                      </>
                    )}
                    {gameType === "word-ninja" && (
                      <>
                        <p>• Words fly across the screen</p>
                        <p>• Slice the correct answers with your finger</p>
                        <p>• Avoid slicing wrong answers</p>
                        <p>• Perfect for vocabulary and spelling!</p>
                      </>
                    )}
                    {gameType === "math-invaders" && (
                      <>
                        <p>• Enemies descend with math problems</p>
                        <p>• Shoot the correct answer to destroy them</p>
                        <p>• Don't let them reach the bottom!</p>
                        <p>• Speed increases with each wave</p>
                      </>
                    )}
                    {gameType === "knowledge-platformer" && (
                      <>
                        <p>• Jump through platforms Mario-style</p>
                        <p>• Answer questions to unlock gates</p>
                        <p>• Collect coins and power-ups</p>
                        <p>• Each level focuses on different subjects</p>
                      </>
                    )}
                    {gameType === "memory-match" && (
                      <>
                        <p>• Flip cards to find matching pairs</p>
                        <p>• Match questions with their answers</p>
                        <p>• Clear all pairs to unlock new maps</p>
                        <p>• Great for memorizing facts and definitions</p>
                      </>
                    )}
                    {gameType === "quiz-battle-arena" && (
                      <>
                        <p>• Face opponents in 2D combat</p>
                        <p>• Answer questions to power your attacks</p>
                        <p>• Wrong answers weaken your character</p>
                        <p>• Defeat all opponents to win the arena!</p>
                      </>
                    )}
                    {gameType === "treasure-hunt" && (
                      <>
                        <p>• Navigate through maze-like levels</p>
                        <p>• Solve quizzes to unlock treasure chests</p>
                        <p>• Find keys to open locked doors</p>
                        <p>• Faster solving = higher scores</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Educational Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Subject</span>
                      <Badge variant="secondary">{config.subject}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Grade Level</span>
                      <Badge variant="outline">{config.gradeLevel}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Difficulty</span>
                      <Badge variant="default">AI Adaptive</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Questions</span>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">AI Generated</Badge>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Learning Focus</h4>
                    <p className="text-blue-800 text-sm">{config.concept}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button onClick={startGame} size="lg" className="px-8 py-3 text-lg">
                  <Play className="h-5 w-5 mr-2" />
                  Start Learning Adventure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Game HUD */}
      <div className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
          <div className="text-lg font-bold">{config.title}</div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-blue-400" />
            <span>Level {level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span>{lives}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-400" />
            <span>Streak: {streak}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Time:</span>
            <span className="font-bold text-orange-400">{timeLeft}s</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={pauseGame} className="text-white hover:bg-white/20">
            {gameState === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" onClick={resetGame} className="text-white hover:bg-white/20">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {gameState === "playing" && (
          <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              {isLoadingQuestion ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white">Generating AI question...</p>
                </div>
              ) : showExplanation && lastAnswer ? (
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-4 ${lastAnswer.correct ? "text-green-400" : "text-red-400"}`}>
                    {lastAnswer.correct ? "✅ Correct!" : "❌ Wrong!"}
                  </div>
                  <p className="text-white mb-4">{lastAnswer.explanation}</p>
                  <div className="animate-pulse text-white/60">Loading next question...</div>
                </div>
              ) : currentQuestion ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-white">{currentQuestion.question}</h2>
                    <Progress value={(timeLeft / 60) * 100} className="mb-4" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="p-4 text-lg bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                        disabled={showExplanation}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-white/80">Speed Multiplier: {gameSpeed.toFixed(1)}x</p>
                    <Badge variant="secondary" className="mt-2">
                      Subject: {config.subject}
                    </Badge>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        )}

        {gameState === "paused" && (
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Game Paused</h2>
              <Button onClick={pauseGame} className="mr-4">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
              <Button variant="outline" onClick={resetGame}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState === "gameOver" && (
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Game Over!</h2>
              <div className="space-y-2 mb-6 text-white">
                <p>
                  Final Score: <span className="font-bold text-yellow-400">{score}</span>
                </p>
                <p>
                  Level Reached: <span className="font-bold text-blue-400">{level}</span>
                </p>
                <p>
                  Best Streak: <span className="font-bold text-green-400">{streak}</span>
                </p>
                <p>
                  XP Earned: <span className="font-bold text-purple-400">{Math.floor(score / 10)}</span>
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={startGame}>
                  <Play className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
