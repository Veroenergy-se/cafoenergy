import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type Tone = 'cream' | 'brown' | 'orange'

// Sets body[data-tone] from the [data-tone] section on screen. index.css animates
// the page colours from that, so sections fade into each other instead of cutting.
// Sections without data-tone keep their own colours.
//
// The section whose colour is showing keeps it for as long as it still covers part
// of the middle band of the screen (30%–70% down). So the colour holds until the
// next section has clearly taken over, in either scroll direction, and small
// back-and-forth scroll jitter can never make it flicker.
const BAND_TOP = 0.3
const BAND_BOTTOM = 0.7

export default function useToneMorph() {
  const { pathname } = useLocation()

  useEffect(() => {
    let frame = 0
    let active: HTMLElement | null = null

    const update = () => {
      frame = 0
      const h = window.innerHeight
      const sections = [...document.querySelectorAll<HTMLElement>('[data-tone]')].filter(
        (el) => el !== document.body,
      )
      const atBottom = h + window.scrollY >= document.documentElement.scrollHeight - 2

      if (atBottom) {
        // The footer may be too short to reach the band, so the last section on screen wins.
        active = sections.filter((el) => el.getBoundingClientRect().top < h).pop() ?? null
      } else {
        const covers = (el: HTMLElement, from: number, to: number) => {
          const r = el.getBoundingClientRect()
          return r.top < to && r.bottom > from
        }
        if (!active || !active.isConnected || !covers(active, h * BAND_TOP, h * BAND_BOTTOM)) {
          active =
            sections.find((el) => covers(el, h * 0.5, h * 0.5)) ??
            sections.find((el) => covers(el, h * BAND_TOP, h * BAND_BOTTOM)) ??
            null
        }
      }

      const tone = (active?.dataset.tone as Tone | undefined) ?? 'cream'
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
