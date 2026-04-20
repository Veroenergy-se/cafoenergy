const athletic = [
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

const different = [
  {
    name: 'Chakra Petch',
    style: 'Chakra Petch',
    weight: '700',
    desc: 'Angular, technical, almost military-precision. Looks like it belongs on a fighter jet.',
  },
  {
    name: 'Space Grotesk',
    style: 'Space Grotesk',
    weight: '700',
    desc: 'Premium geometric grotesque. Editorial and design-forward — less sports, more brand.',
  },
  {
    name: 'Bungee',
    style: 'Bungee',
    weight: '400',
    desc: 'Urban, bold, retro streetwear energy. Maximum personality.',
  },
  {
    name: 'Syne',
    style: 'Syne',
    weight: '800',
    desc: 'Contemporary and editorial. The kind of font a fashion or lifestyle brand would use.',
  },
  {
    name: 'Exo 2',
    style: 'Exo 2',
    weight: '800',
    desc: 'Futuristic, sharp, geometric. Feels like a running shoe or tech-performance brand.',
  },
]

const navLinks = ['Home', 'Shop', 'Community', 'Our Story']

function FontRow({ font }: { font: { name: string; style: string; weight: string; desc: string } }) {
  return (
    <div className="border border-near-black/10 overflow-hidden">
      <div className="bg-white border-b border-near-black/10 px-12 h-24 flex items-center justify-between">
        <img src="/images/logo-full.png" alt="CAFO" className="h-14 w-auto" />
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
      <div className="bg-near-black/[0.03] px-6 py-3 flex items-center justify-between">
        <span className="font-accent font-bold text-near-black text-sm">{font.name}</span>
        <span className="font-accent text-near-black/40 text-xs">{font.desc}</span>
      </div>
    </div>
  )
}

export default function FontPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow+Condensed:wght@800&family=Teko:wght@600&family=Fjalla+One&family=Russo+One&family=Chakra+Petch:wght@700&family=Space+Grotesk:wght@700&family=Bungee&family=Syne:wght@800&family=Exo+2:wght@800&display=swap');
      `}</style>

      <div className="min-h-screen bg-warm-white py-20">
        <div className="page-container">
          <h1 className="text-4xl font-heading text-near-black mb-2">Navbar Font Preview</h1>
          <p className="text-near-black/40 font-accent mb-16 text-sm">Showing each font candidate at actual navbar size. Tell me which one you like.</p>

          <h2 className="text-xs font-accent font-bold text-near-black/30 uppercase tracking-widest mb-4">Athletic / Performance</h2>
          <div className="space-y-6 mb-16">
            {athletic.map((font) => <FontRow key={font.name} font={font} />)}
          </div>

          <h2 className="text-xs font-accent font-bold text-near-black/30 uppercase tracking-widest mb-4">Different Direction</h2>
          <div className="space-y-6">
            {different.map((font) => <FontRow key={font.name} font={font} />)}
          </div>
        </div>
      </div>
    </>
  )
}
