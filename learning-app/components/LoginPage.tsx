"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, BookOpen } from "lucide-react"

interface LoginPageProps {
  onLogin: (userData: { name: string; userId: string }) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    if (!password.trim()) {
      setError("Please enter your password")
      return
    }

    setIsLoading(true)
    setError(null)

    // Simulate authentication process
    setTimeout(() => {
      // In a real app, you would validate credentials against a backend
      // For this demo, we'll just accept any valid input

      // Generate a simple user ID
      const userId = `user_${Date.now()}`

      // Call the onLogin callback with user data
      onLogin({ name, userId })

      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-vibrant-purple opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-vibrant-teal opacity-10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md border-0 shadow-xl gradient-border">
        <div className="absolute inset-0 bg-white rounded-lg z-0"></div>
        <CardHeader className="space-y-1 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vibrant-purple to-vibrant-pink flex items-center justify-center animate-pulse-scale">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center gradient-text">INTELLI</CardTitle>
          <CardDescription className="text-center text-base">
            Enter your details to access your learning dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-vibrant-purple font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="border-2 border-purple-100 focus:border-vibrant-purple transition-colors"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-vibrant-purple font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 border-purple-100 focus:border-vibrant-purple transition-colors"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-vibrant-purple to-vibrant-pink hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col relative z-10">
          <p className="text-xs text-center text-muted-foreground mt-4">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

