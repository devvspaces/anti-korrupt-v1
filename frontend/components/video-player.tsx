"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"

interface VideoPlayerProps {
  videoUrl?: string
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  if (!videoUrl) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No character video available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden relative group">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handlePlayPause}>
          <Play className="w-4 h-4 mr-2" />
          Play/Pause
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>
    </div>
  )
}
