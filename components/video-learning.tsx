"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Youtube, Brain, Clock, Eye, BookOpen, Sparkles } from "lucide-react"

interface VideoResult {
  id: string
  title: string
  channel: string
  duration: string
  views: string
  thumbnail: string
  description: string
  publishedAt: string
  summary?: string
}

export function VideoLearning() {
  const { user, updateUserProgress } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<VideoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null)
  const [generatingSummary, setGeneratingSummary] = useState(false)

  // Mock YouTube API response for demo purposes
  const mockYouTubeSearch = async (query: string): Promise<VideoResult[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockVideos: VideoResult[] = [
      {
        id: "dQw4w9WgXcQ",
        title: `${query} - Complete Tutorial for Beginners`,
        channel: "EduChannel Pro",
        duration: "15:42",
        views: "2.3M views",
        thumbnail: "/educational-video-thumbnail.png",
        description: `Learn everything about ${query} in this comprehensive tutorial. Perfect for students and beginners.`,
        publishedAt: "2 weeks ago",
      },
      {
        id: "abc123def",
        title: `Advanced ${query} Concepts Explained`,
        channel: "Science Academy",
        duration: "22:15",
        views: "890K views",
        thumbnail: "/science-education-video.jpg",
        description: `Deep dive into advanced concepts of ${query}. Includes examples and practice problems.`,
        publishedAt: "1 month ago",
      },
      {
        id: "xyz789ghi",
        title: `${query} in Real Life Applications`,
        channel: "Practical Learning",
        duration: "18:30",
        views: "1.5M views",
        thumbnail: "/practical-learning-video.jpg",
        description: `Discover how ${query} is used in real-world scenarios and everyday life.`,
        publishedAt: "3 days ago",
      },
      {
        id: "mno456pqr",
        title: `Interactive ${query} Workshop`,
        channel: "Learn Together",
        duration: "35:20",
        views: "650K views",
        thumbnail: "/interactive-workshop-video.jpg",
        description: `Join our interactive workshop to master ${query} through hands-on activities.`,
        publishedAt: "1 week ago",
      },
    ]

    return mockVideos
  }

  // Mock AI summarization
  const generateAISummary = async (video: VideoResult): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const summaries = [
      `This video provides a comprehensive introduction to ${searchQuery}. Key topics covered include fundamental concepts, practical applications, and step-by-step examples. The instructor explains complex ideas in simple terms, making it perfect for Grade ${user?.grade} students. Important takeaways: understanding the basics, recognizing patterns, and applying knowledge to solve problems.`,

      `An excellent educational resource that breaks down ${searchQuery} into digestible segments. The video covers theoretical foundations, real-world examples, and interactive demonstrations. Students will learn essential concepts, problem-solving techniques, and practical applications. Recommended for building strong foundational knowledge in this subject area.`,

      `This tutorial offers a structured approach to learning ${searchQuery}. The content is well-organized with clear explanations, visual aids, and practice exercises. Key learning objectives include concept mastery, skill development, and critical thinking. Perfect for students looking to deepen their understanding and improve their academic performance.`,
    ]

    return summaries[Math.floor(Math.random() * summaries.length)]
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const results = await mockYouTubeSearch(searchQuery)
      setVideos(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoSelect = async (video: VideoResult) => {
    setSelectedVideo(video)
    setGeneratingSummary(true)

    try {
      const summary = await generateAISummary(video)
      setSelectedVideo({ ...video, summary })
      // Award XP for watching educational content
      updateUserProgress(10)
    } catch (error) {
      console.error("Summary generation failed:", error)
    } finally {
      setGeneratingSummary(false)
    }
  }

  const suggestedTopics = [
    "Algebra Basics",
    "Photosynthesis",
    "World War 2",
    "Python Programming",
    "Chemical Reactions",
    "Shakespeare",
    "Geometry",
    "Climate Change",
  ]

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            AI-Powered Video Learning
          </CardTitle>
          <CardDescription>
            Search for any educational topic and get curated videos with AI-generated summaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter any topic you want to learn about..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Suggested Topics */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggested topics for Grade {user?.grade}:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(topic)
                    handleSearch()
                  }}
                  className="text-xs"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Results */}
      {videos.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{video.channel}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.publishedAt}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                <Button size="sm" onClick={() => handleVideoSelect(video)} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Get AI Summary
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Video with AI Summary */}
      {selectedVideo && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI Summary & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedVideo.thumbnail || "/placeholder.svg"}
                  alt={selectedVideo.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">{selectedVideo.title}</h3>
                  <p className="text-sm text-gray-600">{selectedVideo.channel}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedVideo.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {selectedVideo.views}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h4 className="font-semibold">AI-Generated Summary</h4>
                  <Badge variant="secondary">+10 XP</Badge>
                </div>

                {generatingSummary ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-2 mt-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-sm text-gray-600">Generating AI summary...</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedVideo.summary}</p>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <Button className="w-full" size="sm">
                    <Youtube className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add to Study List
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {videos.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Learn?</h3>
            <p className="text-gray-600 mb-4">
              Search for any topic and discover educational videos with AI-powered summaries
            </p>
            <p className="text-sm text-gray-500">
              Try searching for subjects like "photosynthesis", "algebra", or "world history"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
