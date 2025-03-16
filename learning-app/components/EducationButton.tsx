"use client"

import type { LucideIcon } from "lucide-react"
import { useState } from "react"

interface EducationButtonProps {
  title: string
  description: string
  icon: LucideIcon
  color: string
  onClick: () => void
}

export default function EducationButton({ title, description, icon: Icon, color, onClick }: EducationButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Map standard colors to vibrant colors
  const colorMap: Record<string, string> = {
    "#4f46e5": "from-vibrant-blue to-vibrant-purple", // Games
    "#0ea5e9": "from-vibrant-teal to-vibrant-blue", // Simplify
    "#ec4899": "from-vibrant-pink to-vibrant-purple", // Quiz
  }

  const gradientClass = colorMap[color] || "from-vibrant-purple to-vibrant-pink"

  return (
    <button
      onClick={onClick}
      className="w-full colorful-card p-6 text-left transition-all hover:translate-y-[-5px] animate-fade-up bg-white/80 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isHovered ? `bg-gradient-to-r ${gradientClass}` : "bg-opacity-10"
          }`}
          style={{ backgroundColor: isHovered ? undefined : `${color}10` }}
        >
          <Icon
            className={`h-7 w-7 ${isHovered ? "text-white" : ""}`}
            style={{ color: isHovered ? undefined : color }}
          />
        </div>

        <div>
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}

