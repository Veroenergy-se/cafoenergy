import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'

// "*text*" in the copy marks the highlighted phrases.
function toWords(text: string) {
  return text.split('*').flatMap((part, i) =>
    part.split(/\s+/).filter(Boolean).map((w) => ({ w, hl: i % 2 === 1 })),
  )
}

export default function Manifesto() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const words = useMemo(() => toWords(t('manifesto.text')), [t])
  const [lit, setLit] = useState(reduce ? words.length : 0)

  // Words light up one by one while the paragraph travels from 80% to 35% of the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.35'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!reduce) setLit(Math.round(p * words.length))
  })

  return (
    <section data-tone="brown" className="text-fg py-24 lg:py-36">
      <div className="page-container">
        <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('manifesto.eyebrow')}</p>
        <p
          ref={ref}
          aria-label={words.map((x) => x.w).join(' ')}
          className="mt-6 max-w-[22ch] font-display uppercase leading-[1.02] text-[clamp(1.7rem,4.3vw,4.3rem)]"
        >
          {words.map((x, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`transition-opacity duration-300 ${i < lit ? 'opacity-100' : 'opacity-15'} ${x.hl ? 'text-accent' : ''}`}
            >
              {x.w}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
