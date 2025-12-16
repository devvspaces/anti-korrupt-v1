"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

interface Subtitle {
  start: number
  end: number
  text: string
}

interface Video {
  id: number
  title: string
  duration: string
  subtitles: Subtitle[]
}

const videos: Video[] = [
  {
    id: 1,
    title: "Introduction to JavaScript Variables",
    duration: "12:45",
    subtitles: [
      { start: 0, end: 5, text: "Welcome to this lesson on JavaScript variables." },
      { start: 5, end: 10, text: "In JavaScript, we have three ways to declare variables: var, let, and const." },
      { start: 10, end: 15, text: "Let's start with the 'let' keyword, which creates a block-scoped variable." },
      { start: 15, end: 20, text: "You can reassign values to variables declared with 'let'." },
      { start: 20, end: 25, text: "The 'const' keyword creates a constant that cannot be reassigned." },
      { start: 25, end: 30, text: "Use 'const' by default unless you know the value will change." },
      { start: 30, end: 35, text: "The older 'var' keyword has function scope and is generally avoided today." },
    ],
  },
  {
    id: 2,
    title: "Understanding Functions",
    duration: "18:30",
    subtitles: [
      { start: 0, end: 5, text: "Functions are reusable blocks of code in JavaScript." },
      { start: 5, end: 10, text: "You can declare a function using the 'function' keyword." },
      { start: 10, end: 15, text: "Arrow functions provide a more concise syntax for writing functions." },
      { start: 15, end: 20, text: "Functions can accept parameters and return values." },
    ],
  },
  {
    id: 3,
    title: "Working with Arrays",
    duration: "15:20",
    subtitles: [
      { start: 0, end: 5, text: "Arrays are ordered collections of values in JavaScript." },
      { start: 5, end: 10, text: "You can create arrays using square brackets." },
      { start: 10, end: 15, text: "Arrays have many useful methods like map, filter, and reduce." },
    ],
  },
]

export function VideosSection() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(45) // Mock duration in seconds
  const subtitleContainerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate video playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, duration])

  // Auto-scroll subtitles
  useEffect(() => {
    const activeIndex = selectedVideo.subtitles.findIndex((sub) => currentTime >= sub.start && currentTime < sub.end)
    if (activeIndex !== -1 && subtitleContainerRef.current) {
      const activeElement = subtitleContainerRef.current.children[activeIndex] as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentTime, selectedVideo.subtitles])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const skipBackward = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10))
  }

  const skipForward = () => {
    setCurrentTime((prev) => Math.min(duration, prev + 10))
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVideoChange = (video: Video) => {
    setSelectedVideo(video)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Video Lessons</h2>

      {/* Video List */}
      <div className="grid gap-3">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => handleVideoChange(video)}
            className={`glass rounded-xl p-4 text-left transition-all ${
              selectedVideo.id === video.id ? "ring-2 ring-primary bg-primary/10" : "hover:bg-secondary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.duration}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Video Player */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>

        {/* Video Display */}
        <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden relative group">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center mx-auto mb-4">
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-primary-foreground" />
                ) : (
                  <Play className="w-10 h-10 text-primary-foreground ml-1" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Video Placeholder</p>
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button size="icon" variant="outline" onClick={skipBackward}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button size="icon" className="h-12 w-12" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button size="icon" variant="outline" onClick={skipForward}>
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" className="ml-4 bg-transparent">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Subtitles */}
        <div className="glass rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold mb-3">Subtitles</h4>
          <div ref={subtitleContainerRef} className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
            {selectedVideo.subtitles.map((subtitle, index) => {
              const isActive = currentTime >= subtitle.start && currentTime < subtitle.end
              return (
                <p
                  key={index}
                  className={`text-sm transition-all p-2 rounded ${
                    isActive ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {subtitle.text}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
