interface Props {
  className?: string
  invert?: boolean
}

export default function CafoLogo({ className = '', invert = false }: Props) {
  return (
    <img
      src="/images/logo-full.svg"
      alt="CAFO — Caffinated Focus"
      className={className}
      style={invert ? { filter: 'invert(1)' } : undefined}
    />
  )
}
