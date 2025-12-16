interface ProgressRingProps {
  progress: number
}

export function ProgressRing({ progress }: ProgressRingProps) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={radius} className="stroke-secondary/30" strokeWidth="4" fill="none" />
      <circle
        cx="28"
        cy="28"
        r={radius}
        className="stroke-primary transition-all duration-500"
        strokeWidth="4"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}
