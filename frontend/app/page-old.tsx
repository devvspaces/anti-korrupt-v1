"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  BookOpen,
  Video,
  Layers,
  FileText,
  Presentation,
  BarChart3,
  Headphones,
  Gamepad2,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { VideoPlayer } from "@/components/video-player"
import { MindmapModal } from "@/components/mindmap-modal"
import { VideosSection } from "@/components/videos-section"
import { FlashcardsSection } from "@/components/flashcards-section"
import { QuizSection } from "@/components/quiz-section"
import { ReportsSection } from "@/components/reports-section"
import { InfographicsSection } from "@/components/infographics-section"
import { GameSection } from "@/components/game-section"
import { SlidesSection } from "@/components/slides-section"

const modules = [
  { id: 1, title: "Introduction to Web Development", completed: true },
  { id: 2, title: "HTML Fundamentals", completed: true },
  { id: 3, title: "CSS Styling Basics", completed: true },
  { id: 4, title: "JavaScript Essentials", completed: false },
  { id: 5, title: "React Framework", completed: false },
  { id: 6, title: "State Management", completed: false },
  { id: 7, title: "API Integration", completed: false },
  { id: 8, title: "Deployment Strategies", completed: false },
]

const resourceTypes = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "video", label: "Video", icon: Video },
  { id: "flashcard", label: "Flashcard", icon: Layers },
  { id: "quiz", label: "Quiz", icon: FileText },
  { id: "slides", label: "Slides", icon: Presentation },
  { id: "infographics", label: "Infographics", icon: BarChart3 },
  { id: "report", label: "Report", icon: FileText },
  { id: "audio", label: "Audio", icon: Headphones },
  { id: "game", label: "Game", icon: Gamepad2 },
]

export default function LearningPlatform() {
  const [selectedModule, setSelectedModule] = useState(4)
  const [selectedResource, setSelectedResource] = useState("overview")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [showMindmap, setShowMindmap] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const completedModules = modules.filter((m) => m.completed).length
  const totalProgress = Math.round((completedModules / modules.length) * 100)

  const handleLogin = (name: string) => {
    setUserName(name)
    setIsLoggedIn(true)
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const renderContent = () => {
    const currentModule = modules.find((m) => m.id === selectedModule)

    switch (selectedResource) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-balance">{currentModule?.title}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              In this module, you'll dive deep into the fundamentals of JavaScript. You'll learn about variables, data
              types, functions, and control structures. By the end of this module, you'll be able to write interactive
              programs and understand the core concepts that power modern web applications.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass rounded-xl p-6 space-y-2">
                <h3 className="font-semibold text-primary">Learning Objectives</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Understand JavaScript syntax and structure</li>
                  <li>• Master functions and scope concepts</li>
                  <li>• Work with arrays and objects</li>
                  <li>• Implement control flow logic</li>
                </ul>
              </div>
              <div className="glass rounded-xl p-6 space-y-2">
                <h3 className="font-semibold text-primary">What You'll Build</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Interactive calculator</li>
                  <li>• Todo list application</li>
                  <li>• Form validation system</li>
                  <li>• Mini game project</li>
                </ul>
              </div>
            </div>
          </div>
        )
      case "video":
        return <VideosSection />
      case "flashcard":
        return <FlashcardsSection />
      case "quiz":
        return <QuizSection />
      case "slides":
        return <SlidesSection />
      case "infographics":
        return <InfographicsSection />
      case "report":
        return <ReportsSection />
      case "audio":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Audio Lesson</h2>
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button size="icon" className="rounded-full w-12 h-12">
                  <Play className="w-6 h-6" />
                </Button>
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3" />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">15:30 / 45:00</span>
              </div>
              <h3 className="font-semibold">JavaScript Essentials Podcast</h3>
            </div>
          </div>
        )
      case "game":
        return <GameSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navbar
        isLoggedIn={isLoggedIn}
        onMindmapClick={() => setShowMindmap(true)}
        progress={totalProgress}
        onLogin={handleLogin}
        userName={userName}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" onClick={() => scroll("left")} className="shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  className={`
                    shrink-0 px-6 py-3 rounded-xl font-medium text-sm transition-all
                    ${
                      selectedModule === module.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary/40 hover:bg-secondary/60 text-foreground"
                    }
                    ${module.completed ? "border-l-4 border-primary" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{module.title}</span>
                    {module.completed && <span className="text-xs">✓</span>}
                  </div>
                </button>
              ))}
            </div>

            <Button size="icon" variant="ghost" onClick={() => scroll("right")} className="shrink-0">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-6 min-w-0">
          <div className="glass rounded-2xl p-6 h-fit min-w-0">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Your Learning Guide
            </h3>
            <VideoPlayer />
            <p className="text-sm text-muted-foreground mt-4">
              Hi! I'm here to guide you through this module. Let's explore JavaScript together!
            </p>
          </div>

          <div className="space-y-6 min-w-0">
            <div className="glass rounded-2xl p-4 min-w-0">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {resourceTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      onClick={() => setSelectedResource(type.id)}
                      variant={selectedResource === type.id ? "default" : "ghost"}
                      size="sm"
                      className="shrink-0"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {type.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="glass rounded-2xl p-8 min-h-[500px] min-w-0 overflow-hidden">{renderContent()}</div>
          </div>
        </div>
      </main>

      {showMindmap && <MindmapModal onClose={() => setShowMindmap(false)} />}
    </div>
  )
}
