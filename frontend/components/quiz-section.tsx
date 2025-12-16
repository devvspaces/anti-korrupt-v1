"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "final"],
    correctAnswer: 2,
    explanation: "'const' is used to declare constants that cannot be reassigned after initialization.",
  },
  {
    id: 2,
    question: "What is the correct syntax for an arrow function?",
    options: ["function => {}", "() => {}", "=> function()", "function() =>"],
    correctAnswer: 1,
    explanation: "Arrow functions use the syntax () => {} for parameters and function body.",
  },
  {
    id: 3,
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: 0,
    explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
  },
  {
    id: 4,
    question: "What does 'this' refer to in an arrow function?",
    options: ["The global object", "The function itself", "The lexical scope", "Undefined"],
    correctAnswer: 2,
    explanation:
      "Arrow functions don't have their own 'this' binding. They inherit 'this' from the parent scope (lexical scoping).",
  },
]

export function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false))

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctAnswer
  const isLastQuestion = currentQuestion === questions.length - 1

  const handleAnswerSelect = (index: number) => {
    if (!answeredQuestions[currentQuestion]) {
      setSelectedAnswer(index)
      setShowExplanation(true)

      const newAnswered = [...answeredQuestions]
      newAnswered[currentQuestion] = true
      setAnsweredQuestions(newAnswered)

      if (index === question.correctAnswer) {
        setScore(score + 1)
      }
    }
  }

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setAnsweredQuestions(new Array(questions.length).fill(false))
  }

  const allAnswered = answeredQuestions.every((answered) => answered)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Knowledge Check Quiz</h2>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Score Display */}
      {allAnswered && (
        <div className="glass rounded-xl p-6 text-center space-y-4">
          <h3 className="text-2xl font-bold">Quiz Complete!</h3>
          <p className="text-4xl font-bold text-primary">
            {score} / {questions.length}
          </p>
          <p className="text-muted-foreground">You got {Math.round((score / questions.length) * 100)}% correct</p>
          <Button onClick={handleReset}>Restart Quiz</Button>
        </div>
      )}

      {/* Question */}
      {!allAnswered && (
        <div className="glass rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrectOption = index === question.correctAnswer
                const showResult = showExplanation

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answeredQuestions[currentQuestion]}
                    className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                      !showResult
                        ? "border-secondary hover:border-primary bg-secondary/20 hover:bg-secondary/40"
                        : isSelected && isCorrect
                          ? "border-green-500 bg-green-500/20"
                          : isSelected && !isCorrect
                            ? "border-red-500 bg-red-500/20"
                            : isCorrectOption
                              ? "border-green-500 bg-green-500/20"
                              : "border-secondary bg-secondary/20 opacity-50"
                    } ${answeredQuestions[currentQuestion] ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isSelected && (
                        <span>
                          {isCorrect ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </span>
                      )}
                      {showResult && !isSelected && isCorrectOption && <Check className="w-5 h-5 text-green-500" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/20" : "bg-red-500/20"}`}>
              <h4 className="font-semibold mb-2">{isCorrect ? "Correct!" : "Incorrect"}</h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          {showExplanation && !isLastQuestion && (
            <Button onClick={handleNext} className="w-full">
              Next Question
            </Button>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>
            {answeredQuestions.filter(Boolean).length} / {questions.length}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${(answeredQuestions.filter(Boolean).length / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
