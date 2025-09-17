"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthScreen } from "@/components/auth-screen"
import { Dashboard } from "@/components/dashboard"

export function LearningPlatform() {
  const { user } = useAuth()

  if (!user) {
    return <AuthScreen />
  }

  return <Dashboard />
}
