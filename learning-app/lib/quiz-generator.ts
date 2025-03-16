import { extractKeyTerms } from "./text-analyzer"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

// Sample knowledge base for different topics
const topicKnowledgeBase: Record<string, QuizQuestion[]> = {
  history: [
    {
      id: 1,
      question: "Which event marked the beginning of World War I?",
      options: [
        "The assassination of Archduke Franz Ferdinand",
        "The bombing of Pearl Harbor",
        "The signing of the Treaty of Versailles",
        "The Russian Revolution",
      ],
      correctAnswer: 0,
      explanation:
        "World War I began after the assassination of Archduke Franz Ferdinand of Austria in June 1914, which triggered a chain of events leading to war.",
    },
    {
      id: 2,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
      correctAnswer: 2,
      explanation: "George Washington served as the first President of the United States from 1789 to 1797.",
    },
    {
      id: 3,
      question: "Which ancient civilization built the pyramids at Giza?",
      options: ["The Romans", "The Greeks", "The Mayans", "The Egyptians"],
      correctAnswer: 3,
      explanation: "The Great Pyramids at Giza were built by the ancient Egyptians as tombs for their pharaohs.",
    },
    {
      id: 4,
      question: "What was the name of the period of rebirth and cultural achievement in Europe?",
      options: ["The Enlightenment", "The Renaissance", "The Industrial Revolution", "The Middle Ages"],
      correctAnswer: 1,
      explanation:
        "The Renaissance was a period of European cultural, artistic, political, and scientific 'rebirth' following the Middle Ages.",
    },
    {
      id: 5,
      question: "Which empire was ruled by Genghis Khan?",
      options: ["The Roman Empire", "The Ottoman Empire", "The Mongol Empire", "The Persian Empire"],
      correctAnswer: 2,
      explanation:
        "Genghis Khan founded and ruled the Mongol Empire, which became the largest contiguous land empire in history.",
    },
  ],
  science: [
    {
      id: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      explanation: "The chemical symbol for gold is Au, which comes from the Latin word 'aurum'.",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctAnswer: 2,
      explanation:
        "Mars is often called the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface.",
    },
    {
      id: 3,
      question: "What is the process by which plants make their own food using sunlight?",
      options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"],
      correctAnswer: 1,
      explanation:
        "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
    },
    {
      id: 4,
      question: "What is the smallest unit of matter?",
      options: ["Atom", "Molecule", "Cell", "Electron"],
      correctAnswer: 0,
      explanation: "The atom is the smallest unit of matter that defines the chemical elements.",
    },
    {
      id: 5,
      question: "Which of these is NOT a state of matter?",
      options: ["Solid", "Liquid", "Gas", "Energy"],
      correctAnswer: 3,
      explanation: "Energy is not a state of matter. The main states of matter are solid, liquid, gas, and plasma.",
    },
  ],
  literature: [
    {
      id: 1,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1,
      explanation: "Romeo and Juliet was written by William Shakespeare around 1595.",
    },
    {
      id: 2,
      question: "Which novel begins with the line 'It was the best of times, it was the worst of times'?",
      options: ["Pride and Prejudice", "Moby Dick", "A Tale of Two Cities", "Great Expectations"],
      correctAnswer: 2,
      explanation: "A Tale of Two Cities by Charles Dickens begins with this famous opening line.",
    },
    {
      id: 3,
      question: "What is the name of the wizard school in the Harry Potter series?",
      options: ["Beauxbatons", "Durmstrang", "Ilvermorny", "Hogwarts"],
      correctAnswer: 3,
      explanation:
        "Hogwarts School of Witchcraft and Wizardry is the British wizarding school in the Harry Potter series.",
    },
    {
      id: 4,
      question: "Who wrote 'The Great Gatsby'?",
      options: ["F. Scott Fitzgerald", "Ernest Hemingway", "John Steinbeck", "J.D. Salinger"],
      correctAnswer: 0,
      explanation: "The Great Gatsby was written by F. Scott Fitzgerald and published in 1925.",
    },
    {
      id: 5,
      question: "Which of these is NOT one of the March sisters in 'Little Women'?",
      options: ["Jo", "Beth", "Amy", "Emma"],
      correctAnswer: 3,
      explanation:
        "The four March sisters in Louisa May Alcott's 'Little Women' are Meg, Jo, Beth, and Amy. Emma is not one of them.",
    },
  ],
  geography: [
    {
      id: 1,
      question: "Which is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3,
      explanation:
        "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface.",
    },
    {
      id: 2,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne as many people think.",
    },
    {
      id: 3,
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Thailand", "Korea", "Japan"],
      correctAnswer: 3,
      explanation:
        "Japan is known as the Land of the Rising Sun. The name 'Japan' is derived from the Chinese pronunciation of the characters for 'sun-origin'.",
    },
    {
      id: 4,
      question: "Which mountain range separates Europe from Asia?",
      options: ["The Alps", "The Andes", "The Urals", "The Himalayas"],
      correctAnswer: 2,
      explanation: "The Ural Mountains form a natural boundary between Europe and Asia.",
    },
    {
      id: 5,
      question: "Which is the longest river in the world?",
      options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"],
      correctAnswer: 1,
      explanation:
        "The Nile River is generally considered to be the longest river in the world, flowing for about 6,650 kilometers.",
    },
  ],
  math: [
    {
      id: 1,
      question: "What is the value of π (pi) to two decimal places?",
      options: ["3.14", "3.41", "3.12", "3.16"],
      correctAnswer: 0,
      explanation:
        "The value of π (pi) to two decimal places is 3.14. It's an irrational number that represents the ratio of a circle's circumference to its diameter.",
    },
    {
      id: 2,
      question: "What is the square root of 144?",
      options: ["12", "14", "16", "10"],
      correctAnswer: 0,
      explanation: "The square root of 144 is 12, because 12 × 12 = 144.",
    },
    {
      id: 3,
      question: "In a right-angled triangle, what is the name of the longest side?",
      options: ["Adjacent", "Opposite", "Hypotenuse", "Median"],
      correctAnswer: 2,
      explanation:
        "In a right-angled triangle, the longest side is called the hypotenuse, which is opposite to the right angle.",
    },
    {
      id: 4,
      question: "What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ...?",
      options: ["11", "13", "15", "21"],
      correctAnswer: 1,
      explanation:
        "This is the Fibonacci sequence, where each number is the sum of the two preceding ones. The next number is 8 + 5 = 13.",
    },
    {
      id: 5,
      question: "What is the area of a circle with radius r?",
      options: ["πr", "2πr", "πr²", "2πr²"],
      correctAnswer: 2,
      explanation: "The area of a circle is calculated using the formula A = πr², where r is the radius of the circle.",
    },
  ],
}

