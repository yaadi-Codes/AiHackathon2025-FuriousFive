"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, Upload, FileText, X, CheckCircle2, HelpCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { extractTextFromFile } from "@/lib/document-parser"
import { generateQuizFromText, generateQuizFromTopic } from "@/lib/quiz-generator"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { ResourceFile } from "@/components/ResourceManager"

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  selectedResource?: ResourceFile
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

type QuizState = "setup" | "taking" | "results"

export default function QuizModal({ isOpen, onClose, selectedResource }: QuizModalProps) {
  const [quizState, setQuizState] = useState<QuizState>("setup")
  const [topic, setTopic] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parseProgress, setParseProgress] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [score, setScore] = useState({ correct: 0, total: 0 })
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

  const generateQuiz = async () => {
    if ((!topic && !extractedText) || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      let generatedQuestions: QuizQuestion[] = []

      if (extractedText) {
        // Generate quiz from uploaded file content
        generatedQuestions = generateQuizFromText(extractedText)
      } else if (topic) {
        // Generate quiz from topic
        generatedQuestions = generateQuizFromTopic(topic)
      }

      if (generatedQuestions.length === 0) {
        throw new Error("Could not generate quiz questions. Please try a different topic or file.")
      }

      setQuestions(generatedQuestions)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
      setScore({ correct: 0, total: 0 })
      setQuizState("taking")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // Calculate final score
      let correctCount = 0
      questions.forEach((question) => {
        if (selectedAnswers[question.id] === question.correctAnswer) {
          correctCount++
        }
      })

      setScore({
        correct: correctCount,
        total: questions.length,
      })

      setQuizState("results")
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleRestartQuiz = () => {
    setQuizState("setup")
    setTopic("")
    setUploadedFile(null)
    setExtractedText("")
    setQuestions([])
    setSelectedAnswers({})
    setScore({ correct: 0, total: 0 })
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

  const renderQuizSetup = () => (
    <div className="grid gap-4 py-4">
      <Tabs defaultValue="topic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topic">Enter Topic</TabsTrigger>
          <TabsTrigger value="document">Upload Document</TabsTrigger>
        </TabsList>

        <TabsContent value="topic" className="mt-2">
          <div className="grid gap-2">
            <label htmlFor="quiz-topic" className="text-sm font-medium">
              Quiz Topic
            </label>
            <Input
              id="quiz-topic"
              placeholder="Enter a topic (e.g., World History, Biology, Literature)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a specific topic to generate a quiz with relevant questions.
            </p>
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
                  Upload study materials to generate a quiz based on the content
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
        <Button onClick={generateQuiz} disabled={isLoading || (!topic && !extractedText)}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            "Generate Quiz"
          )}
        </Button>
      </div>
    </div>
  )

  const renderQuizQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const selectedAnswer = selectedAnswers[currentQuestion.id]
    const isAnswered = selectedAnswer !== undefined

    return (
      <div className="grid gap-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 w-24" />
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 items-start">
              <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            </div>

            <RadioGroup
              className="mt-4 space-y-3"
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, Number.parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base leading-relaxed">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>

          <Button onClick={handleNextQuestion} disabled={!isAnswered}>
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Quiz"}
          </Button>
        </div>
      </div>
    )
  }

  const renderQuizResults = () => (
    <div className="grid gap-4 py-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Quiz Completed!</h3>
        <p className="text-muted-foreground">
          You scored {score.correct} out of {score.total}
        </p>

        <div className="w-full max-w-xs mx-auto mt-4 mb-6">
          <Progress value={(score.correct / score.total) * 100} className="h-3" />
          <p className="text-sm mt-1 font-medium">{Math.round((score.correct / score.total) * 100)}% Correct</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Question Review:</h4>

        {questions.map((question, index) => {
          const isCorrect = selectedAnswers[question.id] === question.correctAnswer

          return (
            <Card key={question.id} className={cn("border-l-4", isCorrect ? "border-l-green-500" : "border-l-red-500")}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h5 className="font-medium">Question {index + 1}</h5>
                  {isCorrect ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Correct</span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Incorrect</span>
                  )}
                </div>

                <p className="mt-2">{question.question}</p>

                <div className="mt-3 space-y-1">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm",
                        optIndex === question.correctAnswer
                          ? "bg-green-100"
                          : optIndex === selectedAnswers[question.id] && optIndex !== question.correctAnswer
                            ? "bg-red-100"
                            : "bg-gray-50",
                      )}
                    >
                      {option}
                      {optIndex === question.correctAnswer && (
                        <span className="ml-2 text-green-600 text-xs">(Correct Answer)</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={handleRestartQuiz}>
          Create New Quiz
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quiz Generator</DialogTitle>
          <DialogDescription>Generate a quiz based on a topic or uploaded document.</DialogDescription>
        </DialogHeader>

        {quizState === "setup" && renderQuizSetup()}
        {quizState === "taking" && renderQuizQuestion()}
        {quizState === "results" && renderQuizResults()}
      </DialogContent>
    </Dialog>
  )
}

