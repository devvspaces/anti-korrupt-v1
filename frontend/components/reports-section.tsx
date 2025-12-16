"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Report {
  id: number
  title: string
  content: string
}

const reports: Report[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals Overview",
    content: `# JavaScript Fundamentals

## Introduction
JavaScript is a versatile programming language that powers the interactive web. It's essential for modern web development and runs in browsers and servers.

## Core Concepts

### Variables and Data Types
JavaScript supports various data types including:
- **Numbers**: Integers and floating-point values
- **Strings**: Text data enclosed in quotes
- **Booleans**: True or false values
- **Objects**: Collections of key-value pairs
- **Arrays**: Ordered lists of values

### Functions
Functions are reusable blocks of code that perform specific tasks. They can:
1. Accept parameters
2. Return values
3. Be stored in variables
4. Be passed as arguments

### Control Flow
Control flow statements help manage program execution:
- **if/else**: Conditional execution
- **for/while**: Loops for repetition
- **switch**: Multiple condition handling

## Best Practices
Always use \`const\` by default, and only use \`let\` when reassignment is necessary. Avoid \`var\` in modern JavaScript development.`,
  },
  {
    id: 2,
    title: "Working with Arrays and Objects",
    content: `# Arrays and Objects in JavaScript

## Arrays
Arrays are ordered collections that can store multiple values of any type.

### Common Array Methods
- **map()**: Transform each element
- **filter()**: Select elements based on condition
- **reduce()**: Combine elements into single value
- **forEach()**: Iterate over elements

### Example
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
// Result: [2, 4, 6, 8, 10]
\`\`\`

## Objects
Objects store data as key-value pairs and are fundamental to JavaScript.

### Object Properties
- Access with dot notation: \`object.property\`
- Access with bracket notation: \`object['property']\`
- Add new properties dynamically
- Delete properties with \`delete\` keyword

### Object Methods
Objects can contain functions as properties, called methods.

## Conclusion
Mastering arrays and objects is crucial for effective JavaScript programming.`,
  },
  {
    id: 3,
    title: "Asynchronous JavaScript",
    content: `# Asynchronous JavaScript

## Why Asynchronous?
JavaScript is single-threaded but can handle asynchronous operations efficiently using:
- Callbacks
- Promises
- Async/Await

## Promises
Promises represent future values and have three states:
1. **Pending**: Initial state
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

### Promise Syntax
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  // Async operation
  if (success) {
    resolve(data);
  } else {
    reject(error);
  }
});
\`\`\`

## Async/Await
Modern syntax for handling promises that makes code more readable:

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## Benefits
- Cleaner code
- Better error handling
- Improved readability
- Non-blocking operations`,
  },
]

export function ReportsSection() {
  const [currentReportIndex, setCurrentReportIndex] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  const currentReport = reports[currentReportIndex]

  useEffect(() => {
    // Stop reading when component unmounts or report changes
    return () => {
      if (utterance) {
        window.speechSynthesis.cancel()
      }
    }
  }, [currentReportIndex, utterance])

  const handleReadAloud = () => {
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      setUtterance(null)
    } else {
      // Extract plain text from markdown for reading
      const plainText = currentReport.content
        .replace(/#{1,6}\s/g, "") // Remove markdown headers
        .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.+?)\*/g, "$1") // Remove italic
        .replace(/`{3}[\s\S]*?`{3}/g, "") // Remove code blocks
        .replace(/`(.+?)`/g, "$1") // Remove inline code
        .replace(/\[(.+?)\]$$.+?$$/g, "$1") // Remove links
        .replace(/\n+/g, " ") // Replace newlines with spaces

      const newUtterance = new SpeechSynthesisUtterance(plainText)
      newUtterance.rate = 0.9
      newUtterance.pitch = 1
      newUtterance.volume = 1

      newUtterance.onend = () => {
        setIsReading(false)
        setUtterance(null)
      }

      newUtterance.onerror = () => {
        setIsReading(false)
        setUtterance(null)
      }

      setUtterance(newUtterance)
      window.speechSynthesis.speak(newUtterance)
      setIsReading(true)
    }
  }

  const handleNextReport = () => {
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      setUtterance(null)
    }
    setCurrentReportIndex((prev) => (prev + 1) % reports.length)
  }

  const handlePreviousReport = () => {
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      setUtterance(null)
    }
    setCurrentReportIndex((prev) => (prev - 1 + reports.length) % reports.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleReadAloud} variant="outline" size="sm" className="gap-2 bg-transparent">
            {isReading ? (
              <>
                <VolumeX className="w-4 h-4" />
                Stop Reading
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Read Aloud
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <Button onClick={handlePreviousReport} variant="ghost" size="sm" disabled={currentReportIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <div className="text-center">
            <p className="text-sm font-semibold">{currentReport.title}</p>
            <p className="text-xs text-muted-foreground">
              Report {currentReportIndex + 1} of {reports.length}
            </p>
          </div>
          <Button
            onClick={handleNextReport}
            variant="ghost"
            size="sm"
            disabled={currentReportIndex === reports.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="glass rounded-xl p-8">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-3 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">{children}</ol>
              ),
              li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-")
                return isBlock ? (
                  <code className="block bg-secondary/40 rounded-lg p-4 my-4 overflow-x-auto text-sm">{children}</code>
                ) : (
                  <code className="bg-secondary/40 px-1.5 py-0.5 rounded text-sm">{children}</code>
                )
              },
            }}
          >
            {currentReport.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex gap-2 justify-center">
        {reports.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isReading) {
                window.speechSynthesis.cancel()
                setIsReading(false)
                setUtterance(null)
              }
              setCurrentReportIndex(index)
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentReportIndex ? "w-8 bg-primary" : "w-2 bg-secondary"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
