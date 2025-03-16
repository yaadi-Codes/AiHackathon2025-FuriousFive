/**
 * Extracts key terms and their definitions from text
 */
export function extractKeyTerms(text: string): Array<{ term: string; definition: string }> {
  const terms: Array<{ term: string; definition: string }> = []

  // Look for patterns like "X is Y" or "X refers to Y"
  const definitionPatterns = [
    /([A-Z][a-z]+(?:\s+[a-z]+){0,3})\s+is\s+([^.]+)/g,
    /([A-Z][a-z]+(?:\s+[a-z]+){0,3})\s+refers\s+to\s+([^.]+)/g,
    /([A-Z][a-z]+(?:\s+[a-z]+){0,3})\s+means\s+([^.]+)/g,
    /([A-Z][a-z]+(?:\s+[a-z]+){0,3}):\s+([^.]+)/g,
  ]

  // Apply each pattern
  definitionPatterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const term = match[1].trim()
      const definition = match[2].trim()

      // Only add if the term is not already in the list
      if (!terms.some((t) => t.term === term)) {
        terms.push({ term, definition })
      }
    }
  })

  // If we don't have enough terms, look for capitalized words and make educated guesses
  if (terms.length < 5) {
    const capitalizedWords = text.match(/[A-Z][a-z]+/g) || []
    const uniqueWords = [...new Set(capitalizedWords)]

    uniqueWords.forEach((word) => {
      // Skip if already in terms
      if (terms.some((t) => t.term === word)) return

      // Find a sentence containing this word
      const sentencePattern = new RegExp(`[^.]*\\b${word}\\b[^.]*\\.`, "g")
      const sentences = text.match(sentencePattern) || []

      if (sentences.length > 0) {
        // Use the first sentence as a definition
        const definition = sentences[0].replace(word, "_____").replace(/^\s*/, "").replace(/\s*$/, "")

        terms.push({ term: word, definition })
      }
    })
  }

  // If we still don't have enough terms, extract important-looking phrases
  if (terms.length < 5) {
    const sentences = text.split(/[.!?]/)

    sentences.forEach((sentence) => {
      // Look for phrases that might be important
      const importantPhrases = sentence.match(/([A-Za-z]+(?:\s+[a-z]+){2,5})/g) || []

      importantPhrases.forEach((phrase) => {
        // Skip if already in terms
        if (terms.some((t) => t.term === phrase)) return

        // Use the sentence as the definition
        const definition = sentence.replace(phrase, "_____").replace(/^\s*/, "").replace(/\s*$/, "")

        if (definition && !definition.includes(phrase)) {
          terms.push({ term: phrase, definition })
        }
      })

      // Stop if we have enough terms
      if (terms.length >= 10) return
    })
  }

  // Fallback: If we still don't have enough terms, create some generic ones
  if (terms.length < 5) {
    const fallbackTerms = [
      {
        term: "Learning",
        definition: "The acquisition of knowledge or skills through study, experience, or being taught",
      },
      {
        term: "Education",
        definition: "The process of receiving or giving systematic instruction, especially at a school or university",
      },
      { term: "Knowledge", definition: "Facts, information, and skills acquired through experience or education" },
      { term: "Skill", definition: "The ability to do something well; expertise or dexterity" },
      {
        term: "Concept",
        definition: "An abstract idea or general notion that organizes information and categorizes objects",
      },
    ]

    // Add fallback terms until we have at least 5
    let i = 0
    while (terms.length < 5 && i < fallbackTerms.length) {
      if (!terms.some((t) => t.term === fallbackTerms[i].term)) {
        terms.push(fallbackTerms[i])
      }
      i++
    }
  }

  return terms.slice(0, 10) // Return at most 10 terms
}

