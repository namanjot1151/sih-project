import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// process.env.GOOGLE_GENERATIVE_AI_API_KEY = "AIzaSyDLGo0L_FZcobele_kd-sH0fuvZRd9SZ3g"

export async function POST(req: Request) {
  try {
    const { subject, difficulty, gameType, grade, count = 1, customPrompt, previousQuestions } = await req.json()

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.log("[v0] No API key available, using fallback questions")
      const fallbackQuestion = generateEnhancedFallbackQuestion(subject, difficulty, gameType, grade, count)
      return Response.json(fallbackQuestion)
    }

    const systemPrompt = `You are an AI question generator for an endless gamified learning platform. Generate educational questions that are:

1. ENDLESS: Create unique, varied questions that never repeat
2. ADAPTIVE: Scale difficulty progressively (Level ${difficulty})
3. ENGAGING: Make questions fun and game-appropriate
4. EDUCATIONAL: Ensure learning value and accuracy
5. PROGRESSIVE: Each level should be noticeably harder than the previous

Subject: ${subject}
Difficulty Level: ${difficulty} (scales from 1-20+ for endless gameplay)
Game Type: ${gameType}
Grade Level: ${grade || 6}
Questions to Generate: ${count}
Previous Questions to AVOID: ${previousQuestions?.slice(-10).join(", ") || "None"}

${customPrompt ? `CUSTOM INSTRUCTIONS: ${customPrompt}` : ""}

Educational Game-Specific Guidelines:
- math-quest: Progressive math problems from basic arithmetic to advanced calculus
- word-builder: Vocabulary building with increasing word complexity and obscurity
- physics-forge: Physics principles (torque, momentum, energy) for blacksmithing simulation
- elemental-alchemist: Chemistry elements, compounds, periodic table trends
- ecosystem-architect: Biology, ecology, food chains, climate change impacts
- timeline-tactician: Historical events, cause-and-effect, primary sources
- word-weaver-worlds: Grammar, synonyms, literary genres, essay structure
- quiz-runner: Quick, action-oriented questions for running obstacles
- puzzle-tower: Logic and reasoning challenges for tower climbing
- word-ninja: Vocabulary and language skills for word slicing
- math-invaders: Fast mental math problems for space shooting
- knowledge-platformer: Mixed subject questions for platform jumping
- memory-match: Fact-based questions with clear Q&A pairs
- quiz-battle-arena: Competitive knowledge questions for combat
- treasure-hunt: Geography and exploration themes for maze navigation

Subject-Specific Focus Areas:
- Mathematics: Arithmetic → Algebra → Geometry → Trigonometry → Calculus → Advanced Math
- Science: Basic concepts → Scientific method → Physics/Chemistry/Biology → Advanced theories
- History: Ancient history → Medieval → Modern → Contemporary → Complex analysis
- Geography: Basic locations → Physical geography → Human geography → Geopolitics
- English: Basic grammar → Vocabulary → Literature → Advanced composition → Critical analysis

Progressive Difficulty Scaling (endless progression):
- Levels 1-2: Elementary concepts (Grade K-2)
- Levels 3-4: Basic fundamentals (Grade 3-4)
- Levels 5-6: Intermediate applications (Grade 5-6)
- Levels 7-8: Middle school concepts (Grade 7-8)
- Levels 9-10: High school level (Grade 9-10)
- Levels 11-12: Advanced high school (Grade 11-12)
- Levels 13-15: College introductory level
- Levels 16-18: College advanced level
- Levels 19-20: Graduate/Expert level
- Levels 20+: Master level with interdisciplinary challenges

CRITICAL: Return ONLY valid JSON. For single questions use this format:
{
  "question": "Clear, engaging question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": "Option 1",
  "explanation": "Brief, educational explanation",
  "difficulty": ${difficulty},
  "category": "Subject category"
}

For multiple questions, return:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct": "A",
      "explanation": "Explanation",
      "difficulty": ${difficulty},
      "category": "Category"
    }
  ]
}

For word-builder games, use this format:
{
  "word": "EXAMPLE",
  "definition": "Clear definition of the word",
  "category": "Word category like Animals, Science, etc",
  "difficulty": ${difficulty}
}`

    let attempts = 0
    const maxAttempts = 2 // Reduced attempts to avoid quota issues

    while (attempts < maxAttempts) {
      try {
        const { text } = await generateText({
          model: google("gemini-1.5-flash", {
            apiKey: apiKey,
          }),
          system: systemPrompt,
          prompt:
            customPrompt ||
            `Generate ${count} unique Level ${difficulty} ${subject} question${count > 1 ? "s" : ""} for ${gameType}. Make ${count > 1 ? "them" : "it"} progressively challenging and different from previous questions. Focus on grade ${grade || 6} appropriate content with endless scalability.`,
          maxTokens: count > 1 ? 1000 : 500,
        })

        let questionData
        try {
          const cleanedText = text.trim().replace(/```json\n?|\n?```/g, "")
          questionData = JSON.parse(cleanedText)

          if (gameType === "word-builder") {
            if (!questionData.word || !questionData.definition) {
              throw new Error("Missing required word-builder fields")
            }
          } else if (count > 1) {
            if (!questionData.questions || !Array.isArray(questionData.questions)) {
              throw new Error("Missing questions array for multiple questions")
            }
          } else {
            if (!questionData.question || !questionData.options || !questionData.correct || !questionData.explanation) {
              throw new Error("Missing required question fields")
            }
            if (!Array.isArray(questionData.options) || questionData.options.length !== 4) {
              throw new Error("Invalid options format")
            }
          }

          return Response.json(questionData)
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError)
          // If parsing fails, use fallback
          break
        }
      } catch (apiError: any) {
        attempts++
        console.error(`API attempt ${attempts} failed:`, apiError.message)

        if (
          apiError.message?.includes("quota") ||
          apiError.message?.includes("exceeded") ||
          apiError.message?.includes("billing")
        ) {
          console.log("[v0] API quota exceeded, switching to fallback questions")
          break // Don't retry on quota errors
        }

        if (apiError.message?.includes("rate") && attempts < maxAttempts) {
          const delay = Math.pow(2, attempts) * 1000 // 1s, 2s, 4s...
          console.log(`[v0] Rate limited, waiting ${delay}ms before retry`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        // If it's the last attempt or a non-retryable error, break
        if (attempts >= maxAttempts) {
          break
        }
      }
    }

    console.log("[v0] Using enhanced fallback question generation")
    const fallbackQuestion = generateEnhancedFallbackQuestion(subject, difficulty, gameType, grade, count)
    return Response.json(fallbackQuestion)
  } catch (error: any) {
    console.error("Question Generation Error:", error)

    let requestBody
    try {
      requestBody = await req.json()
    } catch {
      requestBody = {}
    }

    const fallbackQuestion = generateEnhancedFallbackQuestion(
      requestBody?.subject || "Mathematics",
      requestBody?.difficulty || 1,
      requestBody?.gameType || "quiz-runner",
      requestBody?.grade || 6,
      requestBody?.count || 1,
    )
    return Response.json(fallbackQuestion)
  }
}

