"use client"

interface CircularProgressProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  showValue?: boolean
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 12,
  color = "#0284C7",
  label,
  showValue = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0f2fe"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span 
            className="text-3xl font-extrabold"
            style={{ color }}
          >
            {Math.round(value)}
          </span>
        )}
        {label && (
          <span className="text-xs font-bold text-[#7DD3FC] mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

