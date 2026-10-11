import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type Tone = 'cream' | 'brown' | 'orange'

// Sets body[data-tone] from the [data-tone] section that covers the middle of the
// screen. index.css animates the page colours from that, so sections fade into
// each other instead of cutting. Sections without data-tone keep their own colours.
export default function useToneMorph() {
  const { pathname } = useLocation()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight * 0.55
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      let tone: Tone = 'cream'
      for (const el of document.querySelectorAll<HTMLElement>('[data-tone]')) {
        if (el === document.body) continue
        const r = el.getBoundingClientRect()
        // At the very bottom the footer may be too short to reach the middle line,
        // so the last section that is on screen wins.
        if (atBottom ? r.top < window.innerHeight : r.top <= mid && r.bottom > mid) {
          tone = el.dataset.tone as Tone
          if (!atBottom) break
        }
      }
      if (document.body.dataset.tone !== tone) document.body.dataset.tone = tone
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])
}