// Generate quiz from a specific topic
export function generateQuizFromTopic(topic: string): QuizQuestion[] {
  // Normalize the topic by converting to lowercase
  const normalizedTopic = topic.toLowerCase()

  // Check if we have direct match in our knowledge base
  for (const [key, questions] of Object.entries(topicKnowledgeBase)) {
    if (normalizedTopic.includes(key)) {
      // Return a copy of the questions with new IDs to ensure uniqueness
      return questions.map((q, index) => ({
        ...q,
        id: index + 1,
      }))
    }
  }

  // If no direct match, try to find the closest topic
  const topics = Object.keys(topicKnowledgeBase)
  const closestTopic = topics.find(
    (t) =>
      normalizedTopic.includes(t) ||
      t.includes(normalizedTopic) ||
      normalizedTopic.split(" ").some((word) => t.includes(word)),
  )

  if (closestTopic) {
    return topicKnowledgeBase[closestTopic].map((q, index) => ({
      ...q,
      id: index + 1,
    }))
  }

  // If no match found, return general knowledge questions
  return [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      explanation: "Paris is the capital and most populous city of France.",
    },
    {
      id: 2,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2,
      explanation: "The Mona Lisa was painted by Leonardo da Vinci in the early 16th century.",
    },
    {
      id: 3,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation:
        "Mars is often called the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface.",
    },
    {
      id: 4,
      question: "What is the chemical symbol for water?",
      options: ["WA", "H2O", "CO2", "O2"],
      correctAnswer: 1,
      explanation: "H2O is the chemical formula for water, consisting of two hydrogen atoms and one oxygen atom.",
    },
    {
      id: 5,
      question: "Who wrote the play 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1,
      explanation: "Romeo and Juliet was written by William Shakespeare around 1595.",
    },
  ]
}

