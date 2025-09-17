"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Play, Clock, Eye, BookOpen, Sparkles, Youtube } from "lucide-react"

interface VideoResult {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  channel: string
  uploadDate: string
  subject: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  summary?: string
}

export function VideoBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<VideoResult[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  // Mock video data for demonstration
  const mockVideos: VideoResult[] = [
    {
      id: "1",
      title: "Introduction to Algebra - Solving Linear Equations",
      description: "Learn the basics of algebra and how to solve linear equations step by step. Perfect for beginners!",
      thumbnail: "/educational-video-thumbnail.png",
      duration: "12:34",
      views: "1.2M",
      channel: "Math Academy",
      uploadDate: "2 weeks ago",
      subject: "Mathematics",
      difficulty: "Beginner",
    },
    {
      id: "2",
      title: "Photosynthesis Explained - How Plants Make Food",
      description: "Discover the amazing process of photosynthesis and how plants convert sunlight into energy.",
      thumbnail: "/science-education-video.jpg",
      duration: "8:45",
      views: "856K",
      channel: "Science Explorer",
      uploadDate: "1 month ago",
      subject: "Biology",
      difficulty: "Intermediate",
    },
    {
      id: "3",
      title: "World War II Timeline - Key Events and Battles",
      description: "A comprehensive overview of World War II, covering major battles, key figures, and turning points.",
      thumbnail: "/practical-learning-video.jpg",
      duration: "15:22",
      views: "2.1M",
      channel: "History Hub",
      uploadDate: "3 weeks ago",
      subject: "History",
      difficulty: "Intermediate",
    },
    {
      id: "4",
      title: "Creative Writing Tips - Building Compelling Characters",
      description: "Learn how to create memorable characters that readers will love in your creative writing.",
      thumbnail: "/interactive-workshop-video.jpg",
      duration: "10:18",
      views: "445K",
      channel: "Writing Workshop",
      uploadDate: "1 week ago",
      subject: "English",
      difficulty: "Advanced",
    },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    try {
      const response = await fetch("/api/youtube-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          maxResults: 12,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to search videos")
      }

      const data = await response.json()

      // Transform YouTube API response to our format
      const transformedResults: VideoResult[] = data.items.map((item: any, index: number) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: "10:" + String(Math.floor(Math.random() * 60)).padStart(2, "0"), // Mock duration
        views: (Number.parseInt(item.statistics?.viewCount || "0") / 1000).toFixed(0) + "K",
        channel: item.snippet.channelTitle,
        uploadDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
        subject: determineSubject(item.snippet.title + " " + item.snippet.description),
        difficulty: ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)] as
          | "Beginner"
          | "Intermediate"
          | "Advanced",
      }))

      setSearchResults(transformedResults)
    } catch (error) {
      console.error("Search Error:", error)
      // Fallback to mock data
      const filteredVideos = mockVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.subject.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filteredVideos.length > 0 ? filteredVideos : mockVideos)
    } finally {
      setIsSearching(false)
    }
  }

  const determineSubject = (content: string): string => {
    const lowerContent = content.toLowerCase()
    if (lowerContent.includes("math") || lowerContent.includes("algebra") || lowerContent.includes("calculus"))
      return "Mathematics"
    if (lowerContent.includes("science") || lowerContent.includes("physics") || lowerContent.includes("chemistry"))
      return "Science"
    if (lowerContent.includes("biology") || lowerContent.includes("photosynthesis")) return "Biology"
    if (lowerContent.includes("history") || lowerContent.includes("war") || lowerContent.includes("ancient"))
      return "History"
    if (lowerContent.includes("english") || lowerContent.includes("writing") || lowerContent.includes("grammar"))
      return "English"
    return "General"
  }

  const generateSummary = async (video: VideoResult) => {
    setIsGeneratingSummary(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Please provide a detailed educational summary of this video: "${video.title}". Description: "${video.description}". Focus on key learning points, concepts covered, and who this would be perfect for.`,
          subject: video.subject,
          context: "video_summarization",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()
      const updatedVideo = { ...video, summary: data.response }
      setSelectedVideo(updatedVideo)
    } catch (error) {
      console.error("Summary Generation Error:", error)
      // Fallback to mock summary
      const mockSummary = `📚 **Educational Summary:**\n\nThis video covers important concepts in ${video.subject}. The content is well-structured and includes practical examples to help students understand the material better.\n\n**Perfect for:** Students looking to deepen their understanding of ${video.subject} concepts.\n\n**Main Takeaway:** Learning is most effective when concepts are explained clearly with real-world applications.`
      const updatedVideo = { ...video, summary: mockSummary }
      setSelectedVideo(updatedVideo)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const subjectColors = {
    Mathematics: "bg-blue-500",
    Biology: "bg-green-500",
    History: "bg-orange-500",
    English: "bg-purple-500",
    Science: "bg-teal-500",
    Physics: "bg-indigo-500",
    Chemistry: "bg-pink-500",
  }

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Youtube className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-2xl font-bold">Video Learning Browser</h2>
              <p className="text-gray-600">Search for educational videos and get AI-powered summaries</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for educational videos... (e.g., 'algebra', 'photosynthesis', 'world war')"
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {["algebra", "photosynthesis", "world war", "creative writing", "physics", "chemistry"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(term)
                  handleSearch()
                }}
                className="text-xs"
              >
                {term}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchResults.length > 0 && !isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <Badge
                    className={`${subjectColors[video.subject as keyof typeof subjectColors] || "bg-gray-500"} text-white`}
                  >
                    {video.subject}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2 line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="text-sm mb-3 line-clamp-2">{video.description}</CardDescription>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views}
                  </span>
                  <span>•</span>
                  <span>{video.uploadDate}</span>
                  <span>•</span>
                  <span>{video.channel}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={difficultyColors[video.difficulty]}>{video.difficulty}</Badge>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => generateSummary(video)}>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Summarize
                    </Button>
                    <Button size="sm" onClick={() => setSelectedVideo(video)}>
                      <Play className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player and Summary */}
      {selectedVideo && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <Youtube className="h-16 w-16 mx-auto mb-4 text-red-500" />
                    <p className="text-lg font-semibold">{selectedVideo.title}</p>
                    <p className="text-sm opacity-75 mt-2">Video would play here in a real implementation</p>
                    <Button
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        window.open(`https://www.youtube.com/watch?v=${selectedVideo.id}`, "_blank")
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Open in YouTube
                    </Button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-600 mb-4">{selectedVideo.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedVideo.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedVideo.duration}
                  </span>
                  <span>{selectedVideo.channel}</span>
                  <span>{selectedVideo.uploadDate}</span>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <h4 className="font-semibold">AI Summary</h4>
                      <Badge variant="secondary" className="text-xs">
                        Powered by Gemini
                      </Badge>
                    </div>

                    {isGeneratingSummary ? (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex items-center gap-2 mt-4">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <span className="text-sm text-gray-500 ml-2">Generating summary...</span>
                        </div>
                      </div>
                    ) : selectedVideo.summary ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-sm">{selectedVideo.summary}</div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          Click "Summarize" to get an AI-powered summary of this video
                        </p>
                        <Button onClick={() => generateSummary(selectedVideo)}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Summary
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchResults.length === 0 && !isSearching && searchQuery && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-gray-600 mb-4">
              Try searching for different keywords or browse our suggested topics above.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
