/**
 * Simplifies text without using AI APIs
 * This is a free alternative that works offline
 */
export function localSimplifyText(text: string): string {
  // Step 1: Break down long sentences
  let simplified = text
    .split(". ")
    .map((sentence) => {
      // Break long sentences at commas and semicolons
      if (sentence.length > 80) {
        return sentence.replace(/,\s+/g, ".\n").replace(/;\s+/g, ".\n").replace(/:\s+/g, ":\n")
      }
      return sentence
    })
    .join(". ")

  // Step 2: Replace complex words with simpler alternatives
  const complexWordReplacements: Record<string, string> = {
    utilize: "use",
    implementation: "use",
    methodology: "method",
    facilitate: "help",
    endeavor: "try",
    commence: "start",
    terminate: "end",
    subsequently: "later",
    additionally: "also",
    demonstrate: "show",
    numerous: "many",
    initiate: "start",
    finalize: "finish",
    prioritize: "focus on",
    fundamental: "basic",
    consequently: "so",
    approximately: "about",
    sufficient: "enough",
    requirement: "need",
    obtain: "get",
    regarding: "about",
    initial: "first",
    previously: "before",
    currently: "now",
    assistance: "help",
    attempt: "try",
    locate: "find",
    numerous: "many",
    purchase: "buy",
    inquire: "ask",
    additional: "more",
    sufficient: "enough",
    verify: "check",
    residence: "home",
    obtain: "get",
    inform: "tell",
    initial: "first",
    request: "ask for",
    assistance: "help",
    attempt: "try",
    sufficient: "enough",
    additional: "more",
  }

  Object.entries(complexWordReplacements).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, "gi")
    simplified = simplified.replace(regex, simple)
  })

  // Step 3: Add explanations for technical terms and long words
  simplified = simplified.replace(/\b(\w{12,})\b/g, (match) => {
    // Skip words that are already explained
    if (simplified.includes(`${match} (`)) {
      return match
    }
    return `${match} (a complex term)`
  })

  // Step 4: Add bullet points for lists
  simplified = simplified.replace(/(\d+\.\s+)/g, "\n• ")

  // Step 5: Add spacing for readability
  simplified = simplified.replace(/\n\n+/g, "\n\n")

  return simplified + "\n\n[Note: This text was simplified using our free basic simplification tool.]"
}

