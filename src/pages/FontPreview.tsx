const fonts = [
  {
    name: 'Oswald',
    style: 'Oswald',
    weight: '700',
    desc: 'Tall, condensed, athletic. The classic sports/performance font.',
  },
  {
    name: 'Barlow Condensed',
    style: 'Barlow Condensed',
    weight: '800',
    desc: 'Modern, slightly wider, great attitude for a younger performance brand.',
  },
  {
    name: 'Teko',
    style: 'Teko',
    weight: '600',
    desc: 'Geometric, condensed, military/technical edge. Distinctive.',
  },
  {
    name: 'Fjalla One',
    style: 'Fjalla One',
    weight: '400',
    desc: 'High contrast strokes, strong personality, editorial meets athletic.',
  },
  {
    name: 'Russo One',
    style: 'Russo One',
    weight: '400',
    desc: 'Bold, geometric, slightly futuristic. Sharp and modern.',
  },
]

const navLinks = ['Home', 'Shop', 'Community', 'Our Story']

export default function FontPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow+Condensed:wght@800&family=Teko:wght@600&family=Fjalla+One&family=Russo+One&display=swap');
      `}</style>

      <div className="min-h-screen bg-warm-white py-20">
        <div className="page-container">
          <h1 className="text-4xl font-heading text-near-black mb-2">Navbar Font Preview</h1>
          <p className="text-near-black/40 font-accent mb-16 text-sm">Showing each font candidate at actual navbar size. Tell me which one you like.</p>

          <div className="space-y-6">
            {fonts.map((font) => (
              <div key={font.name} className="border border-near-black/10 overflow-hidden">
                {/* Mini navbar */}
                <div className="bg-white border-b border-near-black/10 px-12 h-24 flex items-center justify-between">
                  <img src="/images/logo-full.png" alt="CAFO" className="h-14 w-auto" style={{ filter: 'none' }} />

                  <div className="flex items-center gap-8">
                    {navLinks.map(link => (
                      <span
                        key={link}
                        style={{ fontFamily: `'${font.style}', sans-serif`, fontWeight: font.weight, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                        className="text-near-black"
                      >
                        {link}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{ fontFamily: `'${font.style}', sans-serif`, fontWeight: font.weight, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    className="px-8 py-3.5 bg-near-black text-white border-2 border-near-black"
                  >
                    Get Energized
                  </div>
                </div>

                {/* Label */}
                <div className="bg-near-black/[0.03] px-6 py-3 flex items-center justify-between">
                  <span className="font-accent font-bold text-near-black text-sm">{font.name}</span>
                  <span className="font-accent text-near-black/40 text-xs">{font.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
