"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CrosswordCell {
  letter: string
  userInput: string
  number?: number
  isBlack: boolean
}

interface Clue {
  number: number
  direction: "across" | "down"
  clue: string
  answer: string
  startRow: number
  startCol: number
}

const clues: Clue[] = [
  {
    number: 1,
    direction: "across",
    clue: "Programming language of this course",
    answer: "JAVASCRIPT",
    startRow: 0,
    startCol: 0,
  },
  { number: 2, direction: "down", clue: "Container for storing values", answer: "VARIABLE", startRow: 0, startCol: 0 },
  { number: 3, direction: "across", clue: "Ordered collection of items", answer: "ARRAY", startRow: 2, startCol: 1 },
  { number: 4, direction: "down", clue: "Reusable block of code", answer: "FUNCTION", startRow: 0, startCol: 4 },
  { number: 5, direction: "across", clue: "Iteration structure", answer: "LOOP", startRow: 4, startCol: 0 },
]

export function GameSection() {
  const [grid, setGrid] = useState<CrosswordCell[][]>(createInitialGrid())
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  function createInitialGrid(): CrosswordCell[][] {
    const gridSize = 6
    const newGrid: CrosswordCell[][] = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => ({ letter: "", userInput: "", isBlack: true })),
      )

    // Place answers in grid
    clues.forEach((clue) => {
      const { answer, startRow, startCol, direction, number } = clue
      for (let i = 0; i < answer.length; i++) {
        const row = direction === "across" ? startRow : startRow + i
        const col = direction === "across" ? startCol + i : startCol
        if (row < gridSize && col < gridSize) {
          newGrid[row][col] = {
            letter: answer[i],
            userInput: "",
            number: i === 0 ? number : newGrid[row][col].number,
            isBlack: false,
          }
        }
      }
    })

    return newGrid
  }

  const handleCellInput = (row: number, col: number, value: string) => {
    if (value.length > 1) return
    const newGrid = [...grid]
    newGrid[row][col] = { ...newGrid[row][col], userInput: value.toUpperCase() }
    setGrid(newGrid)

    // Check if puzzle is complete
    checkCompletion(newGrid)
  }

  const checkCompletion = (currentGrid: CrosswordCell[][]) => {
    const isAllCorrect = currentGrid.every((row) => row.every((cell) => cell.isBlack || cell.userInput === cell.letter))
    setIsComplete(isAllCorrect)
  }

  const handleReset = () => {
    setGrid(createInitialGrid())
    setIsComplete(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">JavaScript Crossword Puzzle</h2>
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>
      </div>

      {isComplete && (
        <div className="glass rounded-xl p-4 border-2 border-primary">
          <p className="text-center text-primary font-semibold">🎉 Congratulations! You completed the puzzle!</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Crossword Grid */}
        <div className="glass rounded-xl p-6">
          <div className="inline-grid gap-1">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`relative w-10 h-10 ${
                      cell.isBlack ? "bg-secondary" : "bg-background/50 border-2 border-border"
                    } rounded`}
                  >
                    {!cell.isBlack && (
                      <>
                        {cell.number && (
                          <span className="absolute top-0 left-1 text-[10px] font-bold text-primary">
                            {cell.number}
                          </span>
                        )}
                        <input
                          type="text"
                          maxLength={1}
                          value={cell.userInput}
                          onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                          className={`w-full h-full text-center bg-transparent border-none outline-none uppercase font-semibold ${
                            cell.userInput && cell.userInput === cell.letter
                              ? "text-primary"
                              : cell.userInput
                                ? "text-destructive"
                                : ""
                          }`}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Clues */}
        <div className="glass rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-3 text-primary">Across</h3>
            <div className="space-y-2">
              {clues
                .filter((c) => c.direction === "across")
                .map((clue) => (
                  <div key={`across-${clue.number}`} className="text-sm">
                    <span className="font-semibold">{clue.number}.</span> {clue.clue}
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-primary">Down</h3>
            <div className="space-y-2">
              {clues
                .filter((c) => c.direction === "down")
                .map((clue) => (
                  <div key={`down-${clue.number}`} className="text-sm">
                    <span className="font-semibold">{clue.number}.</span> {clue.clue}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
