"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, ZoomOut } from "lucide-react"

interface MindmapModalProps {
  onClose: () => void
}

export function MindmapModal({ onClose }: MindmapModalProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5))

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
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

  const nodes = [
    { id: 1, label: "Web Development", x: 50, y: 50, level: 0 },
    { id: 2, label: "HTML", x: 20, y: 30, level: 1 },
    { id: 3, label: "CSS", x: 50, y: 30, level: 1 },
    { id: 4, label: "JavaScript", x: 80, y: 30, level: 1 },
    { id: 5, label: "React", x: 70, y: 15, level: 2 },
    { id: 6, label: "State", x: 60, y: 5, level: 3 },
    { id: 7, label: "APIs", x: 80, y: 5, level: 3 },
    { id: 8, label: "Deploy", x: 90, y: 30, level: 2 },
  ]

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[80vh] glass rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-2xl font-bold">Course Mindmap</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mindmap Canvas */}
        <div
          className="flex-1 relative overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: "center",
              transition: isDragging ? "none" : "transform 0.2s",
            }}
          >
            <svg className="w-full h-full">
              {/* Connection Lines */}
              <line x1="50%" y1="50%" x2="20%" y2="30%" className="stroke-primary/30" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="50%" y2="30%" className="stroke-primary/30" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="80%" y2="30%" className="stroke-primary/30" strokeWidth="2" />
              <line x1="80%" y1="30%" x2="70%" y2="15%" className="stroke-primary/30" strokeWidth="2" />
              <line x1="70%" y1="15%" x2="60%" y2="5%" className="stroke-primary/30" strokeWidth="2" />
              <line x1="70%" y1="15%" x2="80%" y2="5%" className="stroke-primary/30" strokeWidth="2" />
              <line x1="80%" y1="30%" x2="90%" y2="30%" className="stroke-primary/30" strokeWidth="2" />
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className={`
                    glass rounded-xl px-6 py-3 font-medium text-sm whitespace-nowrap
                    ${node.level === 0 ? "bg-primary/20 border-primary" : ""}
                    ${node.level === 1 ? "bg-secondary/40" : ""}
                    ${node.level === 2 ? "bg-secondary/30" : ""}
                    ${node.level === 3 ? "bg-secondary/20" : ""}
                    hover:scale-110 transition-transform cursor-pointer
                  `}
                >
                  {node.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 text-center text-sm text-muted-foreground">
          Drag to pan • Scroll to zoom • Click nodes to navigate
        </div>
      </div>
    </div>
  )
}
