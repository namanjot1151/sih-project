"use client"
import { AuthProvider } from "@/contexts/auth-context"
import { LearningPlatform } from "@/components/learning-platform"

export default function HomePage() {
  return (
    <AuthProvider>
      <LearningPlatform />
    </AuthProvider>
  )
}
