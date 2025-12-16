"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
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
import { useAuth } from "@/contexts/auth-context"
import { modulesApi, progressApi, Module as ModuleType, Resource } from "@/lib/api"
import ReactMarkdown from "react-markdown"

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
  const { user, isAuthenticated, login } = useAuth()
  const [modules, setModules] = useState<ModuleType[]>([])
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null)
  const [selectedResource, setSelectedResource] = useState("overview")
  const [showMindmap, setShowMindmap] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Load modules on mount or auth change
  useEffect(() => {
    if (isAuthenticated) {
      loadModules()
      loadProgress()
    }
  }, [isAuthenticated])

  // Auto-select first module when modules load
  useEffect(() => {
    if (modules.length > 0 && !selectedModule) {
      loadModuleDetails(modules[0].id)
    }
  }, [modules])

  const loadModules = async () => {
    try {
      setIsLoading(true)
      const data = await modulesApi.getAll()
      setModules(data)
    } catch (error) {
      console.error("Failed to load modules:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadProgress = async () => {
    try {
      const data = await progressApi.getUserProgress()
      setProgress(data.progress)
    } catch (error) {
      console.error("Failed to load progress:", error)
    }
  }

  const loadModuleDetails = async (moduleId: number) => {
    try {
      const data = await modulesApi.getById(moduleId)
      setSelectedModule(data)
      setSelectedResource("overview")
    } catch (error) {
      console.error("Failed to load module details:", error)
    }
  }

  const handleLogin = async (lastName: string) => {
    try {
      await login(lastName)
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please try again.")
    }
  }

  const handleModuleSelect = (moduleId: number) => {
    loadModuleDetails(moduleId)
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

  // Get available resource types for current module
  const getAvailableResourceTypes = () => {
    if (!selectedModule?.resources) return [resourceTypes[0]] // Just overview

    const availableTypes = new Set(["overview"]) // Always show overview
    selectedModule.resources.forEach((resource: Resource) => {
      availableTypes.add(resource.type)
    })

    return resourceTypes.filter((rt) => availableTypes.has(rt.id))
  }

  // Get resource ID by type
  const getResourceIdByType = (type: string): number | null => {
    if (!selectedModule?.resources) return null
    const resource = selectedModule.resources.find((r: Resource) => r.type === type)
    return resource?.id || null
  }

  const renderContent = () => {
    if (!selectedModule) {
      return <div className="text-center text-muted-foreground">Loading module...</div>
    }

    switch (selectedResource) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-balance">{selectedModule.title}</h2>

            {selectedModule.overview && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>{selectedModule.overview}</ReactMarkdown>
              </div>
            )}

            {selectedModule.objectives && selectedModule.objectives.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass rounded-xl p-6 space-y-2">
                  <h3 className="font-semibold text-primary">Learning Objectives</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {selectedModule.objectives.map((objective, index) => (
                      <li key={index}>• {objective}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )

      case "video":
        const videoResourceId = getResourceIdByType("video")
        return videoResourceId ? (
          <VideosSection resourceId={videoResourceId} />
        ) : (
          <div className="text-center text-muted-foreground">No videos available</div>
        )

      case "flashcard":
        const flashcardResourceId = getResourceIdByType("flashcard")
        return flashcardResourceId ? (
          <FlashcardsSection resourceId={flashcardResourceId} />
        ) : (
          <div className="text-center text-muted-foreground">No flashcards available</div>
        )

      case "quiz":
        const quizResourceId = getResourceIdByType("quiz")
        return quizResourceId ? (
          <QuizSection
            resourceId={quizResourceId}
            onQuizComplete={loadProgress}
          />
        ) : (
          <div className="text-center text-muted-foreground">No quiz available</div>
        )

      case "slides":
        const slidesResourceId = getResourceIdByType("slides")
        return slidesResourceId ? (
          <SlidesSection resourceId={slidesResourceId} />
        ) : (
          <div className="text-center text-muted-foreground">No slides available</div>
        )

      case "infographics":
        const infographicsResourceId = getResourceIdByType("infographics")
        return infographicsResourceId ? (
          <InfographicsSection resourceId={infographicsResourceId} />
        ) : (
          <div className="text-center text-muted-foreground">No infographics available</div>
        )

      case "report":
        const reportResourceId = getResourceIdByType("report")
        return reportResourceId ? (
          <ReportsSection resourceId={reportResourceId} />
        ) : (
          <div className="text-center text-muted-foreground">No reports available</div>
        )

      case "audio":
        return <div className="text-center text-muted-foreground">Audio player coming soon</div>

      case "game":
        const gameResourceId = getResourceIdByType("game")
        return gameResourceId ? (
          <GameSection resourceId={gameResourceId} />
        ) : (
          <div className="text-center text-muted-foreground">No game available</div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isAuthenticated}
        onMindmapClick={() => setShowMindmap(true)}
        progress={progress}
        onLogin={handleLogin}
        userName={user?.lastName}
        knowledgeTokens={user?.knowledgeTokens}
      />

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Module Navigation */}
        <div className="relative mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div ref={scrollContainerRef} className="overflow-x-auto no-scrollbar px-12">
            <div className="flex gap-4 py-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module.id)}
                  className={`
                    flex-shrink-0 px-6 py-3 rounded-full transition-all duration-300
                    ${
                      selectedModule?.id === module.id
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "glass hover:scale-105"
                    }
                    ${module.completed ? "ring-2 ring-green-500" : ""}
                  `}
                >
                  <span className="text-sm font-medium whitespace-nowrap">{module.title}</span>
                  {module.completed && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Video Player Sidebar */}
          <div className="glass rounded-2xl p-4">
            <VideoPlayer videoUrl={selectedModule?.characterVideoUrl} />
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* Resource Type Tabs */}
            <div className="glass rounded-xl p-2 flex flex-wrap gap-2">
              {getAvailableResourceTypes().map((type) => (
                <Button
                  key={type.id}
                  variant={selectedResource === type.id ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setSelectedResource(type.id)}
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Dynamic Content */}
            <div className="glass rounded-2xl p-8 min-h-[600px]">{renderContent()}</div>
          </div>
        </div>
      </div>

      {showMindmap && <MindmapModal onClose={() => setShowMindmap(false)} />}
    </div>
  )
}
