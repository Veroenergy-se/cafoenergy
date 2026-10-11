interface Props {
  className?: string
}

// The official MOAR primary logo (MOAR + "BAR", from brand/logos). It is drawn as a
// mask filled with the current text colour, so callers pick the colourway. The brand
// guidelines allow: orange on off-white or brown, white on orange; minimum 35 px tall;
// never rotated, faded, outlined or given effects.
export default function MoarLogo({ className = '' }: Props) {
  const src = '/images/moar-logo.svg'
  return (
    <span
      role="img"
      aria-label="MOAR Bar"
      className={`inline-block bg-current ${className}`}
      style={{
        aspectRatio: '518.24 / 184.83',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}
