"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { resourcesApi } from "@/lib/api"

interface Flashcard {
  question: string
  answer: string
}

interface FlashcardsSectionProps {
  resourceId: number
}

export function FlashcardsSection({ resourceId }: FlashcardsSectionProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Fetch flashcards from API
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setIsLoading(true)
        const data = await resourcesApi.getFlashcards(resourceId)
        console.log("Fetched flashcards:", data)
        setFlashcards(data || [])
      } catch (err) {
        console.error("Failed to load flashcards:", err)
        setError("Failed to load flashcards")
      } finally {
        setIsLoading(false)
      }
    }
    fetchFlashcards()
  }, [resourceId])

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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading flashcards...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

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