function generateEnhancedFallbackQuestion(subject: string, difficulty: number, gameType: string, grade = 6, count = 1) {
  if (gameType === "word-builder") {
    return generateWordBuilderFallback(difficulty, grade)
  }

  const questionBank = {
    Mathematics: [
      {
        levels: [1, 2],
        questions: [
          {
            question: "What is 3 + 4?",
            options: ["7", "6", "8", "5"],
            correct: "7",
            explanation: "3 + 4 = 7",
            difficulty: 1,
            category: "Basic Addition",
          },
          {
            question: "What is 9 - 5?",
            options: ["4", "3", "5", "6"],
            correct: "4",
            explanation: "9 - 5 = 4",
            difficulty: 2,
            category: "Basic Subtraction",
          },
          {
            question: "What is 2 + 2?",
            options: ["4", "3", "5", "6"],
            correct: "4",
            explanation: "2 + 2 = 4",
            difficulty: 1,
            category: "Basic Addition",
          },
          {
            question: "What is 10 - 3?",
            options: ["7", "6", "8", "5"],
            correct: "7",
            explanation: "10 - 3 = 7",
            difficulty: 2,
            category: "Basic Subtraction",
          },
        ],
      },
      {
        levels: [3, 4, 5],
        questions: [
          {
            question: "What is 6 × 7?",
            options: ["42", "41", "43", "40"],
            correct: "42",
            explanation: "6 × 7 = 42",
            difficulty: 4,
            category: "Multiplication",
          },
          {
            question: "What is 48 ÷ 6?",
            options: ["8", "7", "9", "6"],
            correct: "8",
            explanation: "48 ÷ 6 = 8",
            difficulty: 5,
            category: "Division",
          },
          {
            question: "What is 5 × 8?",
            options: ["40", "35", "45", "30"],
            correct: "40",
            explanation: "5 × 8 = 40",
            difficulty: 4,
            category: "Multiplication",
          },
          {
            question: "What is 36 ÷ 4?",
            options: ["9", "8", "10", "7"],
            correct: "9",
            explanation: "36 ÷ 4 = 9",
            difficulty: 5,
            category: "Division",
          },
        ],
      },
      {
        levels: [6, 7, 8, 9],
        questions: [
          {
            question: "What is 15% of 200?",
            options: ["30", "25", "35", "20"],
            correct: "30",
            explanation: "15% of 200 = 0.15 × 200 = 30",
            difficulty: 7,
            category: "Percentages",
          },
          {
            question: "If 2x + 5 = 13, what is x?",
            options: ["4", "3", "5", "6"],
            correct: "4",
            explanation: "2x = 13 - 5 = 8, so x = 4",
            difficulty: 8,
            category: "Algebra",
          },
          {
            question: "What is 25% of 80?",
            options: ["20", "15", "25", "30"],
            correct: "20",
            explanation: "25% of 80 = 0.25 × 80 = 20",
            difficulty: 7,
            category: "Percentages",
          },
          {
            question: "If 3x - 2 = 10, what is x?",
            options: ["4", "3", "5", "6"],
            correct: "4",
            explanation: "3x = 10 + 2 = 12, so x = 4",
            difficulty: 8,
            category: "Algebra",
          },
        ],
      },
      {
        levels: [10, 11, 12, 13, 14, 15],
        questions: [
          {
            question: "What is the derivative of x²?",
            options: ["2x", "x", "2", "x²"],
            correct: "2x",
            explanation: "Using the power rule: d/dx(x²) = 2x",
            difficulty: 12,
            category: "Calculus",
          },
          {
            question: "What is sin(90°)?",
            options: ["1", "0", "√2/2", "-1"],
            correct: "1",
            explanation: "sin(90°) = 1 in the unit circle",
            difficulty: 10,
            category: "Trigonometry",
          },
          {
            question: "What is the integral of 2x?",
            options: ["x² + C", "2x² + C", "x + C", "2 + C"],
            correct: "x² + C",
            explanation: "∫2x dx = x² + C",
            difficulty: 12,
            category: "Calculus",
          },
          {
            question: "What is cos(0°)?",
            options: ["1", "0", "√2/2", "-1"],
            correct: "1",
            explanation: "cos(0°) = 1 in the unit circle",
            difficulty: 10,
            category: "Trigonometry",
          },
        ],
      },
    ],
    Science: [
      {
        levels: [1, 2, 3],
        questions: [
          {
            question: "What do plants need to make food?",
            options: ["Sunlight", "Darkness", "Cold", "Noise"],
            correct: "Sunlight",
            explanation: "Plants use sunlight in photosynthesis to make their own food",
            difficulty: 2,
            category: "Biology",
          },
          {
            question: "How many legs does a spider have?",
            options: ["8", "6", "10", "4"],
            correct: "8",
            explanation: "Spiders are arachnids and have 8 legs",
            difficulty: 2,
            category: "Biology",
          },
        ],
      },
      {
        levels: [4, 5, 6, 7],
        questions: [
          {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2", "NaCl"],
            correct: "H2O",
            explanation: "Water is composed of 2 hydrogen atoms and 1 oxygen atom",
            difficulty: 5,
            category: "Chemistry",
          },
          {
            question: "What gas do plants release during photosynthesis?",
            options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
            correct: "Oxygen",
            explanation: "Plants release oxygen as a byproduct of photosynthesis",
            difficulty: 6,
            category: "Biology",
          },
        ],
      },
    ],
    History: [
      {
        levels: [1, 2, 3, 4],
        questions: [
          {
            question: "Who was the first President of the United States?",
            options: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"],
            correct: "George Washington",
            explanation: "George Washington was the first President from 1789-1797",
            difficulty: 3,
            category: "American History",
          },
        ],
      },
    ],
    English: [
      {
        levels: [1, 2, 3, 4],
        questions: [
          {
            question: "What is a noun?",
            options: ["A person, place, or thing", "An action word", "A describing word", "A connecting word"],
            correct: "A person, place, or thing",
            explanation: "A noun is a word that names a person, place, or thing",
            difficulty: 2,
            category: "Grammar",
          },
        ],
      },
    ],
  }

  const subjectQuestions = questionBank[subject as keyof typeof questionBank] || questionBank.Mathematics
  const levelGroup =
    subjectQuestions.find((group) => group.levels.some((level) => Math.abs(level - difficulty) <= 2)) ||
    subjectQuestions[0]

  const questions = levelGroup.questions

  const availableQuestions = [...questions]
  const selectedQuestions = []

  for (let i = 0; i < count && availableQuestions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    const selectedQuestion = availableQuestions.splice(randomIndex, 1)[0]
    selectedQuestions.push({
      ...selectedQuestion,
      difficulty: difficulty,
    })
  }

  if (count > 1) {
    return {
      questions: selectedQuestions,
    }
  }

  return (
    selectedQuestions[0] || {
      question: "What is 1 + 1?",
      options: ["2", "1", "3", "0"],
      correct: "2",
      explanation: "1 + 1 = 2",
      difficulty: difficulty,
      category: "Basic Math",
    }
  )
}

