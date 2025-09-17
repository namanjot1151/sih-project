"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Shield,
  Crown,
  Star,
  Zap,
  Heart,
  Trophy,
  Sparkles,
  Calculator,
  Target,
  Flame,
  ChevronRight,
  Volume2,
  VolumeX,
  Gift,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Character {
  id: string
  name: string
  avatar: string
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  equipment: {
    weapon: string
    armor: string
    accessory: string
  }
  stats: {
    strength: number
    intelligence: number
    wisdom: number
    agility: number
  }
}

interface StoryNode {
  id: string
  title: string
  description: string
  choices: {
    id: string
    text: string
    algebraProblem?: {
      equation: string
      solution: number
      hint: string
    }
    nextNode: string
    requirements?: {
      minLevel?: number
      equipment?: string[]
    }
  }[]
  rewards?: {
    xp: number
    equipment?: string
    gold?: number
  }
  culturalContext?: string
  backgroundMusic?: string
}

interface AlgebraOdysseyProps {
  onBack: () => void
}

export function AlgebraOdyssey({ onBack }: AlgebraOdysseyProps) {
  const { user, updateUserProgress } = useAuth()
  const [character, setCharacter] = useState<Character>({
    id: "player",
    name: user?.name || "Hero",
    avatar: user?.avatar || "/placeholder.svg",
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    equipment: {
      weapon: "Wooden Staff",
      armor: "Cloth Robes",
      accessory: "Learning Pendant",
    },
    stats: {
      strength: 10,
      intelligence: 15,
      wisdom: 12,
      agility: 8,
    },
  })

  const [currentStory, setCurrentStory] = useState<string>("village_start")
  const [gameState, setGameState] = useState({
    gold: 100,
    inventory: ["Health Potion", "Mana Crystal"],
    completedQuests: [] as string[],
    currentDifficulty: 1,
    totalProblemsCompleted: 0,
    streak: 0,
  })
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentProblem, setCurrentProblem] = useState<any>(null)
  const [isGeneratingProblem, setIsGeneratingProblem] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Story nodes with branching narratives
  const storyNodes: Record<string, StoryNode> = {
    village_start: {
      id: "village_start",
      title: "The Village of Algebraia",
      description: `Welcome to Algebraia, a mystical village where mathematical harmony keeps the realm in balance. You are ${character.name}, a young scholar chosen by the ancient Order of Equations to restore balance to the land. The village elder approaches you with urgent news.`,
      culturalContext: "Inspired by ancient Greek mathematical traditions and folklore",
      backgroundMusic: "peaceful_village",
      choices: [
        {
          id: "accept_quest",
          text: "Accept the elder's quest to save the realm",
          algebraProblem: {
            equation: "Solve for x: 2x + 5 = 13",
            solution: 4,
            hint: "Subtract 5 from both sides, then divide by 2",
          },
          nextNode: "forest_path",
        },
        {
          id: "explore_village",
          text: "Explore the village to learn more about its history",
          nextNode: "village_library",
        },
      ],
      rewards: {
        xp: 50,
        gold: 25,
      },
    },
    forest_path: {
      id: "forest_path",
      title: "The Enchanted Forest of Functions",
      description: `You venture into the mystical forest where each tree represents a different mathematical function. The path splits into three directions, each guarded by ancient riddles that test your algebraic knowledge. Choose wisely, as each path leads to different adventures and challenges.`,
      culturalContext: "Drawing from Celtic forest mythology and mathematical tree structures",
      backgroundMusic: "mystical_forest",
      choices: [
        {
          id: "linear_path",
          text: "Take the Linear Path (easier route)",
          algebraProblem: {
            equation: "Find the slope: y = 3x - 7",
            solution: 3,
            hint: "In y = mx + b form, m is the slope",
          },
          nextNode: "crystal_cave",
        },
        {
          id: "quadratic_path",
          text: "Take the Quadratic Path (moderate challenge)",
          algebraProblem: {
            equation: "Solve: x² - 5x + 6 = 0",
            solution: 2, // or 3, we'll accept either
            hint: "Factor or use the quadratic formula",
          },
          nextNode: "dragon_lair",
        },
        {
          id: "exponential_path",
          text: "Take the Exponential Path (hardest route)",
          algebraProblem: {
            equation: "Solve for x: 2^x = 16",
            solution: 4,
            hint: "What power of 2 equals 16?",
          },
          nextNode: "wizard_tower",
        },
      ],
      rewards: {
        xp: 75,
        equipment: "Forest Walker Boots",
      },
    },
    crystal_cave: {
      id: "crystal_cave",
      title: "The Crystal Cave of Constants",
      description: `You discover a magnificent cave filled with glowing crystals, each one humming with mathematical energy. The cave guardian, an ancient golem made of pure algebra, challenges you to prove your worth by solving increasingly complex equations to unlock the cave's treasures.`,
      culturalContext: "Inspired by dwarven mining traditions and crystalline mathematics",
      backgroundMusic: "crystal_cave",
      choices: [
        {
          id: "challenge_golem",
          text: "Challenge the Crystal Golem to an algebra duel",
          nextNode: "golem_battle",
        },
        {
          id: "study_crystals",
          text: "Study the mathematical properties of the crystals",
          algebraProblem: {
            equation: "If each crystal grows at rate 2n + 3, how many crystals after 5 cycles?",
            solution: 13,
            hint: "Substitute n = 5 into the equation",
          },
          nextNode: "crystal_mastery",
        },
      ],
      rewards: {
        xp: 100,
        equipment: "Crystal Staff of Clarity",
        gold: 150,
      },
    },
    village_library: {
      id: "village_library",
      title: "The Ancient Library of Algebraic Wisdom",
      description: `The village library contains centuries of mathematical knowledge passed down through generations. Ancient scrolls reveal the history of Algebraia and the prophecy of the Chosen Scholar. The librarian, a wise sage, offers to teach you advanced techniques.`,
      culturalContext: "Based on the Library of Alexandria and ancient scholarly traditions",
      backgroundMusic: "ancient_library",
      choices: [
        {
          id: "read_prophecy",
          text: "Read the ancient prophecy about the Chosen Scholar",
          algebraProblem: {
            equation: "The prophecy states: 'When 3x - 7 = 2x + 5, the scholar shall rise.' Find x.",
            solution: 12,
            hint: "Move all x terms to one side and constants to the other",
          },
          nextNode: "prophecy_revealed",
        },
        {
          id: "learn_techniques",
          text: "Learn advanced algebraic techniques from the sage",
          nextNode: "sage_training",
        },
      ],
      rewards: {
        xp: 60,
        equipment: "Tome of Ancient Knowledge",
      },
    },
  }

  const generateAIProblem = async (difficulty: number, context: string) => {
    setIsGeneratingProblem(true)
    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Algebra",
          difficulty: Math.min(difficulty + gameState.currentDifficulty, 10),
          context: `Generate an algebra problem for a fantasy RPG context: ${context}. Make it story-relevant and engaging.`,
          type: "equation_solving",
        }),
      })

      if (!response.ok) throw new Error("Failed to generate problem")

      const data = await response.json()

      // Parse the AI response to extract equation and solution
      const problemText = data.question || data.text || ""
      const equation = problemText.match(/([^:]+):/)?.[1]?.trim() || problemText

      return {
        equation: equation,
        solution: data.correct || data.answer || 0,
        hint: data.explanation || "Think step by step and apply algebraic principles",
        aiGenerated: true,
      }
    } catch (error) {
      console.error("Error generating AI problem:", error)
      // Fallback to predefined problems
      const fallbackProblems = [
        { equation: "2x + 8 = 20", solution: 6, hint: "Subtract 8, then divide by 2" },
        { equation: "3(x - 4) = 15", solution: 9, hint: "Distribute first, then solve" },
        { equation: "x² - 9 = 0", solution: 3, hint: "This is a difference of squares" },
      ]
      return fallbackProblems[Math.floor(Math.random() * fallbackProblems.length)]
    } finally {
      setIsGeneratingProblem(false)
    }
  }

  const handleChoice = async (choice: any) => {
    if (choice.algebraProblem) {
      // Generate AI problem if it's an AI-enhanced node
      if (gameState.totalProblemsCompleted > 3) {
        const aiProblem = await generateAIProblem(
          gameState.currentDifficulty,
          storyNodes[currentStory].culturalContext || "",
        )
        setCurrentProblem({ ...choice, algebraProblem: aiProblem })
      } else {
        setCurrentProblem(choice)
      }
      setShowResult(false)
      setUserAnswer("")
    } else {
      setCurrentStory(choice.nextNode)
    }
  }

  const handleSubmitAnswer = () => {
    if (!currentProblem?.algebraProblem) return

    const userNum = Number.parseFloat(userAnswer)
    const correctAnswer = currentProblem.algebraProblem.solution
    const isAnswerCorrect = Math.abs(userNum - correctAnswer) < 0.01

    setIsCorrect(isAnswerCorrect)
    setShowResult(true)

    if (isAnswerCorrect) {
      // Reward correct answer
      const xpGain = 25 + gameState.currentDifficulty * 10
      const goldGain = 10 + gameState.currentDifficulty * 5

      setGameState((prev) => ({
        ...prev,
        totalProblemsCompleted: prev.totalProblemsCompleted + 1,
        streak: prev.streak + 1,
        currentDifficulty: Math.min(prev.currentDifficulty + 0.1, 10),
        gold: prev.gold + goldGain,
      }))

      setCharacter((prev) => ({
        ...prev,
        level: Math.floor((gameState.totalProblemsCompleted + 1) / 5) + 1,
        mana: Math.min(prev.mana + 10, prev.maxMana),
      }))

      updateUserProgress(xpGain, "algebra")

      // Play success sound
      if (soundEnabled) {
        // Audio feedback would go here
      }

      setTimeout(() => {
        setCurrentStory(currentProblem.nextNode)
        setCurrentProblem(null)
        setShowResult(false)
      }, 2000)
    } else {
      setGameState((prev) => ({
        ...prev,
        streak: 0,
      }))

      setCharacter((prev) => ({
        ...prev,
        health: Math.max(prev.health - 10, 0),
      }))
    }
  }

  const currentNode = storyNodes[currentStory]

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Quest Complete!</h2>
            <p className="text-gray-600 mb-6">
              You have completed this chapter of your algebraic odyssey. More adventures await!
            </p>
            <Button onClick={onBack} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white hover:bg-white/10"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Character Status */}
          <Card className="mb-6 bg-black/20 border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-yellow-400">
                    <AvatarImage src={character.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{character.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{character.name}</h3>
                    <p className="text-sm text-gray-300">Level {character.level} Scholar</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-red-400">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {character.health}/{character.maxHealth}
                      </span>
                    </div>
                    <Progress value={(character.health / character.maxHealth) * 100} className="w-20 h-2 mt-1" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-blue-400">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {character.mana}/{character.maxMana}
                      </span>
                    </div>
                    <Progress value={(character.mana / character.maxMana) * 100} className="w-20 h-2 mt-1" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-medium">Streak: {gameState.streak}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Card */}
          <Card className="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 border-white/20 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Calculator className="h-8 w-8 text-yellow-400" />
                  <h2 className="text-2xl font-bold">Algebraic Challenge</h2>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                  Difficulty Level {Math.ceil(gameState.currentDifficulty)}
                </Badge>
              </div>

              <div className="bg-black/30 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">
                  {currentProblem.algebraProblem.equation}
                </h3>

                {isGeneratingProblem && (
                  <div className="text-center text-gray-300 mb-4">
                    <Sparkles className="h-5 w-5 animate-spin inline mr-2" />
                    AI is generating a personalized challenge...
                  </div>
                )}

                <div className="flex gap-4 items-center justify-center">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="max-w-xs bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    disabled={showResult}
                  />
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer || showResult}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>

                {currentProblem.algebraProblem.hint && (
                  <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-sm text-blue-200">
                      <span className="font-medium">Hint:</span> {currentProblem.algebraProblem.hint}
                    </p>
                  </div>
                )}
              </div>

              {showResult && (
                <div
                  className={`text-center p-6 rounded-lg ${
                    isCorrect ? "bg-green-500/20 border border-green-400/30" : "bg-red-500/20 border border-red-400/30"
                  }`}
                >
                  {isCorrect ? (
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="h-6 w-6 text-yellow-400" />
                        <h3 className="text-xl font-bold text-green-300">Excellent Work!</h3>
                      </div>
                      <p className="text-green-200 mb-4">
                        Your algebraic prowess has unlocked the path forward. The realm grows stronger with your
                        knowledge!
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          +{25 + gameState.currentDifficulty * 10} XP
                        </Badge>
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          +{10 + gameState.currentDifficulty * 5} Gold
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold text-red-300 mb-2">Not Quite Right</h3>
                      <p className="text-red-200 mb-4">
                        The correct answer was {currentProblem.algebraProblem.solution}. Study the solution and try
                        again on your next challenge!
                      </p>
                      <Button
                        onClick={() => {
                          setShowResult(false)
                          setUserAnswer("")
                        }}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Try Another Approach
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <Badge className="bg-white/10 text-white border-white/20">
              Problems Solved: {gameState.totalProblemsCompleted}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white hover:bg-white/10"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Character and Game Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Character Card */}
          <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-400/30 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-yellow-400">
                  <AvatarImage src={character.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{character.name}</h3>
                  <p className="text-yellow-200">Level {character.level} Scholar</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">{character.equipment.weapon}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-400" />
                      Health
                    </span>
                    <span className="text-sm">
                      {character.health}/{character.maxHealth}
                    </span>
                  </div>
                  <Progress value={(character.health / character.maxHealth) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-1">
                      <Zap className="h-4 w-4 text-blue-400" />
                      Mana
                    </span>
                    <span className="text-sm">
                      {character.mana}/{character.maxMana}
                    </span>
                  </div>
                  <Progress value={(character.mana / character.maxMana) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-400/30 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-400" />
                Character Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-300">Intelligence</p>
                  <p className="text-xl font-bold text-blue-300">{character.stats.intelligence}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Wisdom</p>
                  <p className="text-xl font-bold text-purple-300">{character.stats.wisdom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Strength</p>
                  <p className="text-xl font-bold text-red-300">{character.stats.strength}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Agility</p>
                  <p className="text-xl font-bold text-green-300">{character.stats.agility}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-400/30 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-400" />
                Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Current Streak</span>
                    <span className="text-lg font-bold text-orange-300">{gameState.streak}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-orange-200">Keep solving to maintain your streak!</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Gold</span>
                    <span className="text-lg font-bold text-yellow-300">{gameState.gold}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Difficulty Level</span>
                    <span className="text-lg font-bold text-red-300">{Math.ceil(gameState.currentDifficulty)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Content */}
        <Card className="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 border-white/20 text-white mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">{currentNode.title}</h1>
              {currentNode.culturalContext && (
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                  {currentNode.culturalContext}
                </Badge>
              )}
            </div>

            <div className="bg-black/30 rounded-lg p-6 mb-8">
              <p className="text-lg leading-relaxed text-gray-100">{currentNode.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center mb-6">Choose Your Path</h3>
              {currentNode.choices.map((choice, index) => (
                <Card
                  key={choice.id}
                  className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                  onClick={() => handleChoice(choice)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{choice.text}</p>
                        {choice.algebraProblem && (
                          <div className="flex items-center gap-2 text-sm text-blue-200">
                            <Calculator className="h-4 w-4" />
                            <span>Requires solving: {choice.algebraProblem.equation}</span>
                          </div>
                        )}
                        {choice.requirements && (
                          <div className="flex items-center gap-2 text-sm text-yellow-200 mt-1">
                            <Shield className="h-4 w-4" />
                            <span>
                              {choice.requirements.minLevel && `Level ${choice.requirements.minLevel}+ required`}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/60" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Preview */}
        {currentNode.rewards && (
          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-400/30 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5 text-yellow-400" />
                Potential Rewards
              </h3>
              <div className="flex items-center gap-4">
                {currentNode.rewards.xp && (
                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                    +{currentNode.rewards.xp} XP
                  </Badge>
                )}
                {currentNode.rewards.gold && (
                  <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                    +{currentNode.rewards.gold} Gold
                  </Badge>
                )}
                {currentNode.rewards.equipment && (
                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                    {currentNode.rewards.equipment}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
