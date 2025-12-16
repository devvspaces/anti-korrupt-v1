"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Move } from "lucide-react"

export function InfographicsSection() {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Visual Learning Guide</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleZoomOut} className="gap-2 bg-transparent">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
            <Move className="w-4 h-4" />
            Reset
          </Button>
          <Button size="sm" variant="outline" onClick={handleZoomIn} className="gap-2 bg-transparent">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl p-4 overflow-hidden">
        <div
          className="relative aspect-square bg-secondary/20 rounded-lg overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src="/placeholder.svg?height=800&width=800"
            alt="JavaScript Learning Infographic"
            className="w-full h-full object-contain select-none"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? "none" : "transform 0.2s",
            }}
            draggable={false}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Use the controls above to zoom, or drag to pan around the infographic
      </p>
    </div>
  )
}
