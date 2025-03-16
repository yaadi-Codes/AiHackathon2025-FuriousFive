"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Fallback simplification function that doesn't use AI
function fallbackSimplify(text: string): string {
  // Basic simplification logic
  return (
    text
      .split(". ")
      .map((sentence) => {
        // Simplify long sentences by breaking them up
        if (sentence.length > 100) {
          return sentence.replace(/,\s+/g, ".\n").replace(/;\s+/g, ".\n")
        }
        return sentence
      })
      .join(". ")
      .replace(/(\w+)ing\b/g, (match) => match) // Keep -ing words as is
      .replace(/\b(\w{12,})\b/g, (match) => `${match} (a complex term)`) + // Add explanation for long words
    "\n\n[Note: This is a basic simplification as the AI service is currently unavailable.]"
  )
}

export async function simplifyText(text: string): Promise<string> {
  try {
    // The AI SDK will automatically use the OPENAI_API_KEY environment variable
    const { text: simplifiedText } = await generateText({
      model: openai("gpt-4o"),
      prompt: text,
      system:
        "You are an expert at simplifying complex text. Your task is to rewrite the given text in simpler language that a middle school student could understand. Maintain all the important information but use simpler vocabulary and shorter sentences. Break down complex concepts into easier-to-understand explanations.",
    })

    return simplifiedText
  } catch (error) {
    console.error("Error simplifying text:", error)

    // Check for quota exceeded error
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()

      if (errorMessage.includes("quota") || errorMessage.includes("billing") || errorMessage.includes("exceeded")) {
        // Use fallback simplification
        const fallbackResult = fallbackSimplify(text)

        throw new Error(
          "OpenAI API quota exceeded or billing issue. Please check your OpenAI account. " +
            "We've provided a basic simplification instead.",
        )
      }

      if (error.message.includes("API key")) {
        throw new Error("OpenAI API key issue. Please check your environment variables.")
      }
    }

    throw new Error("Failed to simplify text. Please try again later.")
  }
}

