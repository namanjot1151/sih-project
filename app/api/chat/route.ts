import { generateText } from "ai"
import { google } from "@ai-sdk/google"

process.env.GOOGLE_GENERATIVE_AI_API_KEY = "AIzaSyDLGo0L_FZcobele_kd-sH0fuvZRd9SZ3g"

export async function POST(req: Request) {
  try {
    const { message, subject, context, conversationHistory } = await req.json()

    // Build conversation context from history
    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext =
        "\n\nPrevious conversation:\n" +
        conversationHistory.map((msg: any) => `${msg.type === "user" ? "Student" : "AI"}: ${msg.content}`).join("\n")
    }

    const systemPrompt = `You are an AI Study Buddy for students powered by Gemini AI. You help with learning across all subjects including Math, Science, English, History, and more. 

Key guidelines:
- Explain concepts in simple, age-appropriate language
- Use examples and analogies to make learning fun
- Encourage students and build confidence
- Break down complex topics into smaller steps
- Create practice questions when helpful
- Adapt your explanations to the student's level
- Remember previous parts of the conversation and build upon them
- Be conversational and engaging like ChatGPT
- Generate endless questions and content when requested
- Provide detailed explanations with step-by-step reasoning
- Use educational examples from real-world applications
- Create interactive learning experiences through conversation

Educational Focus Areas:
- Mathematics: Algebra, geometry, calculus, statistics (grades 1-12)
- Science: Physics, chemistry, biology, earth science (grades 1-12)
- History: World history, American history, ancient civilizations
- Geography: Physical geography, human geography, world cultures
- English: Grammar, vocabulary, reading comprehension, literature

Current subject focus: ${subject || "General"}
Context: ${context || "educational_assistant"}

Be encouraging, patient, and make learning enjoyable! Remember to maintain conversation flow and context like ChatGPT.${conversationContext}`

    const { text } = await generateText({
      model: google("gemini-1.5-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyDLGo0L_FZcobele_kd-sH0fuvZRd9SZ3g",
      }),
      system: systemPrompt,
      prompt: message,
      maxTokens: 1000, // Increased token limit for more detailed ChatGPT-like responses
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Chat API Error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
