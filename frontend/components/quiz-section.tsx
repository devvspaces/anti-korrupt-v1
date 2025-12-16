"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { resourcesApi } from "@/lib/api"

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  hint?: string
  correctExplanation?: string
  incorrectExplanation?: string
}

interface QuizSectionProps {
  resourceId: number
  onQuizComplete?: () => void
}

export function QuizSection({ resourceId, onQuizComplete }: QuizSectionProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passingScore, setPassingScore] = useState(80)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])

  // Fetch quiz from API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true)
        const data = await resourcesApi.getQuiz(resourceId)
        setQuestions(data.questions || [])
        setPassingScore(data.passingScore || 80)
        setAnsweredQuestions(new Array(data.questions?.length || 0).fill(false))
      } catch (err) {
        console.error("Failed to load quiz:", err)
        setError("Failed to load quiz")
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuiz()
  }, [resourceId])

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No quiz available</p>
      </div>
    )
  }

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

  // Call onQuizComplete when all questions are answered and score is passing
  useEffect(() => {
    if (allAnswered && questions.length > 0) {
      const percentage = (score / questions.length) * 100
      if (percentage >= passingScore && onQuizComplete) {
        onQuizComplete()
      }
    }
  }, [allAnswered, score, questions.length, passingScore, onQuizComplete])

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
              {isCorrect && question.correctExplanation && (
                <p className="text-sm text-muted-foreground">{question.correctExplanation}</p>
              )}
              {!isCorrect && question.incorrectExplanation && (
                <p className="text-sm text-muted-foreground">{question.incorrectExplanation}</p>
              )}
              {!isCorrect && !question.incorrectExplanation && question.correctExplanation && (
                <p className="text-sm text-muted-foreground">{question.correctExplanation}</p>
              )}
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
