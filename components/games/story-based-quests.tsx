"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, Clock, Microscope, Star } from "lucide-react"

interface Quest {
  id: string
  title: string
  subject: string
  description: string
  story: string
  difficulty: "Easy" | "Medium" | "Hard"
  xp: number
  icon: string
  chapters: Chapter[]
  currentChapter: number
}

interface Chapter {
  id: string
  title: string
  story: string
  challenge: {
    question: string
    options: string[]
    correct: number
    explanation: string
  }
  completed: boolean
}

interface StoryBasedQuestsProps {
  onBack: () => void
}

export function StoryBasedQuests({ onBack }: StoryBasedQuestsProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [showChallenge, setShowChallenge] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const quests: Quest[] = [
    {
      id: "time-traveler",
      title: "The Time Traveler's Journey",
      subject: "History",
      description: "Travel through different eras and witness historical events",
      story: "You've discovered a mysterious time machine in your grandfather's attic...",
      difficulty: "Medium",
      xp: 150,
      icon: "⏰",
      currentChapter: 0,
      chapters: [
        {
          id: "ancient-egypt",
          title: "Ancient Egypt - 3000 BCE",
          story:
            "You emerge from the time portal to find yourself standing before the Great Pyramid of Giza. The hot desert sun beats down as you watch thousands of workers moving massive stone blocks. A pharaoh's advisor approaches you...",
          challenge: {
            question: "The Great Pyramid was built for which pharaoh?",
            options: ["Tutankhamun", "Khufu", "Ramesses II", "Cleopatra"],
            correct: 1,
            explanation: "The Great Pyramid of Giza was built for Pharaoh Khufu around 2580-2560 BCE!",
          },
          completed: false,
        },
        {
          id: "medieval-times",
          title: "Medieval Castle - 1200 CE",
          story:
            "Your time machine whirs and you find yourself in a medieval castle courtyard. Knights in shining armor practice sword fighting while merchants sell their wares. The smell of bread from the bakery fills the air...",
          challenge: {
            question: "What was the main purpose of medieval castles?",
            options: ["Entertainment", "Defense and control", "Religious ceremonies", "Trade centers"],
            correct: 1,
            explanation: "Medieval castles were primarily built for defense and to control the surrounding territory!",
          },
          completed: false,
        },
      ],
    },
    {
      id: "young-scientist",
      title: "The Young Scientist's Lab",
      subject: "Science",
      description: "Conduct exciting experiments and discover scientific principles",
      story: "Welcome to Dr. Discovery's laboratory! You're the newest junior scientist...",
      difficulty: "Easy",
      xp: 100,
      icon: "🔬",
      currentChapter: 0,
      chapters: [
        {
          id: "water-cycle",
          title: "The Mystery of the Missing Water",
          story:
            "Dr. Discovery shows you a glass of water that's been sitting in the sun. 'Strange,' she says, 'this glass was full yesterday, but now it's only half full. Where did the water go?' Your mission is to solve this mystery!",
          challenge: {
            question: "What happened to the missing water?",
            options: ["It disappeared forever", "It evaporated into the air", "Someone drank it", "It turned into ice"],
            correct: 1,
            explanation:
              "The water evaporated! When water heats up, it turns into invisible water vapor and rises into the air!",
          },
          completed: false,
        },
        {
          id: "plant-growth",
          title: "The Secret of Growing Plants",
          story:
            "In the greenhouse, you notice two identical plants. One is green and healthy, while the other looks weak and yellow. Dr. Discovery explains that they've been treated differently. Can you figure out what plants need to grow strong?",
          challenge: {
            question: "What do plants need most to grow healthy and green?",
            options: ["Only water", "Sunlight, water, and air", "Just soil", "Only sunlight"],
            correct: 1,
            explanation:
              "Plants need sunlight for energy, water for nutrients, and carbon dioxide from air to make their own food through photosynthesis!",
          },
          completed: false,
        },
      ],
    },
  ]

  const handleQuestSelect = (quest: Quest) => {
    setSelectedQuest(quest)
    setCurrentChapter(0)
    setShowChallenge(false)
    setShowResult(false)
    setSelectedAnswer(null)
  }

  const startChallenge = () => {
    setShowChallenge(true)
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    setTimeout(() => {
      if (answerIndex === selectedQuest!.chapters[currentChapter].challenge.correct) {
        // Mark chapter as completed
        const updatedQuest = { ...selectedQuest! }
        updatedQuest.chapters[currentChapter].completed = true
        setSelectedQuest(updatedQuest)

        // Move to next chapter or complete quest
        if (currentChapter < selectedQuest!.chapters.length - 1) {
          setTimeout(() => {
            setCurrentChapter((prev) => prev + 1)
            setShowChallenge(false)
            setShowResult(false)
            setSelectedAnswer(null)
          }, 2000)
        }
      }
    }, 2000)
  }

  if (!selectedQuest) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <BookOpen className="h-3 w-3 mr-1" />
            Story Quests
          </Badge>
        </div>

        {/* Quest Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Choose Your Adventure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quests.map((quest) => (
              <Card
                key={quest.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuestSelect(quest)}
              >
                <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="text-4xl">{quest.icon}</div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{quest.title}</CardTitle>
                    <Badge variant="secondary">+{quest.xp} XP</Badge>
                  </div>
                  <CardDescription className="mb-4">{quest.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline">{quest.subject}</Badge>
                      <Badge
                        variant={
                          quest.difficulty === "Easy"
                            ? "secondary"
                            : quest.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {quest.difficulty}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">{quest.chapters.length} chapters</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const chapter = selectedQuest.chapters[currentChapter]
  const completedChapters = selectedQuest.chapters.filter((c) => c.completed).length
  const progressPercentage = (completedChapters / selectedQuest.chapters.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setSelectedQuest(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Quests
          </Button>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <BookOpen className="h-3 w-3 mr-1" />
            {selectedQuest.title}
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {selectedQuest.icon} {selectedQuest.title}
                </CardTitle>
                <CardDescription>
                  Chapter {currentChapter + 1} of {selectedQuest.chapters.length}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {completedChapters}/{selectedQuest.chapters.length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Chapter Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <CardTitle className="text-xl mb-4 flex items-center gap-2">
              {selectedQuest.subject === "History" ? <Clock className="h-5 w-5" /> : <Microscope className="h-5 w-5" />}
              {chapter.title}
            </CardTitle>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg mb-6">
              <p className="text-gray-700 leading-relaxed">{chapter.story}</p>
            </div>

            {!showChallenge && !chapter.completed && (
              <Button onClick={startChallenge} className="w-full">
                <Star className="h-4 w-4 mr-2" />
                Accept the Challenge
              </Button>
            )}

            {chapter.completed && (
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-green-600 font-medium">Chapter Completed!</p>
                {currentChapter < selectedQuest.chapters.length - 1 && (
                  <Button
                    onClick={() => {
                      setCurrentChapter((prev) => prev + 1)
                      setShowChallenge(false)
                      setShowResult(false)
                      setSelectedAnswer(null)
                    }}
                    className="mt-4"
                  >
                    Next Chapter
                  </Button>
                )}
                {currentChapter === selectedQuest.chapters.length - 1 && (
                  <div className="mt-4">
                    <p className="text-lg font-bold text-purple-600 mb-2">Quest Complete! 🎉</p>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      +{selectedQuest.xp} XP Earned!
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Challenge */}
        {showChallenge && !chapter.completed && (
          <Card>
            <CardContent className="p-6">
              <CardTitle className="text-xl mb-4">Chapter Challenge</CardTitle>
              <p className="text-lg mb-6">{chapter.challenge.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {chapter.challenge.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      showResult
                        ? index === chapter.challenge.correct
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
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">
                    {selectedAnswer === chapter.challenge.correct ? "✅ Excellent!" : "❌ Not quite right!"}
                  </p>
                  <p className="text-sm text-gray-600">{chapter.challenge.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
