interface Props {
  className?: string
}

export default function CafoLogo({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 660 380"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CAFO — Caffinated Focus"
      className={className}
      fill="currentColor"
    >
      <text
        x="330"
        y="268"
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="290"
        letterSpacing="4"
      >
        CAFO
      </text>
      <text
        x="330"
        y="348"
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="68"
        letterSpacing="14"
      >
        CAFFINATED FOCUS
      </text>
    </svg>
  )
}
