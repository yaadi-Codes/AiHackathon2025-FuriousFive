"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertCircle, Upload, FileText, X } from "lucide-react"
import { simplifyText } from "@/actions/simplify"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { localSimplifyText } from "@/lib/local-simplify"
import { extractTextFromFile } from "@/lib/document-parser"
import { Progress } from "@/components/ui/progress"
import type { ResourceFile } from "@/components/ResourceManager"

interface SimplifyModalProps {
  isOpen: boolean
  onClose: () => void
  selectedResource?: ResourceFile
}

export default function SimplifyModal({ isOpen, onClose, selectedResource }: SimplifyModalProps) {
  const [inputText, setInputText] = useState("")
  const [simplifiedText, setSimplifiedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("local")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parseProgress, setParseProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
            setInputText(text)
            clearInterval(progressInterval)
            setParseProgress(100)

            // Auto-simplify the extracted text
            const simplified = localSimplifyText(text)
            setSimplifiedText(simplified)
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
      const extractedText = await extractTextFromFile(file)
      setInputText(extractedText)

      clearInterval(progressInterval)
      setParseProgress(100)

      // Auto-simplify the extracted text
      if (extractedText) {
        const simplified = localSimplifyText(extractedText)
        setSimplifiedText(simplified)
      }
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
      const extractedText = await extractTextFromFile(file)
      setInputText(extractedText)

      clearInterval(progressInterval)
      setParseProgress(100)

      // Auto-simplify the extracted text
      if (extractedText) {
        const simplified = localSimplifyText(extractedText)
        setSimplifiedText(simplified)
      }
    } catch (err) {
      setError(`Failed to parse document: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
      setParseProgress(0)
    }
  }

  const handleSimplify = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      if (activeTab === "ai") {
        // Use OpenAI API
        const result = await simplifyText(inputText)
        setSimplifiedText(result)
      } else {
        // Use local simplification
        const simplified = localSimplifyText(inputText)
        setSimplifiedText(simplified)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to simplify text. Please try again."
      setError(errorMessage)

      // If it's a quota error, switch to the local tab
      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        setActiveTab("local")

        // Apply local simplification
        const simplified = localSimplifyText(inputText)
        setSimplifiedText(simplified)
      }

      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setInputText("")
    setSimplifiedText("")
    setError(null)
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Simplify Complex Text</DialogTitle>
          <DialogDescription>
            Enter complex text or upload a document and we'll simplify it for easier understanding.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Enter Text</TabsTrigger>
              <TabsTrigger value="document">Upload Document</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-2">
              <div className="grid gap-2">
                <label htmlFor="complex-text" className="text-sm font-medium">
                  Complex Text
                </label>
                <Textarea
                  id="complex-text"
                  placeholder="Enter complex text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                  className="resize-none"
                  disabled={isLoading}
                />
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
                    <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, TXT, and MD files</p>
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

              {inputText && (
                <div className="mt-4">
                  <label className="text-sm font-medium">Extracted Text</label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm max-h-32 overflow-y-auto">
                    {inputText.slice(0, 300)}
                    {inputText.length > 300 && "..."}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Simplification Method:</span>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="local" className="text-xs">
                  Free (Basic)
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">
                  AI-Powered (Premium)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {simplifiedText && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">Simplified Text</label>
              <div className="p-4 rounded-md bg-secondary/50 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {simplifiedText}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset} disabled={isLoading}>
              Reset
            </Button>
            <Button onClick={handleSimplify} disabled={isLoading || !inputText.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simplifying...
                </>
              ) : (
                "Simplify"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

