"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden relative group">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-12 h-12 text-primary-foreground ml-1" />
          </div>
        </div>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="lg" className="rounded-full" onClick={() => setIsPlaying(true)}>
              <Play className="w-5 h-5 mr-2" />
              Play Video
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setIsPlaying(!isPlaying)}>
          <Play className="w-4 h-4 mr-2" />
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setIsPlaying(false)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>
    </div>
  )
}
