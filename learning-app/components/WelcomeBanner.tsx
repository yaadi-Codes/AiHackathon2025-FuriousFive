"use client"

import { useAuth } from "@/hooks/use-auth"

export default function WelcomeBanner() {
  const { user } = useAuth()

  return (
    <div className="mb-8 animate-fade-up">
      <h1 className="text-4xl font-bold mb-2 gradient-text">Hi, {user?.name || "Learner"}!</h1>
      <p className="text-muted-foreground text-lg">Let's learn something new today!</p>
    </div>
  )
}

