"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface LoginModalProps {
  onClose: () => void
  onLogin: (name: string) => void
}

export function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onLogin(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl p-8 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to LearnFlow</h2>
            <p className="text-sm text-muted-foreground">Enter your last name to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full" disabled={!name.trim()}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
