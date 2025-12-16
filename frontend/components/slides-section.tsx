"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

// Sample slide data - in production this would come from a PDF
const slides = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    content: "JavaScript is a versatile programming language used for web development.",
  },
  {
    id: 2,
    title: "Variables and Data Types",
    content: "Learn about let, const, var and different data types in JavaScript.",
  },
  {
    id: 3,
    title: "Functions",
    content: "Functions are reusable blocks of code that perform specific tasks.",
  },
  {
    id: 4,
    title: "Arrays and Objects",
    content: "Complex data structures for organizing and manipulating data.",
  },
  {
    id: 5,
    title: "Control Flow",
    content: "If statements, loops, and conditional logic in JavaScript.",
  },
]

export function SlidesSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [zoom, setZoom] = useState(1)

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Presentation Slides</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
          <Button size="sm" variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Slide Viewer */}
      <div className="glass rounded-xl p-6 overflow-hidden">
        <div className="flex items-center justify-center bg-background/50 rounded-lg overflow-auto">
          <div
            className="bg-white p-12 shadow-2xl transition-transform"
            style={{
              width: "800px",
              aspectRatio: "16/9",
              transform: `scale(${zoom})`,
              transformOrigin: "center",
            }}
          >
            {/* Slide Content - This would be replaced with actual PDF rendering */}
            <div className="h-full flex flex-col">
              <div className="text-sm text-gray-400 mb-4">Slide {currentSlide + 1}</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-8">{slides[currentSlide].title}</h1>
              <p className="text-xl text-gray-700 leading-relaxed">{slides[currentSlide].content}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentSlide === 0}
            className="gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <Button
            onClick={handleNext}
            variant="outline"
            disabled={currentSlide === slides.length - 1}
            className="gap-2 bg-transparent"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Slide Thumbnails */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`shrink-0 w-24 h-16 rounded border-2 transition-all ${
                currentSlide === index ? "border-primary shadow-lg" : "border-border opacity-50 hover:opacity-100"
              }`}
            >
              <div className="w-full h-full bg-white p-2 flex flex-col items-start justify-start">
                <div className="text-[8px] font-bold text-gray-900 line-clamp-2">{slide.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Note: In production, this would render actual PDF slides using a library like react-pdf
      </p>
    </div>
  )
}
