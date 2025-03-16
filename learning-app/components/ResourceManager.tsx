"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  FileText,
  File,
  Image,
  Video,
  Music,
  Download,
  Eye,
  Trash2,
  BookOpen,
  HelpCircle,
  Gamepad,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { formatFileSize } from "@/lib/utils"

export interface ResourceFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  dateAdded: Date
  tags: string[]
}

interface ResourceManagerProps {
  onResourceAction?: (resource: ResourceFile, action: "simplify" | "quiz" | "game") => void
}

export default function ResourceManager({ onResourceAction }: ResourceManagerProps) {
  const [resources, setResources] = useState<ResourceFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewFile, setPreviewFile] = useState<ResourceFile | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Process each file
    Array.from(files).forEach((file) => {
      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file)

      // Generate a unique ID
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Determine file type category
      const fileType = getFileTypeCategory(file.type)

      // Create new resource
      const newResource: ResourceFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        size: file.size,
        url: fileUrl,
        dateAdded: new Date(),
        tags: [fileType],
      }

      // Add to resources after a delay to simulate upload
      setTimeout(() => {
        setResources((prev) => [...prev, newResource])
        setIsUploading(false)
        setUploadProgress(0)
        clearInterval(progressInterval)

        toast({
          title: "File uploaded",
          description: `${file.name} has been added to your resources.`,
          duration: 3000,
        })

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 2000)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Process each file
    Array.from(files).forEach((file) => {
      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file)

      // Generate a unique ID
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Determine file type category
      const fileType = getFileTypeCategory(file.type)

      // Create new resource
      const newResource: ResourceFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        size: file.size,
        url: fileUrl,
        dateAdded: new Date(),
        tags: [fileType],
      }

      // Add to resources after a delay to simulate upload
      setTimeout(() => {
        setResources((prev) => [...prev, newResource])
        setIsUploading(false)
        setUploadProgress(0)
        clearInterval(progressInterval)

        toast({
          title: "File uploaded",
          description: `${file.name} has been added to your resources.`,
          duration: 3000,
        })
      }, 2000)
    })
  }

  const handleDeleteResource = (id: string) => {
    // Find the resource to get its URL
    const resourceToDelete = resources.find((resource) => resource.id === id)

    if (resourceToDelete) {
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(resourceToDelete.url)

      // Remove from state
      setResources((prev) => prev.filter((resource) => resource.id !== id))

      toast({
        title: "Resource deleted",
        description: `${resourceToDelete.name} has been removed from your resources.`,
        duration: 3000,
      })
    }
  }

  const handlePreviewResource = (resource: ResourceFile) => {
    setPreviewFile(resource)
    setIsPreviewOpen(true)
  }

  const handleDownloadResource = (resource: ResourceFile) => {
    const link = document.createElement("a")
    link.href = resource.url
    link.download = resource.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileTypeCategory = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "Image"
    if (mimeType.startsWith("video/")) return "Video"
    if (mimeType.startsWith("audio/")) return "Audio"
    if (mimeType.startsWith("text/")) return "Document"
    if (mimeType.includes("pdf")) return "Document"
    if (mimeType.includes("word") || mimeType.includes("document")) return "Document"
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "Spreadsheet"
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "Presentation"
    return "Other"
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "Image":
        return <Image className="h-6 w-6" />
      case "Video":
        return <Video className="h-6 w-6" />
      case "Audio":
        return <Music className="h-6 w-6" />
      case "Document":
        return <FileText className="h-6 w-6" />
      default:
        return <File className="h-6 w-6" />
    }
  }

  const getFileColor = (type: string): string => {
    switch (type) {
      case "Image":
        return "text-vibrant-blue"
      case "Video":
        return "text-vibrant-red"
      case "Audio":
        return "text-vibrant-purple"
      case "Document":
        return "text-vibrant-green"
      default:
        return "text-gray-500"
    }
  }

  const getFileGradient = (type: string): string => {
    switch (type) {
      case "Image":
        return "from-vibrant-blue to-vibrant-teal"
      case "Video":
        return "from-vibrant-red to-vibrant-orange"
      case "Audio":
        return "from-vibrant-purple to-vibrant-pink"
      case "Document":
        return "from-vibrant-green to-vibrant-teal"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const renderFilePreview = () => {
    if (!previewFile) return null

    switch (previewFile.type) {
      case "Image":
        return (
          <div className="flex justify-center">
            <img
              src={previewFile.url || "/placeholder.svg"}
              alt={previewFile.name}
              className="max-h-[60vh] max-w-full object-contain rounded-md"
            />
          </div>
        )
      case "Video":
        return <video src={previewFile.url} controls className="max-h-[60vh] max-w-full rounded-md" />
      case "Audio":
        return (
          <div className="p-8 bg-muted rounded-md">
            <audio src={previewFile.url} controls className="w-full" />
          </div>
        )
      case "Document":
        // For PDFs, we can use an iframe
        if (previewFile.name.toLowerCase().endsWith(".pdf")) {
          return <iframe src={previewFile.url} className="w-full h-[60vh] rounded-md border" />
        }
        // For other document types, show a download prompt
        return (
          <div className="text-center p-8">
            <FileText className="h-16 w-16 mx-auto mb-4 text-vibrant-green" />
            <p className="mb-4">Preview not available for this file type. You can download it instead.</p>
            <Button
              onClick={() => handleDownloadResource(previewFile)}
              className="bg-gradient-to-r from-vibrant-green to-vibrant-teal hover:opacity-90"
            >
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </div>
        )
      default:
        return (
          <div className="text-center p-8">
            <File className="h-16 w-16 mx-auto mb-4 text-primary" />
            <p className="mb-4">Preview not available for this file type. You can download it instead.</p>
            <Button
              onClick={() => handleDownloadResource(previewFile)}
              className="bg-gradient-to-r from-vibrant-blue to-vibrant-purple hover:opacity-90"
            >
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </div>
        )
    }
  }

  const renderActionButtons = (resource: ResourceFile) => {
    return (
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePreviewResource(resource)}
          title="Preview"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleDownloadResource(resource)}
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => handleDeleteResource(resource.id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderResourceActions = (resource: ResourceFile) => {
    // Determine what actions are available based on file type
    const actions = []

    if (resource.type === "Document") {
      actions.push(
        <Button
          key="simplify"
          variant="ghost"
          size="sm"
          className="h-8 text-xs bg-gradient-to-r from-vibrant-teal to-vibrant-blue hover:text-white"
          onClick={() => onResourceAction?.(resource, "simplify")}
        >
          <BookOpen className="h-3 w-3 mr-1" />
          Simplify
        </Button>,
      )

      actions.push(
        <Button
          key="quiz"
          variant="ghost"
          size="sm"
          className="h-8 text-xs bg-gradient-to-r from-vibrant-purple to-vibrant-pink hover:text-white"
          onClick={() => onResourceAction?.(resource, "quiz")}
        >
          <HelpCircle className="h-3 w-3 mr-1" />
          Quiz
        </Button>,
      )

      actions.push(
        <Button
          key="game"
          variant="ghost"
          size="sm"
          className="h-8 text-xs bg-gradient-to-r from-vibrant-blue to-vibrant-purple hover:text-white"
          onClick={() => onResourceAction?.(resource, "game")}
        >
          <Gamepad className="h-3 w-3 mr-1" />
          Game
        </Button>,
      )
    }

    return actions.length > 0 ? <div className="flex space-x-1 mt-2">{actions}</div> : null
  }

  return (
    <div className="colorful-card p-6 animate-fade-up bg-white/80 backdrop-blur-sm" style={{ animationDelay: "450ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium text-lg">Learning Resources</h3>
          <p className="text-sm text-muted-foreground">Upload and manage your study materials</p>
        </div>
        <Button
          className="bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-white rounded-lg px-4 py-1.5 hover:opacity-90"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <span className="text-sm font-medium">Upload</span>
        </Button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple />
      </div>

      {isUploading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-vibrant-blue to-vibrant-purple animate-gradient-shift"
              style={{ width: `${uploadProgress}%` }}
            />
          </Progress>
        </div>
      )}

      {resources.length === 0 ? (
        <div
          className="text-center py-12 border-2 border-dashed rounded-lg border-purple-200 hover:border-vibrant-purple transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 mx-auto text-vibrant-purple mb-2" />
          <p className="text-vibrant-purple font-medium">No resources uploaded yet.</p>
          <p className="text-sm mt-1 text-muted-foreground">Drag & drop files here or click the Upload button.</p>
        </div>
      ) : (
        <div className="space-y-4" onDragOver={handleDragOver} onDrop={handleDrop}>
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className="overflow-hidden hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-md bg-gradient-to-r ${getFileGradient(resource.type)} text-white`}>
                      {getFileIcon(resource.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm line-clamp-1">{resource.name}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{resource.type}</span>
                        <span className="mx-1">•</span>
                        <span>{formatFileSize(resource.size)}</span>
                        <span className="mx-1">•</span>
                        <span>{resource.dateAdded.toLocaleDateString()}</span>
                      </div>
                      {renderResourceActions(resource)}
                    </div>
                  </div>
                  {renderActionButtons(resource)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          {renderFilePreview()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

