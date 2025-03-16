"use client"

import { useState, useEffect } from "react"
import { Gamepad, BookOpen, HelpCircle } from "lucide-react"
import Navbar from "@/components/Navbar"
import EducationButton from "@/components/EducationButton"
import WelcomeBanner from "@/components/WelcomeBanner"
import ResourceManager, { type ResourceFile } from "@/components/ResourceManager"
import SimplifyModal from "@/components/SimplifyModal"
import QuizModal from "@/components/QuizModal"
import GameModal from "@/components/GameModal"
import LoginPage from "@/components/LoginPage"
import { useToast } from "@/hooks/use-toast"
import { AuthProvider, useAuth } from "@/hooks/use-auth"

function LearningDashboard() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSimplifyModalOpen, setIsSimplifyModalOpen] = useState(false)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<ResourceFile | undefined>(undefined)

  const handleButtonClick = (feature: string) => {
    if (feature === "Simplify") {
      setSelectedResource(undefined)
      setIsSimplifyModalOpen(true)
    } else if (feature === "Quiz") {
      setSelectedResource(undefined)
      setIsQuizModalOpen(true)
    } else if (feature === "Games") {
      setSelectedResource(undefined)
      setIsGameModalOpen(true)
    } else {
      toast({
        title: `${feature} Feature Selected`,
        description: `You've selected the ${feature.toLowerCase()} feature. This will be implemented in the next version.`,
        duration: 3000,
      })
    }
  }

  const handleResourceAction = (resource: ResourceFile, action: "simplify" | "quiz" | "game") => {
    setSelectedResource(resource)

    if (action === "simplify") {
      setIsSimplifyModalOpen(true)
    } else if (action === "quiz") {
      setIsQuizModalOpen(true)
    } else if (action === "game") {
      setIsGameModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="colorful-background">
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-16">
        <WelcomeBanner />

        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Learning Features</h2>
            <span className="text-sm text-muted-foreground">Explore and learn</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div style={{ animationDelay: "0ms" }}>
              <EducationButton
                title="Games"
                description="Learn through interactive educational games"
                icon={Gamepad}
                color="#4f46e5"
                onClick={() => handleButtonClick("Games")}
              />
            </div>

            <div style={{ animationDelay: "150ms" }}>
              <EducationButton
                title="Simplify"
                description="Break down complex topics into simple concepts"
                icon={BookOpen}
                color="#0ea5e9"
                onClick={() => handleButtonClick("Simplify")}
              />
            </div>

            <div style={{ animationDelay: "300ms" }}>
              <EducationButton
                title="Quiz"
                description="Test your knowledge with adaptive quizzes"
                icon={HelpCircle}
                color="#ec4899"
                onClick={() => handleButtonClick("Quiz")}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Your Resources</h2>
            <span className="text-sm text-muted-foreground">Upload and manage</span>
          </div>

          <ResourceManager onResourceAction={handleResourceAction} />
        </section>
      </main>

      <SimplifyModal
        isOpen={isSimplifyModalOpen}
        onClose={() => setIsSimplifyModalOpen(false)}
        selectedResource={selectedResource}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        selectedResource={selectedResource}
      />

      <GameModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        selectedResource={selectedResource}
      />
    </div>
  )
}

export default function LearningApp() {
  const [isInitialized, setIsInitialized] = useState(false)

  // This is needed to prevent hydration errors with localStorage
  // by ensuring the component only renders after client-side hydration
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  if (!isInitialized) {
    return null
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { user, login, isLoading } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show login page if not logged in
  if (!user) {
    return <LoginPage onLogin={login} />
  }

  // Show dashboard if logged in
  return <LearningDashboard />
}

