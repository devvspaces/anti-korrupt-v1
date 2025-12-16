"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Network, Coins } from "lucide-react"
import { ProgressRing } from "@/components/progress-ring"
import { LoginModal } from "@/components/login-modal"

interface NavbarProps {
  isLoggedIn: boolean
  onMindmapClick: () => void
  progress: number
  onLogin: (name: string) => Promise<void>
  userName?: string
  knowledgeTokens?: number
}

export function Navbar({ isLoggedIn, onMindmapClick, progress, onLogin, userName, knowledgeTokens }: NavbarProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogin = async (name: string) => {
    await onLogin(name)
    setShowLoginModal(false)
  }

  return (
    <>
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Anti-Korrupt
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm">
                My Courses
              </Button>
              <Button variant="ghost" size="sm">
                Progress
              </Button>
              <Button variant="ghost" size="sm">
                Resources
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onMindmapClick} className="gap-2 bg-transparent">
              <Network className="w-4 h-4" />
              Mindmap
            </Button>

            {isLoggedIn ? (
              <>
                {knowledgeTokens !== undefined && (
                  <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold">{knowledgeTokens}</span>
                  </div>
                )}
                <div className="relative">
                  <ProgressRing progress={progress} />
                  <Avatar className="absolute inset-0 m-auto w-10 h-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>{userName?.substring(0, 2).toUpperCase() || "JD"}</AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              <Button size="sm" onClick={() => setShowLoginModal(true)}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
    </>
  )
}
