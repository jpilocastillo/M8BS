interface CircularProgressProps {
  value: number
  secondaryValue?: number
  size?: number
  strokeWidth?: number
  primaryColor?: string
  secondaryColor?: string
  centerText?: string
}

export default function CircularProgress({
  value,
  secondaryValue,
  size = 120,
  strokeWidth = 12,
  primaryColor = "#2c7be5",
  secondaryColor = "#050117",
  centerText,
}: CircularProgressProps) {
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const primaryOffset = circumference - (value / 100) * circumference
  const secondaryOffset = secondaryValue ? circumference - (secondaryValue / 100) * circumference : circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c7be5" />
            <stop offset="100%" stopColor="#27bcfd" />
          </linearGradient>
          <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27bcfd" />
            <stop offset="100%" stopColor="#00d27a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
          opacity="0.2"
        />
        {secondaryValue && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#secondaryGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={secondaryOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="round"
            filter="url(#glow)"
          />
        )}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#primaryGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={primaryOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
          filter="url(#glow)"
        />
      </svg>
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {centerText}
          </span>
        </div>
      )}
      {value && !centerText && (
        <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] px-2 py-1 text-xs font-medium text-white shadow-lg">
          {value}%
        </div>
      )}
      {secondaryValue && !centerText && (
        <div className="absolute bottom-0 left-0 rounded-full bg-gradient-to-r from-[#27bcfd] to-[#00d27a] px-2 py-1 text-xs font-medium text-white shadow-lg">
          {secondaryValue}%
        </div>
      )}
    </div>
  )
}