// Generate quiz from text content
export function generateQuizFromText(text: string): QuizQuestion[] {
  // Extract key terms and concepts from the text
  const keyTerms = extractKeyTerms(text)

  // Generate questions based on the extracted terms
  const questions: QuizQuestion[] = []

  // If we have enough key terms, create questions from them
  if (keyTerms.length >= 3) {
    // Create definition questions
    keyTerms.slice(0, 5).forEach((term, index) => {
      // Create a basic definition question
      questions.push({
        id: index + 1,
        question: `What best describes "${term.term}"?`,
        options: [
          term.definition,
          `The opposite of ${term.term}`,
          `A type of ${getRandomCategory()}`,
          `A synonym for ${getRandomTerm(keyTerms, term.term)}`,
        ],
        correctAnswer: 0,
        explanation: `"${term.term}" refers to ${term.definition}`,
      })
    })
  }

  // If we don't have enough questions, add some general ones based on the text topic
  if (questions.length < 5) {
    // Try to determine the general topic of the text
    const topic = determineTextTopic(text)
    const generalQuestions = generateQuizFromTopic(topic)

    // Add enough general questions to have 5 total
    const neededQuestions = 5 - questions.length
    for (let i = 0; i < neededQuestions && i < generalQuestions.length; i++) {
      questions.push({
        ...generalQuestions[i],
        id: questions.length + 1,
      })
    }
  }

  return questions
}

// Helper function to determine the general topic of a text
function determineTextTopic(text: string): string {
  const text_lower = text.toLowerCase()

  // Check for keywords related to different topics
  if (
    text_lower.includes("history") ||
    text_lower.includes("war") ||
    text_lower.includes("century") ||
    text_lower.includes("ancient")
  ) {
    return "history"
  }

  if (
    text_lower.includes("science") ||
    text_lower.includes("biology") ||
    text_lower.includes("chemistry") ||
    text_lower.includes("physics")
  ) {
    return "science"
  }

  if (
    text_lower.includes("novel") ||
    text_lower.includes("author") ||
    text_lower.includes("character") ||
    text_lower.includes("book")
  ) {
    return "literature"
  }

  if (
    text_lower.includes("country") ||
    text_lower.includes("capital") ||
    text_lower.includes("continent") ||
    text_lower.includes("map")
  ) {
    return "geography"
  }

  if (
    text_lower.includes("math") ||
    text_lower.includes("equation") ||
    text_lower.includes("number") ||
    text_lower.includes("formula")
  ) {
    return "math"
  }

  // Default to general knowledge
  return "general"
}

// Helper function to get a random category
function getRandomCategory(): string {
  const categories = ["food", "animal", "plant", "vehicle", "profession", "building", "tool"]
  return categories[Math.floor(Math.random() * categories.length)]
}

// Helper function to get a random term that's not the given term
function getRandomTerm(terms: Array<{ term: string; definition: string }>, excludeTerm: string): string {
  const filteredTerms = terms.filter((t) => t.term !== excludeTerm)
  if (filteredTerms.length === 0) return "unknown term"
  return filteredTerms[Math.floor(Math.random() * filteredTerms.length)].term
}

