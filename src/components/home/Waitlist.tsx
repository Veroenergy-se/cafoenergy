import { useState } from 'react'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('https://app.loops.so/api/newsletter-form/cmnxezmsk03cm0iymzrn4dore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userGroup=&mailingLists=&email=${encodeURIComponent(email)}`,
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="waitlist" className="bg-near-black py-24 lg:py-32">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <AnimatedSection className="w-full">
          <h2 className="text-6xl sm:text-7xl lg:text-9xl font-heading text-white leading-[0.9] tracking-tight mb-4">
            BE THE FIRST.
          </h2>
          <p className="text-white/50 font-accent text-lg mb-12">
            Join the waitlist — we'll let you know the moment CAFO drops.
          </p>

          {status === 'success' ? (
            <div className="inline-block border-2 border-white/20 px-10 py-5">
              <p className="text-white font-heading text-3xl tracking-wide">YOU'RE ON THE LIST.</p>
              <p className="text-white/50 font-accent text-sm mt-1">We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-0 max-w-xl mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full sm:flex-1 px-6 py-4 bg-white/5 border-2 border-white/20 text-white placeholder-white/30 font-accent text-base focus:outline-none focus:border-white/60 transition-colors sm:border-r-0"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-10 py-4 bg-white text-near-black font-heading text-xl tracking-widest uppercase hover:bg-white/90 transition-colors disabled:opacity-50 border-2 border-white"
              >
                {status === 'loading' ? '...' : 'JOIN'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-4 text-red-400 font-accent text-sm">Something went wrong — please try again.</p>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}
