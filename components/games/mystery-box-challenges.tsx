"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Gift, Sparkles, Clock, Lock } from "lucide-react"

interface MysteryBox {
  id: string
  title: string
  description: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  timeToUnlock: number // hours
  isUnlocked: boolean
  isOpened: boolean
  rewards: Reward[]
  challenge?: Challenge
}

interface Reward {
  type: "XP" | "Badge" | "Avatar" | "Power" | "Coins"
  name: string
  value: number | string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
}

interface Challenge {
  id: string
  title: string
  description: string
  questions: {
    question: string
    options: string[]
    correct: number
  }[]
  completed: boolean
}

interface MysteryBoxChallengesProps {
  onBack: () => void
}

export function MysteryBoxChallenges({ onBack }: MysteryBoxChallengesProps) {
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([
    {
      id: "weekly-1",
      title: "Weekly Wonder Box",
      description: "A mysterious box that appears every week with special challenges",
      rarity: "Rare",
      timeToUnlock: 0,
      isUnlocked: true,
      isOpened: false,
      rewards: [
        { type: "XP", name: "Bonus XP", value: 150, rarity: "Rare" },
        { type: "Badge", name: "Mystery Solver", value: "Mystery Solver Badge", rarity: "Rare" },
        { type: "Coins", name: "Gold Coins", value: 100, rarity: "Common" },
      ],
      challenge: {
        id: "mystery-challenge-1",
        title: "The Riddle of Numbers",
        description: "Solve these mathematical mysteries to unlock your rewards!",
        questions: [
          {
            question: "I am a number. When you multiply me by 4 and add 8, you get 32. What number am I?",
            options: ["6", "7", "8", "9"],
            correct: 0,
          },
          {
            question: "What comes next in this sequence: 2, 6, 18, 54, ?",
            options: ["108", "162", "216", "270"],
            correct: 1,
          },
        ],
        completed: false,
      },
    },
    {
      id: "daily-1",
      title: "Daily Discovery Box",
      description: "A small box with daily surprises for consistent learners",
      rarity: "Common",
      timeToUnlock: 0,
      isUnlocked: true,
      isOpened: false,
      rewards: [
        { type: "XP", name: "Daily XP", value: 50, rarity: "Common" },
        { type: "Coins", name: "Silver Coins", value: 25, rarity: "Common" },
      ],
    },
    {
      id: "legendary-1",
      title: "Legendary Scholar's Chest",
      description: "An ancient chest that only opens for the most dedicated students",
      rarity: "Legendary",
      timeToUnlock: 72,
      isUnlocked: false,
      isOpened: false,
      rewards: [
        { type: "XP", name: "Legendary XP Boost", value: 500, rarity: "Legendary" },
        { type: "Badge", name: "Scholar Supreme", value: "Scholar Supreme Badge", rarity: "Legendary" },
        { type: "Avatar", name: "Golden Crown", value: "Golden Crown Avatar", rarity: "Legendary" },
        { type: "Power", name: "Double XP", value: "Double XP for 24 hours", rarity: "Epic" },
      ],
      challenge: {
        id: "legendary-challenge-1",
        title: "The Ultimate Knowledge Test",
        description: "Only true scholars can solve these advanced challenges!",
        questions: [
          {
            question: "What is the square root of 144?",
            options: ["11", "12", "13", "14"],
            correct: 1,
          },
          {
            question: "Which scientist developed the theory of relativity?",
            options: ["Newton", "Einstein", "Galileo", "Darwin"],
            correct: 1,
          },
          {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2,
          },
        ],
        completed: false,
      },
    },
    {
      id: "epic-1",
      title: "Epic Adventure Vault",
      description: "A vault filled with epic rewards for brave adventurers",
      rarity: "Epic",
      timeToUnlock: 24,
      isUnlocked: false,
      isOpened: false,
      rewards: [
        { type: "XP", name: "Epic XP Bonus", value: 300, rarity: "Epic" },
        { type: "Badge", name: "Adventure Master", value: "Adventure Master Badge", rarity: "Epic" },
        { type: "Coins", name: "Platinum Coins", value: 200, rarity: "Epic" },
      ],
    },
  ])

  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null)
  const [challengePhase, setChallengePhase] = useState<"intro" | "questions" | "complete">("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "from-gray-400 to-gray-500"
      case "Rare":
        return "from-blue-400 to-blue-600"
      case "Epic":
        return "from-purple-400 to-purple-600"
      case "Legendary":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getRarityBadgeVariant = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "secondary"
      case "Rare":
        return "default"
      case "Epic":
        return "destructive"
      case "Legendary":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const openBox = (box: MysteryBox) => {
    setSelectedBox(box)
    if (box.challenge) {
      setChallengePhase("intro")
    } else {
      // Simple box without challenge
      setMysteryBoxes((prev) => prev.map((b) => (b.id === box.id ? { ...b, isOpened: true } : b)))
    }
  }

  const startChallenge = () => {
    setChallengePhase("questions")
    setCurrentQuestionIndex(0)
    setCorrectAnswers(0)
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === selectedBox!.challenge!.questions[currentQuestionIndex].correct
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    }

    setTimeout(() => {
      if (currentQuestionIndex < selectedBox!.challenge!.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        // Challenge complete
        setChallengePhase("complete")
        setMysteryBoxes((prev) =>
          prev.map((b) =>
            b.id === selectedBox!.id
              ? {
                  ...b,
                  isOpened: true,
                  challenge: { ...b.challenge!, completed: true },
                }
              : b,
          ),
        )
      }
    }, 2000)
  }

  const closeBox = () => {
    setSelectedBox(null)
    setChallengePhase("intro")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setCorrectAnswers(0)
  }

  // Simulate time-based unlocking
  useEffect(() => {
    const timer = setInterval(() => {
      setMysteryBoxes((prev) =>
        prev.map((box) => {
          if (!box.isUnlocked && box.timeToUnlock > 0) {
            const newTime = box.timeToUnlock - 1
            return { ...box, timeToUnlock: newTime, isUnlocked: newTime <= 0 }
          }
          return box
        }),
      )
    }, 3600000) // Update every hour

    return () => clearInterval(timer)
  }, [])

  if (selectedBox) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={closeBox} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Mystery Boxes
            </Button>
            <Badge variant={getRarityBadgeVariant(selectedBox.rarity)} className="text-sm">
              {selectedBox.rarity} Box
            </Badge>
          </div>

          {challengePhase === "intro" && selectedBox.challenge && (
            <div className="text-center space-y-6">
              <Card className="p-8">
                <div className="text-6xl mb-4">🎁</div>
                <CardTitle className="text-3xl mb-2">{selectedBox.title}</CardTitle>
                <CardDescription className="text-lg mb-6">{selectedBox.description}</CardDescription>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-lg mb-2">{selectedBox.challenge.title}</h3>
                  <p className="text-gray-700">{selectedBox.challenge.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {selectedBox.rewards.map((reward, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="text-2xl mb-2">
                        {reward.type === "XP"
                          ? "⚡"
                          : reward.type === "Badge"
                            ? "🏆"
                            : reward.type === "Avatar"
                              ? "👑"
                              : reward.type === "Power"
                                ? "✨"
                                : "💰"}
                      </div>
                      <div className="font-medium">{reward.name}</div>
                      <Badge variant="outline" className="mt-1">
                        {reward.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button onClick={startChallenge} size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Accept Challenge
                </Button>
              </Card>
            </div>
          )}

          {challengePhase === "questions" && selectedBox.challenge && (
            <div className="space-y-6">
              {/* Progress */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-lg">Challenge Progress</CardTitle>
                      <CardDescription>
                        Question {currentQuestionIndex + 1} of {selectedBox.challenge.questions.length}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{correctAnswers}</div>
                      <div className="text-sm text-gray-500">Correct</div>
                    </div>
                  </div>
                  <Progress
                    value={((currentQuestionIndex + 1) / selectedBox.challenge.questions.length) * 100}
                    className="h-3"
                  />
                </CardContent>
              </Card>

              {/* Question */}
              <Card>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-6">
                    {selectedBox.challenge.questions[currentQuestionIndex].question}
                  </CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedBox.challenge.questions[currentQuestionIndex].options.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          showResult
                            ? index === selectedBox.challenge!.questions[currentQuestionIndex].correct
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
                      <p className="font-medium">
                        {selectedAnswer === selectedBox.challenge.questions[currentQuestionIndex].correct
                          ? "✅ Correct!"
                          : "❌ Incorrect!"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {challengePhase === "complete" && (
            <div className="text-center space-y-6">
              <Card className="p-8">
                <div className="text-6xl mb-4">🎉</div>
                <CardTitle className="text-3xl mb-2">Challenge Complete!</CardTitle>
                <CardDescription className="text-lg mb-6">
                  You answered {correctAnswers} out of {selectedBox.challenge!.questions.length} questions correctly!
                </CardDescription>

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-lg mb-4">Rewards Unlocked!</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedBox.rewards.map((reward, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">
                          {reward.type === "XP"
                            ? "⚡"
                            : reward.type === "Badge"
                              ? "🏆"
                              : reward.type === "Avatar"
                                ? "👑"
                                : reward.type === "Power"
                                  ? "✨"
                                  : "💰"}
                        </div>
                        <div className="font-medium">{reward.name}</div>
                        <div className="text-sm text-gray-600">+{reward.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={closeBox} size="lg">
                  <Gift className="h-5 w-5 mr-2" />
                  Collect Rewards
                </Button>
              </Card>
            </div>
          )}

          {!selectedBox.challenge && (
            <div className="text-center space-y-6">
              <Card className="p-8">
                <div className="text-6xl mb-4">🎁</div>
                <CardTitle className="text-3xl mb-2">{selectedBox.title}</CardTitle>
                <CardDescription className="text-lg mb-6">You found some amazing rewards!</CardDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {selectedBox.rewards.map((reward, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                      <div className="text-3xl mb-2">{reward.type === "XP" ? "⚡" : "💰"}</div>
                      <div className="font-medium">{reward.name}</div>
                      <div className="text-lg font-bold">+{reward.value}</div>
                    </div>
                  ))}
                </div>

                <Button onClick={closeBox} size="lg">
                  <Gift className="h-5 w-5 mr-2" />
                  Collect Rewards
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Gift className="h-3 w-3 mr-1" />
          Mystery Boxes
        </Badge>
      </div>

      {/* Mystery Boxes Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Mystery Box Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mysteryBoxes.map((box) => (
            <Card key={box.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className={`h-32 bg-gradient-to-r ${getRarityColor(box.rarity)} flex items-center justify-center relative`}
              >
                {box.isOpened ? (
                  <div className="text-4xl">📦</div>
                ) : box.isUnlocked ? (
                  <div className="text-4xl animate-pulse">🎁</div>
                ) : (
                  <div className="text-4xl opacity-50">🔒</div>
                )}
                <Badge variant={getRarityBadgeVariant(box.rarity)} className="absolute top-2 right-2">
                  {box.rarity}
                </Badge>
              </div>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-2">{box.title}</CardTitle>
                <CardDescription className="mb-4 text-sm">{box.description}</CardDescription>

                {box.isOpened ? (
                  <div className="text-center">
                    <div className="text-green-600 font-medium mb-2">✅ Opened</div>
                    <p className="text-sm text-gray-500">Rewards collected!</p>
                  </div>
                ) : box.isUnlocked ? (
                  <Button onClick={() => openBox(box)} className="w-full">
                    <Gift className="h-4 w-4 mr-2" />
                    Open Box
                  </Button>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Locked</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {box.timeToUnlock}h remaining
                    </div>
                  </div>
                )}

                {/* Rewards Preview */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Possible Rewards:</p>
                  <div className="flex flex-wrap gap-1">
                    {box.rewards.slice(0, 3).map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {reward.type === "XP"
                          ? "⚡"
                          : reward.type === "Badge"
                            ? "🏆"
                            : reward.type === "Avatar"
                              ? "👑"
                              : reward.type === "Power"
                                ? "✨"
                                : "💰"}
                      </Badge>
                    ))}
                    {box.rewards.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{box.rewards.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardContent className="p-6">
          <CardTitle className="text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mystery Box Schedule
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Daily Boxes</h3>
              <p className="text-sm text-blue-600">New box every 24 hours</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800">Weekly Boxes</h3>
              <p className="text-sm text-purple-600">Special box every Monday</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">Legendary Boxes</h3>
              <p className="text-sm text-yellow-600">Rare box for top performers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
