import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { PileScene } from './pileScene'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

// The orange panel in the shop builder: real 3D bars fall and pile up, `count` of them.
// The 3D code is loaded only when this mounts; without WebGL a single bar is shown.
export default function BarPile3D({ count, dropLabel, children }: { count: number; dropLabel: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const scene = useRef<PileScene | null>(null)
  const latest = useRef(count)
  const [fallback, setFallback] = useState(false)
  latest.current = count

  useEffect(() => {
    if (!hasWebGL()) { setFallback(true); return }
    let cancelled = false
    import('./pileScene')
      .then(({ createPileScene }) => {
        if (cancelled || !ref.current) return
        scene.current = createPileScene(ref.current, '/images/moar-wrapper-tex.jpg')
        scene.current.setCount(latest.current)
      })
      .catch(() => setFallback(true))
    return () => {
      cancelled = true
      scene.current?.dispose()
      scene.current = null
    }
  }, [])

  useEffect(() => { scene.current?.setCount(count) }, [count])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-h-[360px] h-[360px] sm:h-[440px] lg:h-auto lg:min-h-[560px] bg-[radial-gradient(120%_90%_at_50%_45%,#ff6a1c_0%,#ff5900_55%,#e84f00_100%)]"
    >
      {fallback && (
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <img src="/images/moar-wrapper.png" alt="" className="w-[28%] -rotate-12 drop-shadow-[0_30px_30px_rgba(45,29,23,0.45)]" />
        </div>
      )}
      {children}
      {!fallback && (
        <button
          type="button"
          onClick={() => scene.current?.dropAgain()}
          className="absolute z-10 right-3.5 bottom-3.5 bg-brown/85 text-off-white px-3 py-2 font-accent text-[11px] uppercase tracking-[0.12em] font-semibold hover:bg-brown"
        >
          {dropLabel}
        </button>
      )}
    </div>
  )
}
