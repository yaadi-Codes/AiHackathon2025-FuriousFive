"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, Upload, FileText, X, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { extractTextFromFile } from "@/lib/document-parser"
import type { ResourceFile } from "@/components/ResourceManager"

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  selectedResource?: ResourceFile
}

export default function GameModal({ isOpen, onClose, selectedResource }: GameModalProps) {
  const [topic, setTopic] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parseProgress, setParseProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showIframe, setShowIframe] = useState(false)

  // Handle selected resource if provided
  useEffect(() => {
    if (selectedResource && isOpen) {
      // If it's a document type resource, try to extract text
      if (selectedResource.type === "Document") {
        setIsLoading(true)
        setError(null)

        // Simulate progress
        const progressInterval = setInterval(() => {
          setParseProgress((prev) => {
            const newProgress = prev + 10
            if (newProgress >= 100) {
              clearInterval(progressInterval)
              return 100
            }
            return newProgress
          })
        }, 200)

        // Fetch the file content from the URL
        fetch(selectedResource.url)
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], selectedResource.name, { type: blob.type })
            return extractTextFromFile(file)
          })
          .then((text) => {
            setExtractedText(text)
            clearInterval(progressInterval)
            setParseProgress(100)
          })
          .catch((err) => {
            setError(`Failed to process resource: ${err instanceof Error ? err.message : "Unknown error"}`)
          })
          .finally(() => {
            setIsLoading(false)
            setParseProgress(0)
          })
      }
    }
  }, [selectedResource, isOpen])

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setUploadedFile(file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setParseProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 200)

      // Extract text from the document
      const text = await extractTextFromFile(file)
      setExtractedText(text)

      clearInterval(progressInterval)
      setParseProgress(100)
    } catch (err) {
      setError(`Failed to parse document: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
      setParseProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setIsLoading(true)
    setError(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setParseProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 200)

      // Extract text from the document
      const text = await extractTextFromFile(file)
      setExtractedText(text)

      clearInterval(progressInterval)
      setParseProgress(100)
    } catch (err) {
      setError(`Failed to parse document: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
      setParseProgress(0)
    }
  }

  const launchExternalGame = () => {
    setShowIframe(true)
  }

  const resetForm = () => {
    setTopic("")
    setUploadedFile(null)
    setExtractedText("")
    setShowIframe(false)
    setError(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setExtractedText("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openInNewTab = () => {
    window.open("https://zombie-quiz-trek.lovable.app", "_blank")
  }

  const renderGameSetup = () => (
    <div className="grid gap-4 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Zombie Quiz Trek</h3>
        <p className="text-sm text-muted-foreground">
          Answer questions correctly to jump over obstacles and grow your zombie horde!
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="relative w-full max-w-md h-64 bg-gray-900 rounded-lg overflow-hidden">
          <img
            src="https://sjc.microlink.io/SvKxrYXqTf1y3jJNr8aCiIPP4MFhO_POyckgOrfsjVWPFq8NgNNEeRx98vjGRyx4-8w-G4ojHQk759h8rAIFGw.jpeg"
            alt="Zombie Quiz Trek"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-2xl font-bold text-[#5EFBCD] mb-2">Zombie Quiz</h3>
            <p className="text-white text-sm mb-4">
              Answer questions correctly to jump over obstacles and grow your zombie horde!
            </p>
            <Button onClick={launchExternalGame} className="bg-[#5EFBCD] hover:bg-[#4de0b5] text-gray-900 font-medium">
              Start Game
            </Button>
          </div>
        </div>

        <Button variant="outline" onClick={openInNewTab} className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Open in new tab
        </Button>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Custom Quiz Content</h4>
        <Tabs defaultValue="topic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topic">Enter Topic</TabsTrigger>
            <TabsTrigger value="document">Upload Document</TabsTrigger>
          </TabsList>

          <TabsContent value="topic" className="mt-2">
            <div className="grid gap-2">
              <label htmlFor="game-topic" className="text-sm font-medium">
                Game Topic
              </label>
              <Input
                id="game-topic"
                placeholder="Enter a topic (e.g., World History, Biology, Literature)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Enter a specific topic to generate game questions.</p>
            </div>
          </TabsContent>

          <TabsContent value="document" className="mt-2">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${isLoading ? "opacity-50" : "hover:bg-secondary/50 cursor-pointer"}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                disabled={isLoading}
              />

              {!uploadedFile ? (
                <>
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Drag & drop a document or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload study materials to generate game questions
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="font-medium">{uploadedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile()
                      }}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {parseProgress > 0 && parseProgress < 100 && (
                    <div className="w-full max-w-xs">
                      <Progress value={parseProgress} className="h-2" />
                      <p className="text-xs text-center mt-1">Parsing document...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {extractedText && (
              <div className="mt-4">
                <label className="text-sm font-medium">Extracted Content</label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm max-h-32 overflow-y-auto">
                  {extractedText.slice(0, 300)}
                  {extractedText.length > 300 && "..."}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={launchExternalGame} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Game...
            </>
          ) : (
            "Launch Game"
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Zombie Quiz Trek</DialogTitle>
          <DialogDescription>Test your knowledge with a fun zombie-themed educational game.</DialogDescription>
        </DialogHeader>

        {!showIframe ? (
          renderGameSetup()
        ) : (
          <div className="py-4">
            <div className="relative w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                ref={iframeRef}
                src="https://zombie-quiz-trek.lovable.app"
                className="w-full h-full border-0"
                title="Zombie Quiz Trek"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={resetForm}>
                Back to Setup
              </Button>
              <Button variant="outline" onClick={openInNewTab}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

