interface Props {
  className?: string
  /** Include the spaced "BAR" line under the wordmark. */
  full?: boolean
}

// The logo is an SVG used as a mask, so it takes the current text colour
// (orange on dark, cream on orange, brown on light) instead of shipping one file per colour.
export default function MoarLogo({ className = '', full = false }: Props) {
  const src = full ? '/images/moar-logo.svg' : '/images/moar-wordmark.svg'
  return (
    <span
      role="img"
      aria-label="MOAR Bar"
      className={`inline-block bg-current ${className}`}
      style={{
        aspectRatio: full ? '1094 / 396' : '1094 / 312',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    />
  )
}
