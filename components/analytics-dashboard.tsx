"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Target, Clock, Award, BookOpen, Brain, Zap, Star, Flame } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface LearningData {
  date: string
  xp: number
  gamesPlayed: number
  videosWatched: number
  timeSpent: number
}

interface SubjectProgress {
  subject: string
  progress: number
  xp: number
  color: string
}

export function AnalyticsDashboard() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("7d")
  const [learningData, setLearningData] = useState<LearningData[]>([])
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([])

  useEffect(() => {
    // Generate mock analytics data
    const generateLearningData = () => {
      const data: LearningData[] = []
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        data.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          xp: Math.floor(Math.random() * 100) + 20,
          gamesPlayed: Math.floor(Math.random() * 5) + 1,
          videosWatched: Math.floor(Math.random() * 3) + 1,
          timeSpent: Math.floor(Math.random() * 60) + 15,
        })
      }

      setLearningData(data)
    }

    const generateSubjectProgress = () => {
      const subjects: SubjectProgress[] = [
        { subject: "Mathematics", progress: 78, xp: 1250, color: "#3B82F6" },
        { subject: "Science", progress: 65, xp: 980, color: "#10B981" },
        { subject: "English", progress: 82, xp: 1340, color: "#8B5CF6" },
        { subject: "History", progress: 45, xp: 720, color: "#F59E0B" },
        { subject: "Geography", progress: 58, xp: 890, color: "#06B6D4" },
        { subject: "Computer Science", progress: 35, xp: 560, color: "#6366F1" },
      ]

      setSubjectProgress(subjects)
    }

    generateLearningData()
    generateSubjectProgress()
  }, [timeRange])

  const totalXP = learningData.reduce((sum, day) => sum + day.xp, 0)
  const totalGames = learningData.reduce((sum, day) => sum + day.gamesPlayed, 0)
  const totalVideos = learningData.reduce((sum, day) => sum + day.videosWatched, 0)
  const totalTime = learningData.reduce((sum, day) => sum + day.timeSpent, 0)
  const averageDaily = Math.round(totalXP / learningData.length)

  const achievements = [
    { name: "First Steps", description: "Complete your first game", earned: true, icon: "🎯" },
    { name: "Math Wizard", description: "Score 100% in Math Quest", earned: true, icon: "🧙‍♂️" },
    { name: "Bookworm", description: "Watch 10 educational videos", earned: true, icon: "📚" },
    { name: "Streak Master", description: "Maintain 7-day learning streak", earned: true, icon: "🔥" },
    { name: "Knowledge Seeker", description: "Explore all subjects", earned: false, icon: "🔍" },
    { name: "Champion", description: "Reach Level 10", earned: false, icon: "🏆" },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Analytics</h2>
          <p className="text-gray-600">Track your progress and achievements</p>
        </div>
        <div className="flex gap-2">
          {[
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "90d", label: "90 Days" },
          ].map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total XP Earned</p>
                <p className="text-3xl font-bold">{totalXP.toLocaleString()}</p>
                <p className="text-sm text-blue-200">+{averageDaily}/day avg</p>
              </div>
              <Zap className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Games Completed</p>
                <p className="text-3xl font-bold">{totalGames}</p>
                <p className="text-sm text-green-200">Last {timeRange}</p>
              </div>
              <Brain className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Videos Watched</p>
                <p className="text-3xl font-bold">{totalVideos}</p>
                <p className="text-sm text-purple-200">Educational content</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Time Spent</p>
                <p className="text-3xl font-bold">{Math.round(totalTime / 60)}h</p>
                <p className="text-sm text-orange-200">{totalTime} minutes</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              XP Progress Over Time
            </CardTitle>
            <CardDescription>Daily experience points earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={learningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Activity Breakdown
            </CardTitle>
            <CardDescription>Games played vs videos watched</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={learningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="gamesPlayed" fill="#10B981" name="Games" />
                  <Bar dataKey="videosWatched" fill="#8B5CF6" name="Videos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Subject Progress
          </CardTitle>
          <CardDescription>Your progress across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjectProgress.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="font-medium">{subject.subject}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{subject.xp} XP</Badge>
                    <span className="text-sm text-gray-600">{subject.progress}%</span>
                  </div>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Unlock badges by completing challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      {achievement.earned && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Earned
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Learning Insights
          </CardTitle>
          <CardDescription>AI-powered recommendations for your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Strong Performance</h4>
                  <p className="text-sm text-blue-700">
                    You're excelling in English and Mathematics! Your consistent practice is paying off.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900">Focus Area</h4>
                  <p className="text-sm text-orange-700">
                    Consider spending more time on History and Computer Science to balance your learning.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <Flame className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Streak Bonus</h4>
                  <p className="text-sm text-green-700">
                    You're on a {user?.streak}-day learning streak! Keep it up to earn bonus XP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