function generateWordBuilderFallback(difficulty: number, grade: number) {
  const wordDatabase = {
    1: [
      { word: "CAT", definition: "A small furry pet that meows", category: "Animals" },
      { word: "DOG", definition: "A loyal pet that barks", category: "Animals" },
      { word: "SUN", definition: "The bright star in our sky", category: "Nature" },
      { word: "TREE", definition: "A tall plant with branches and leaves", category: "Nature" },
      { word: "BOOK", definition: "Something you read with pages", category: "Objects" },
    ],
    5: [
      { word: "ELEPHANT", definition: "Large gray animal with trunk", category: "Animals" },
      { word: "RAINBOW", definition: "Colorful arc in the sky", category: "Nature" },
      { word: "COMPUTER", definition: "Electronic device for work", category: "Technology" },
      { word: "BUTTERFLY", definition: "Colorful flying insect", category: "Animals" },
      { word: "MOUNTAIN", definition: "Very tall natural land formation", category: "Geography" },
    ],
    10: [
      { word: "MAGNIFICENT", definition: "Extremely beautiful or impressive", category: "Adjectives" },
      { word: "PHOTOSYNTHESIS", definition: "Process plants use to make food from sunlight", category: "Science" },
      { word: "DEMOCRACY", definition: "Government by the people", category: "Social Studies" },
      { word: "ECOSYSTEM", definition: "Community of living and non-living things", category: "Science" },
      { word: "LITERATURE", definition: "Written works of artistic value", category: "English" },
    ],
    15: [
      { word: "SERENDIPITOUS", definition: "Occurring by happy chance", category: "Advanced Vocabulary" },
      { word: "METAMORPHOSIS", definition: "Complete change of form or nature", category: "Science" },
      { word: "JUXTAPOSITION", definition: "Placing things side by side for contrast", category: "Literature" },
      { word: "QUINTESSENTIAL", definition: "Most perfect example of a quality", category: "Advanced Vocabulary" },
      { word: "PHOTOSYNTHETIC", definition: "Relating to the process of making food from light", category: "Science" },
    ],
  }

  const difficultyLevel = difficulty <= 3 ? 1 : difficulty <= 8 ? 5 : difficulty <= 12 ? 10 : 15
  const wordList = wordDatabase[difficultyLevel as keyof typeof wordDatabase]
  const selectedWord = wordList[Math.floor(Math.random() * wordList.length)]

  return {
    ...selectedWord,
    difficulty: difficulty,
    scrambled: selectedWord.word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join(""),
    hint: `This ${selectedWord.category.toLowerCase()} word has ${selectedWord.word.length} letters`,
  }
}
