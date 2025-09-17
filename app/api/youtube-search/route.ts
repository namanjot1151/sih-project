export async function POST(req: Request) {
  try {
    const { query, maxResults = 12 } = await req.json()

    // Mock YouTube API response for demo (in production, use real YouTube Data API)
    const mockResults = [
      {
        id: { videoId: "dQw4w9WgXcQ" },
        snippet: {
          title: `${query} - Complete Tutorial`,
          description: `Learn everything about ${query} in this comprehensive tutorial. Perfect for students and beginners.`,
          thumbnails: { medium: { url: "/educational-video-thumbnail.png" } },
          channelTitle: "EduChannel",
          publishedAt: "2024-01-15T10:00:00Z",
        },
        statistics: { viewCount: "1234567" },
      },
      {
        id: { videoId: "abc123def456" },
        snippet: {
          title: `Advanced ${query} Concepts Explained`,
          description: `Deep dive into advanced ${query} concepts with real-world examples and practical applications.`,
          thumbnails: { medium: { url: "/science-education-video.jpg" } },
          channelTitle: "Science Academy",
          publishedAt: "2024-01-10T14:30:00Z",
        },
        statistics: { viewCount: "987654" },
      },
      {
        id: { videoId: "xyz789ghi012" },
        snippet: {
          title: `${query} for Beginners - Step by Step`,
          description: `Start your ${query} journey with this beginner-friendly guide. No prior knowledge required!`,
          thumbnails: { medium: { url: "/practical-learning-video.jpg" } },
          channelTitle: "Learning Hub",
          publishedAt: "2024-01-05T09:15:00Z",
        },
        statistics: { viewCount: "2345678" },
      },
    ]

    return Response.json({ items: mockResults })
  } catch (error) {
    console.error("YouTube Search Error:", error)
    return Response.json({ error: "Failed to search videos" }, { status: 500 })
  }
}
