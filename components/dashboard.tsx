"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Target,
  Flame,
  Star,
  Play,
  Brain,
  LogOut,
  BarChart3,
  Map,
  Sword,
  Heart,
  Zap,
  Gift,
  Hammer,
  Beaker,
  TreePine,
  Clock,
  BookOpen,
  Users,
} from "lucide-react"
import { MathQuest } from "@/components/games/math-quest"
import { WordBuilder } from "@/components/games/word-builder"
import { KnowledgeAdventureMap } from "@/components/games/knowledge-adventure-map"
import { BossFightLearning } from "@/components/games/boss-fight-learning"
import { AIStudyBuddy } from "@/components/games/ai-study-buddy"
import { StoryBasedQuests } from "@/components/games/story-based-quests"
import { PeerBattleMode } from "@/components/games/peer-battle-mode"
import { MysteryBoxChallenges } from "@/components/games/mystery-box-challenges"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Games2D } from "@/components/games/games-2d"
import { AIChatbot } from "@/components/ai-chatbot"
import { StudyBuddyDuels } from "@/components/games/study-buddy-duels"
import { AlgebraOdyssey } from "@/components/games/algebra-odyssey"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("adventure")
  const [activeGame, setActiveGame] = useState<string | null>(null)

  if (!user) return null

  if (activeGame === "math-quest") {
    return <MathQuest onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "word-builder") {
    return <WordBuilder onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "adventure-map") {
    return <KnowledgeAdventureMap onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "boss-fight") {
    return <BossFightLearning onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "story-quests") {
    return <StoryBasedQuests onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "peer-battle") {
    return <PeerBattleMode onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "mystery-box") {
    return <MysteryBoxChallenges onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "physics-forge") {
    return <Games2D gameType="physics-forge" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "elemental-alchemist") {
    return <Games2D gameType="elemental-alchemist" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "ecosystem-architect") {
    return <Games2D gameType="ecosystem-architect" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "timeline-tactician") {
    return <Games2D gameType="timeline-tactician" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "word-weaver-worlds") {
    return <Games2D gameType="word-weaver-worlds" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "quiz-runner") {
    return <Games2D gameType="quiz-runner" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "puzzle-tower") {
    return <Games2D gameType="puzzle-tower" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "word-ninja") {
    return <Games2D gameType="word-ninja" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "math-invaders") {
    return <Games2D gameType="math-invaders" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "knowledge-platformer") {
    return <Games2D gameType="knowledge-platformer" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "memory-match") {
    return <Games2D gameType="memory-match" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "quiz-battle-arena") {
    return <Games2D gameType="quiz-battle-arena" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "treasure-hunt") {
    return <Games2D gameType="treasure-hunt" onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "study-buddy-duels") {
    return <StudyBuddyDuels onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "algebra-odyssey") {
    return <AlgebraOdyssey onBack={() => setActiveGame(null)} />
  }

  const progressToNextLevel = ((user.xp % 250) / 250) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50">
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gradient">EduQuest</h1>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Grade {user.grade}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">Level {user.level}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Current Level</p>
                  <p className="text-3xl font-bold text-white">{user.level}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={progressToNextLevel} className="bg-primary-foreground/20 h-2" />
                <p className="text-xs text-primary-foreground/80 mt-2 font-medium">
                  {user.xp % 250}/250 XP to next level
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-secondary to-secondary/80 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Total Experience</p>
                  <p className="text-3xl font-bold text-white">{user.xp.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Learning Streak</p>
                  <p className="text-3xl font-bold text-white">{user.streak}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Flame className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-sm font-medium">Achievements</p>
                  <p className="text-3xl font-bold text-white">{user.achievements?.length || 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-card rounded-xl border shadow-sm">
          {[
            { id: "adventure", label: "Adventure Map", icon: Map },
            { id: "battles", label: "Boss Battles", icon: Sword },
            { id: "buddy", label: "AI Tutor", icon: Heart },
            { id: "stories", label: "Story Quests", icon: Brain },
            { id: "pvp", label: "PvP Battle", icon: Zap },
            { id: "duels", label: "AR Duels", icon: Users },
            { id: "mystery", label: "Mystery Box", icon: Gift },
            { id: "games", label: "Classic Games", icon: Play },
            { id: "educational", label: "Educational 2D", icon: Beaker },
            { id: "games2d", label: "Arcade 2D", icon: Target },
            { id: "chatbot", label: "AI Chat", icon: Brain },
            { id: "analytics", label: "Progress", icon: BarChart3 },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
              size="sm"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </Button>
          ))}
        </div>

        {activeTab === "adventure" && (
          <div className="space-y-6">
            <Card className="card-hover overflow-hidden border-0 shadow-lg">
              <div className="h-64 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <Map className="h-24 w-24 text-white/90 relative z-10" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-3xl font-bold mb-2">Knowledge Adventure Map</h3>
                  <p className="text-lg opacity-90">Navigate through your personalized learning journey</p>
                </div>
                <div className="absolute top-6 right-6 z-10">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    Interactive Learning
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Explore subjects as an interactive map where each topic is a checkpoint. Clear checkpoints to unlock
                  new learning paths and discover hidden knowledge treasures!
                </p>
                <Button
                  onClick={() => setActiveGame("adventure-map")}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                  size="lg"
                >
                  <Map className="h-5 w-5 mr-2" />
                  Begin Your Adventure
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "battles" && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center relative">
                <Sword className="h-16 w-16 sm:h-24 sm:w-24 text-white/80" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Boss Fight Learning</h3>
                  <p className="text-sm sm:text-base opacity-90">Defeat knowledge bosses with correct answers</p>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <p className="text-gray-600 mb-4">
                  Face epic boss battles at the end of each unit. Answer questions correctly to defeat bosses and earn
                  legendary rewards!
                </p>
                <Button onClick={() => setActiveGame("boss-fight")} className="w-full sm:w-auto">
                  <Sword className="h-4 w-4 mr-2" />
                  Enter Battle
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "buddy" && <AIStudyBuddy />}

        {activeTab === "stories" && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center relative">
                <Brain className="h-16 w-16 sm:h-24 sm:w-24 text-white/80" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Story-Based Quests</h3>
                  <p className="text-sm sm:text-base opacity-90">Learn through interactive adventures</p>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <p className="text-gray-600 mb-4">
                  Embark on epic learning quests! Travel through time in history or become a scientist conducting
                  experiments in immersive stories.
                </p>
                <Button onClick={() => setActiveGame("story-quests")} className="w-full sm:w-auto">
                  <Brain className="h-4 w-4 mr-2" />
                  Begin Quest
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "pvp" && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 flex items-center justify-center relative">
                <Zap className="h-16 w-16 sm:h-24 sm:w-24 text-white/80" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Peer vs Peer Battle</h3>
                  <p className="text-sm sm:text-base opacity-90">Challenge friends to quiz battles</p>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <p className="text-gray-600 mb-4">
                  Challenge your friends to live quiz battles! Win battles to earn coins and customize your avatar with
                  special powers.
                </p>
                <Button onClick={() => setActiveGame("peer-battle")} className="w-full sm:w-auto">
                  <Zap className="h-4 w-4 mr-2" />
                  Find Battle
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "duels" && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center relative">
                <Users className="h-16 w-16 sm:h-24 sm:w-24 text-white/80" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Study Buddy Duels</h3>
                  <p className="text-sm sm:text-base opacity-90">AR-enhanced flashcard battles with nearby students</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/20 text-white border-white/30">AR Enhanced</Badge>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <p className="text-gray-600 mb-4">
                  Challenge nearby students to quick learning duels! Use AR mode to see animated characters battle with
                  your flashcards. Perfect for exam prep and building confidence through friendly competition.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    Real-time Battles
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    AR Camera Mode
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Nearby Opponents
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    SMS Offline Mode
                  </Badge>
                </div>
                <Button
                  onClick={() => setActiveGame("study-buddy-duels")}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Start AR Duel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "mystery" && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center relative">
                <Gift className="h-16 w-16 sm:h-24 sm:w-24 text-white/80" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Mystery Box Challenges</h3>
                  <p className="text-sm sm:text-base opacity-90">Weekly surprises and unique rewards</p>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <p className="text-gray-600 mb-4">
                  Open weekly mystery boxes filled with surprise challenges and unique rewards. Never know what exciting
                  learning adventure awaits!
                </p>
                <Button onClick={() => setActiveGame("mystery-box")} className="w-full sm:w-auto">
                  <Gift className="h-4 w-4 mr-2" />
                  Open Mystery Box
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "games" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                id: "math-quest",
                title: "Math Quest",
                description: "Solve equations to defeat monsters",
                subject: "Mathematics",
                difficulty: "Medium",
                xp: 50,
                color: "from-blue-500 to-blue-600",
              },
              {
                id: "word-builder",
                title: "Word Builder",
                description: "Build vocabulary through puzzles",
                subject: "English",
                difficulty: "Easy",
                xp: 25,
                color: "from-purple-500 to-purple-600",
              },
            ].map((game, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-24 sm:h-32 bg-gradient-to-r ${game.color} flex items-center justify-center`}>
                  <Brain className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-base sm:text-lg">{game.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      +{game.xp} XP
                    </Badge>
                  </div>
                  <CardDescription className="mb-4 text-sm">{game.description}</CardDescription>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {game.subject}
                      </Badge>
                      <Badge
                        variant={
                          game.difficulty === "Easy"
                            ? "secondary"
                            : game.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {game.difficulty}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        ["math-quest", "word-builder"].includes(game.id) ? setActiveGame(game.id) : undefined
                      }
                      disabled={!["math-quest", "word-builder"].includes(game.id)}
                      className="w-full sm:w-auto"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {["math-quest", "word-builder"].includes(game.id) ? "Play" : "Soon"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "educational" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Educational 2D Games</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Innovative educational games inspired by proven learning concepts. Each game teaches specific subjects
                through engaging gameplay mechanics designed for K-12 education.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  id: "algebra-odyssey",
                  title: "Algebra Odyssey RPG",
                  description: "Epic narrative-driven RPG where algebraic choices shape your destiny",
                  subject: "Algebra",
                  gradeLevel: "8-12",
                  difficulty: "Adaptive",
                  xp: 150,
                  color: "from-purple-600 to-indigo-700",
                  icon: BookOpen,
                  concept: "Branching narratives with algebraic problem solving",
                  featured: true,
                },
                {
                  id: "physics-forge",
                  title: "Physics Forge",
                  description: "Apply physics principles to forge tools and weapons",
                  subject: "Physics",
                  gradeLevel: "9-12",
                  difficulty: "Hard",
                  xp: 100,
                  color: "from-orange-600 to-red-700",
                  icon: Hammer,
                  concept: "Forces, torque, momentum, and energy",
                },
                {
                  id: "elemental-alchemist",
                  title: "Elemental Alchemist",
                  description: "Combine elements and balance chemical equations",
                  subject: "Chemistry",
                  gradeLevel: "9-12",
                  difficulty: "Hard",
                  xp: 95,
                  color: "from-purple-600 to-indigo-700",
                  icon: Beaker,
                  concept: "Periodic table and chemical reactions",
                },
                {
                  id: "ecosystem-architect",
                  title: "Ecosystem Architect",
                  description: "Build and manage biomes while learning ecology",
                  subject: "Biology",
                  gradeLevel: "6-12",
                  difficulty: "Medium",
                  xp: 85,
                  color: "from-green-600 to-emerald-700",
                  icon: TreePine,
                  concept: "Food chains and climate change",
                },
                {
                  id: "timeline-tactician",
                  title: "Timeline Tactician",
                  description: "Rewind history and learn cause-and-effect",
                  subject: "History",
                  gradeLevel: "6-12",
                  difficulty: "Medium",
                  xp: 80,
                  color: "from-amber-600 to-yellow-700",
                  icon: Clock,
                  concept: "Historical events and primary sources",
                },
                {
                  id: "word-weaver-worlds",
                  title: "Word Weaver Worlds",
                  description: "Build platforms with sentences and grammar",
                  subject: "English",
                  gradeLevel: "3-12",
                  difficulty: "Medium",
                  xp: 75,
                  color: "from-blue-600 to-cyan-700",
                  icon: BookOpen,
                  concept: "Grammar and literary genres",
                },
              ].map((game, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                    game.featured ? "ring-2 ring-purple-400 ring-opacity-50" : ""
                  }`}
                >
                  <div className={`h-32 bg-gradient-to-r ${game.color} flex items-center justify-center relative`}>
                    <game.icon className="h-12 w-12 text-white" />
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={`text-xs ${
                          game.featured
                            ? "bg-yellow-500/90 text-yellow-900 border-yellow-400"
                            : "bg-white/20 text-white border-white/30"
                        }`}
                      >
                        {game.featured ? "NEW RPG" : "Educational"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                        Grades {game.gradeLevel}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        +{game.xp} XP
                      </Badge>
                    </div>
                    <CardDescription className="mb-3 text-sm">{game.description}</CardDescription>
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 font-medium">Learning Focus:</p>
                      <p className="text-xs text-gray-500">{game.concept}</p>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-3">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {game.subject}
                        </Badge>
                        <Badge
                          variant={
                            game.difficulty === "Easy"
                              ? "secondary"
                              : game.difficulty === "Medium"
                                ? "default"
                                : game.difficulty === "Adaptive"
                                  ? "default"
                                  : "destructive"
                          }
                          className="text-xs"
                        >
                          {game.difficulty}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setActiveGame(game.id)}
                        className={`w-full ${
                          game.featured
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            : ""
                        }`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {game.featured ? "Start Odyssey" : "Start Learning"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "games2d" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                id: "quiz-runner",
                title: "Quiz Runner",
                description: "Side-scrolling runner with question obstacles",
                subject: "All Subjects",
                difficulty: "Medium",
                xp: 60,
                color: "from-cyan-500 to-blue-600",
              },
              {
                id: "puzzle-tower",
                title: "Puzzle Tower",
                description: "Climb the tower by solving puzzles",
                subject: "Logic & Math",
                difficulty: "Hard",
                xp: 80,
                color: "from-purple-500 to-indigo-600",
              },
              {
                id: "word-ninja",
                title: "Word Ninja",
                description: "Slice correct words like a ninja",
                subject: "English",
                difficulty: "Medium",
                xp: 55,
                color: "from-red-500 to-pink-600",
              },
              {
                id: "math-invaders",
                title: "Math Invaders",
                description: "Shoot enemies with correct math answers",
                subject: "Mathematics",
                difficulty: "Medium",
                xp: 65,
                color: "from-green-500 to-emerald-600",
              },
              {
                id: "knowledge-platformer",
                title: "Knowledge Platformer",
                description: "Mario-style game with quiz gates",
                subject: "All Subjects",
                difficulty: "Easy",
                xp: 45,
                color: "from-orange-500 to-red-600",
              },
              {
                id: "memory-match",
                title: "Memory Match Quest",
                description: "Match Q&A pairs to unlock new maps",
                subject: "All Subjects",
                difficulty: "Easy",
                xp: 35,
                color: "from-teal-500 to-cyan-600",
              },
              {
                id: "quiz-battle-arena",
                title: "Quiz Battle Arena",
                description: "2D fighting powered by correct answers",
                subject: "All Subjects",
                difficulty: "Hard",
                xp: 90,
                color: "from-violet-500 to-purple-600",
              },
              {
                id: "treasure-hunt",
                title: "Treasure Hunt 2D",
                description: "Maze game with quiz-locked treasures",
                subject: "All Subjects",
                difficulty: "Medium",
                xp: 70,
                color: "from-amber-500 to-orange-600",
              },
            ].map((game, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div
                  className={`h-24 sm:h-32 bg-gradient-to-r ${game.color} flex items-center justify-center relative`}
                >
                  <Target className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">Arcade</Badge>
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-base sm:text-lg">{game.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      +{game.xp} XP
                    </Badge>
                  </div>
                  <CardDescription className="mb-4 text-sm">{game.description}</CardDescription>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {game.subject}
                      </Badge>
                      <Badge
                        variant={
                          game.difficulty === "Easy"
                            ? "secondary"
                            : game.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {game.difficulty}
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => setActiveGame(game.id)} className="w-full sm:w-auto">
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "chatbot" && <AIChatbot />}

        {activeTab === "analytics" && <AnalyticsDashboard />}
      </div>
    </div>
  )
}
