"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  grade: number
  xp: number
  level: number
  streak: number
  avatar: string
  achievements: string[]
  completedLessons: string[]
  currentSubject: string
  studyTime: number
  lastActive: Date
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, grade: number) => Promise<boolean>
  logout: () => void
  updateUserProgress: (xpGained: number, lessonId?: string, subject?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("learning-platform-user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        const validatedUser = {
          ...parsedUser,
          achievements: Array.isArray(parsedUser.achievements) ? parsedUser.achievements : [],
          completedLessons: Array.isArray(parsedUser.completedLessons) ? parsedUser.completedLessons : [],
          lastActive: new Date(parsedUser.lastActive || Date.now()),
        }
        setUser(validatedUser)
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        // Clear corrupted data
        localStorage.removeItem("learning-platform-user")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const mockUser: User = {
      id: "1",
      name: "Student User",
      email,
      grade: 8,
      xp: 1250,
      level: 5,
      streak: 7,
      avatar: "/student-avatar.png",
      achievements: ["First Steps", "Math Wizard", "Word Master"],
      completedLessons: ["algebra-basics", "photosynthesis", "world-war-1"],
      currentSubject: "Mathematics",
      studyTime: 120, // minutes
      lastActive: new Date(),
    }

    setUser(mockUser)
    localStorage.setItem("learning-platform-user", JSON.stringify(mockUser))
    return true
  }

  const register = async (name: string, email: string, password: string, grade: number): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      grade,
      xp: 0,
      level: 1,
      streak: 0,
      avatar: "/student-avatar.png",
      achievements: [],
      completedLessons: [],
      currentSubject: "Mathematics",
      studyTime: 0,
      lastActive: new Date(),
    }

    setUser(newUser)
    localStorage.setItem("learning-platform-user", JSON.stringify(newUser))
    return true
  }

  const updateUserProgress = (xpGained: number, lessonId?: string, subject?: string) => {
    if (!user) return

    const newXp = user.xp + xpGained
    const newLevel = Math.floor(newXp / 250) + 1
    const currentAchievements = Array.isArray(user.achievements) ? user.achievements : []
    const currentCompletedLessons = Array.isArray(user.completedLessons) ? user.completedLessons : []
    const newAchievements = [...currentAchievements]
    const newCompletedLessons = [...currentCompletedLessons]

    // Add lesson to completed if provided
    if (lessonId && !newCompletedLessons.includes(lessonId)) {
      newCompletedLessons.push(lessonId)
    }

    // Check for new achievements
    if (newLevel > user.level && !newAchievements.includes("Level Up Master")) {
      newAchievements.push("Level Up Master")
    }
    if (newXp >= 1000 && !newAchievements.includes("XP Collector")) {
      newAchievements.push("XP Collector")
    }
    if (user.streak >= 10 && !newAchievements.includes("Streak Champion")) {
      newAchievements.push("Streak Champion")
    }

    const updatedUser = {
      ...user,
      xp: newXp,
      level: newLevel,
      streak: user.streak + 1,
      achievements: newAchievements,
      completedLessons: newCompletedLessons,
      currentSubject: subject || user.currentSubject,
      studyTime: user.studyTime + 5, // Add 5 minutes per activity
      lastActive: new Date(),
    }

    setUser(updatedUser)
    localStorage.setItem("learning-platform-user", JSON.stringify(updatedUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("learning-platform-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserProgress }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
