"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Star, Heart, Loader2 } from "lucide-react"

interface WordChallenge {
  word: string
  definition: string
  scrambled: string
  difficulty: number
  category: string
  hint?: string
}

export function WordBuilder({ onBack }: { onBack: () => void }) {
  const { user, updateUserProgress } = useAuth()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentWord, setCurrentWord] = useState<WordChallenge | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [wordsCompleted, setWordsCompleted] = useState(0)

  const generateAIWord = async (level: number, grade: number) => {
    setIsLoading(true)
    try {
      console.log("[v0] Generating AI word for level:", level, "grade:", grade)
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "english",
          difficulty: Math.min(level, 20),
          grade: grade || 6,
          gameType: "word-builder",
          count: 1,
          customPrompt: `Generate a single vocabulary word appropriate for grade ${grade || 6} students at difficulty level ${Math.min(level, 20)}. Return ONLY a JSON object with this exact format: {"word": "EXAMPLE", "definition": "A clear explanation of what this word means", "category": "word category like Animals, Nature, etc"}. The word should be ${level < 5 ? "3-6" : level < 10 ? "5-8" : "6-12"} letters long and appropriate for educational purposes.`,
        }),
      })

      if (!response.ok) {
        console.log("[v0] API response not ok:", response.status)
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      let wordData = null

      // Try to parse the response text directly if it contains JSON
      if (data.answer || data.text || data.response) {
        const responseText = data.answer || data.text || data.response
        try {
          // Try to extract JSON from the response
          const jsonMatch = responseText.match(/\{[^}]*"word"[^}]*\}/i)
          if (jsonMatch) {
            wordData = JSON.parse(jsonMatch[0])
          }
        } catch (e) {
          console.log("[v0] Failed to parse JSON from response text")
        }
      }

      // Fallback to existing parsing logic
      if (!wordData) {
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          wordData = data.questions[0]
        } else if (data.question) {
          wordData = data
        } else if (data.word) {
          wordData = data
        }
      }

      console.log("[v0] Parsed word data:", wordData)

      // Extract word from the parsed data
      let word = null
      let definition = null
      let category = "Vocabulary"

      if (wordData) {
        word = wordData.word || wordData.answer || wordData.correctAnswer
        definition = wordData.definition || wordData.explanation
        category = wordData.category || "Vocabulary"

        // If we still don't have a word, try to extract from correct answer in multiple choice
        if (!word && wordData.correct) {
          word = wordData.correct
          definition = wordData.question || wordData.explanation || `Spell this word: ${word}`
        }
      }

      console.log("[v0] Extracted word:", word, "definition:", definition)

      if (word && word.length >= 3) {
        const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, "")
        if (cleanWord.length >= 3) {
          return {
            word: cleanWord,
            definition: definition || `Spell this word: ${cleanWord}`,
            category: category,
            difficulty: level,
            scrambled: cleanWord
              .split("")
              .sort(() => Math.random() - 0.5)
              .join(""),
            hint: `This ${category.toLowerCase()} word has ${cleanWord.length} letters`,
          }
        }
      }

      console.log("[v0] No valid word found, using fallback")
      throw new Error("No valid word in API response")
    } catch (error) {
      console.error("[v0] Error generating AI word:", error)
      return generateLocalWord(level, grade)
    } finally {
      setIsLoading(false)
    }
  }

  const generateLocalWord = (level: number, grade: number) => {
    const wordDatabase = {
      1: [
        { word: "CAT", definition: "A small furry pet that meows", category: "Animals" },
        { word: "DOG", definition: "A loyal pet that barks", category: "Animals" },
        { word: "SUN", definition: "The bright star in our sky", category: "Nature" },
        { word: "TREE", definition: "A tall plant with leaves", category: "Nature" },
        { word: "BOOK", definition: "Something you read", category: "Objects" },
        { word: "FISH", definition: "Animal that swims in water", category: "Animals" },
        { word: "BIRD", definition: "Animal that flies in the sky", category: "Animals" },
        { word: "MOON", definition: "Earth's natural satellite", category: "Nature" },
      ],
      2: [
        { word: "HOUSE", definition: "A place where people live", category: "Places" },
        { word: "WATER", definition: "Clear liquid we drink", category: "Nature" },
        { word: "HAPPY", definition: "Feeling joyful and glad", category: "Emotions" },
        { word: "FRIEND", definition: "Someone you like and trust", category: "People" },
        { word: "SCHOOL", definition: "Place where children learn", category: "Places" },
        { word: "GARDEN", definition: "Place where plants grow", category: "Places" },
        { word: "FAMILY", definition: "People related to you", category: "People" },
        { word: "MUSIC", definition: "Sounds arranged in harmony", category: "Arts" },
      ],
      3: [
        { word: "ELEPHANT", definition: "Large gray animal with trunk", category: "Animals" },
        { word: "RAINBOW", definition: "Colorful arc in the sky", category: "Nature" },
        { word: "COMPUTER", definition: "Electronic device for work", category: "Technology" },
        { word: "BIRTHDAY", definition: "Annual celebration of birth", category: "Events" },
        { word: "ADVENTURE", definition: "Exciting and risky journey", category: "Activities" },
        { word: "BUTTERFLY", definition: "Colorful flying insect", category: "Animals" },
        { word: "MOUNTAIN", definition: "Very tall natural elevation", category: "Geography" },
        { word: "TELESCOPE", definition: "Device to see distant objects", category: "Science" },
      ],
    }

    const difficulty = Math.min(Math.ceil(level / 3), 3)
    const wordList = wordDatabase[difficulty as keyof typeof wordDatabase] || wordDatabase[3]
    const selectedWord = wordList[Math.floor(Math.random() * wordList.length)]

    return {
      ...selectedWord,
      scrambled: selectedWord.word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join(""),
      difficulty: level,
      hint: `This ${selectedWord.category.toLowerCase()} word has ${selectedWord.word.length} letters`,
    }
  }

  const startGame = async () => {
    setGameStarted(true)
    setScore(0)
    setLives(3)
    setWordsCompleted(0)

    const newWord = await generateAIWord(currentLevel, user?.grade || 6)
    setCurrentWord(newWord)
    setupWord(newWord)
  }

  const setupWord = (word: WordChallenge) => {
    setSelectedLetters([])
    setAvailableLetters(word.scrambled.split(""))
    setUserAnswer("")
  }

  const selectLetter = (letter: string, index: number) => {
    setSelectedLetters([...selectedLetters, letter])
    setAvailableLetters(availableLetters.filter((_, i) => i !== index))
    setUserAnswer(userAnswer + letter)
  }

  const removeLetter = (index: number) => {
    const letter = selectedLetters[index]
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index))
    setAvailableLetters([...availableLetters, letter])
    setUserAnswer(userAnswer.slice(0, index) + userAnswer.slice(index + 1))
  }

  const handleSubmit = async () => {
    if (!currentWord) return

    const isAnswerCorrect = userAnswer.toUpperCase() === currentWord.word.toUpperCase()

    setIsCorrect(isAnswerCorrect)
    setShowResult(true)

    if (isAnswerCorrect) {
      const points = Math.max(15, currentWord.difficulty * 20 + currentLevel * 10)
      setScore(score + points)
      updateUserProgress(points)
    } else {
      setLives(lives - 1)
    }

    setTimeout(async () => {
      setShowResult(false)
      setWordsCompleted(wordsCompleted + 1)

      if (lives <= 1 && !isAnswerCorrect) {
        return
      }

      if (wordsCompleted > 0 && wordsCompleted % 3 === 0) {
        setCurrentLevel(currentLevel + 1)
        setLives(3) // Restore lives on level up
      }

      const nextWord = await generateAIWord(currentLevel + Math.floor(wordsCompleted / 3), user?.grade || 6)

      setCurrentWord(nextWord)
      setupWord(nextWord)
    }, 2500)
  }

  const resetGame = () => {
    setGameStarted(false)
    setCurrentLevel(1)
    setCurrentWord(null)
    setWordsCompleted(0)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl">Word Builder</CardTitle>
              <CardDescription className="text-lg">
                Endless AI-powered word challenges to expand your vocabulary!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">∞</div>
                  <div className="text-sm text-gray-600">Endless Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">🤖</div>
                  <div className="text-sm text-gray-600">AI Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">📚</div>
                  <div className="text-sm text-gray-600">Vocabulary Growth</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">How to Play:</h3>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Unscramble AI-generated words</li>
                  <li>• Level up every 3 correct words</li>
                  <li>• Difficulty increases with each level</li>
                  <li>• Learn new vocabulary continuously</li>
                  <li>• Game never ends - keep learning!</li>
                </ul>
              </div>

              <Button onClick={startGame} size="lg" className="w-full">
                Start Endless Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (lives <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Lives Depleted!</CardTitle>
            <CardDescription>
              You reached Level {currentLevel} and completed {wordsCompleted} words!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="bg-pink-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-pink-600">{currentLevel}</div>
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

  if (isLoading || !currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-lg font-semibold">Finding your next word...</p>
            <p className="text-sm text-gray-600 mt-2">AI is selecting a perfect challenge for Level {currentLevel}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Level {currentLevel}</Badge>
            <Badge variant="outline">Word {wordsCompleted + 1}</Badge>
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
              Progress to Level {currentLevel + 1}: {wordsCompleted % 3}/3
            </span>
            <span>Score: {score}</span>
          </div>
          <Progress value={(wordsCompleted % 3) * 33.33} />
        </div>

        {/* Word Challenge */}
        <Card className="mb-6">
          <CardContent className="p-8">
            {!showResult ? (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">
                    {currentWord?.category}
                  </Badge>
                  <p className="text-lg text-gray-700 mb-2">{currentWord?.definition}</p>
                  {currentWord?.hint && <p className="text-sm text-gray-500 italic">Hint: {currentWord.hint}</p>}
                </div>

                {/* Selected Letters */}
                <div className="text-center">
                  <div className="flex justify-center gap-2 mb-4 min-h-[60px] items-center">
                    {selectedLetters.map((letter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-12 h-12 text-xl font-bold bg-transparent"
                        onClick={() => removeLetter(index)}
                      >
                        {letter}
                      </Button>
                    ))}
                    {selectedLetters.length === 0 && (
                      <div className="text-gray-400 text-lg">Click letters to build the word</div>
                    )}
                  </div>
                </div>

                {/* Available Letters */}
                <div className="text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {availableLetters.map((letter, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        className="w-12 h-12 text-xl font-bold"
                        onClick={() => selectLetter(letter, index)}
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    disabled={selectedLetters.length !== currentWord?.word.length}
                    className="w-full"
                  >
                    Submit Word
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`text-center text-2xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-8 w-8 fill-current" />
                      Excellent!
                    </div>
                    <div className="text-lg">
                      +{Math.max(15, currentWord!.difficulty * 20 + currentLevel * 10)} points
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>Wrong!</div>
                    <div className="text-lg text-gray-700">
                      The word was: <span className="text-green-600">{currentWord?.word}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Difficulty Indicator */}
        <div className="text-center">
          <Badge variant="outline">Difficulty: {currentWord?.difficulty}/20</Badge>
        </div>
      </div>
    </div>
  )
}
