"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Flashcard {
  id: number
  question: string
  answer: string
}

const flashcards: Flashcard[] = [
  {
    id: 1,
    question: "What is a variable in JavaScript?",
    answer:
      "A variable is a container for storing data values. In JavaScript, you can declare variables using var, let, or const keywords.",
  },
  {
    id: 2,
    question: "What is the difference between let and const?",
    answer:
      "'let' allows you to reassign values, while 'const' creates a constant reference that cannot be reassigned. Both are block-scoped.",
  },
  {
    id: 3,
    question: "What are arrow functions?",
    answer:
      "Arrow functions are a shorter syntax for writing function expressions. They use the => syntax and don't have their own 'this' binding.",
  },
  {
    id: 4,
    question: "What is an array in JavaScript?",
    answer:
      "An array is an ordered collection of values. Arrays can hold multiple values of any type and have many built-in methods for manipulation.",
  },
  {
    id: 5,
    question: "What does the map() method do?",
    answer:
      "The map() method creates a new array by calling a function on every element of the original array. It's commonly used for transforming data.",
  },
]

export function FlashcardsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <p className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </p>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <div
          onClick={handleFlip}
          className="relative glass rounded-xl min-h-[400px] cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front - Question */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <div className="text-center space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-4">
                Question
              </div>
              <h3 className="text-2xl font-semibold text-balance">{currentCard.question}</h3>
              <p className="text-sm text-muted-foreground mt-8">Click to reveal answer</p>
            </div>
          </div>

          {/* Back - Answer (rotated back to normal when card is flipped) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center space-y-4" style={{ transform: "rotateY(180deg)" }}>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-4">
                Answer
              </div>
              <p className="text-lg leading-relaxed">{currentCard.answer}</p>
              <p className="text-sm text-muted-foreground mt-8">Click to see question</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentIndex === 0}
          className="flex-1 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleFlip} variant="default" className="flex-1">
          {isFlipped ? "Show Question" : "Show Answer"}
        </Button>
        <Button
          onClick={handleNext}
          variant="outline"
          disabled={currentIndex === flashcards.length - 1}
          className="flex-1 bg-transparent"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Progress Indicators */}
      <div className="flex gap-2 justify-center">
        {flashcards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsFlipped(false)
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-secondary"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
