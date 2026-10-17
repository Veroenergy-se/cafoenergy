import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'

// The community page: lots of photos, few words. Colours fade between sections.

const INSTAGRAM = 'https://www.instagram.com/moarbars'

const PHOTOS = {
  nyc: '/images/about-nyc.jpg',
  walk: '/images/team-1.jpg',
  flip: '/images/community-frontflip.jpg',
  padel: '/images/community-padel.jpg',
  jump: '/images/community-triple360.jpg',
  founders: '/images/founders.jpg',
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent ${className}`}>{children}</p>
}

// ---------- 1 · Photo storm ----------
const STORM = [
  { src: PHOTOS.nyc, speed: -0.35, rotate: -7, className: 'left-[3%] top-[13%] w-[clamp(110px,17vw,250px)] aspect-[3/4]' },
  { src: PHOTOS.flip, speed: 0.25, rotate: 6, className: 'right-[4%] top-[9%] w-[clamp(100px,15vw,220px)] aspect-[9/16]' },
  { src: PHOTOS.jump, speed: -0.6, rotate: 4, className: 'left-[6%] bottom-[6%] w-[clamp(150px,22vw,340px)] aspect-[3/2]' },
  { src: PHOTOS.padel, speed: 0.45, rotate: -5, className: 'right-[7%] bottom-[9%] w-[clamp(110px,16vw,240px)] aspect-[3/4]' },
  { src: PHOTOS.walk, speed: -0.15, rotate: 3, className: 'left-[38%] top-[4%] w-[clamp(80px,10vw,150px)] aspect-[3/4] hidden sm:block' },
]

function StormPhoto({ src, speed, rotate, className }: (typeof STORM)[number]) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => (reduce ? 0 : Math.min(v, 1200) * speed))
  return (
    <motion.div
      className={`absolute z-[2] border-[6px] border-white shadow-[0_20px_40px_rgba(45,29,23,0.25)] ${className}`}
      style={{ y, rotate }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <img src={src} alt="" className="w-full h-full object-cover" />
    </motion.div>
  )
}

function Storm() {
  const { t } = useTranslation()
  return (
    <section data-tone="cream" className="text-fg relative min-h-[110vh] grid place-items-center overflow-hidden pt-28 pb-20">
      <div className="relative z-[5] text-center px-6">
        <Eyebrow>{t('community.hero.eyebrow')}</Eyebrow>
        <h1 className="mt-5 font-display uppercase leading-[0.9] text-[clamp(3.2rem,13vw,13rem)]">
          {t('community.hero.titleA')}<br /><span className="text-accent">{t('community.hero.titleB')}</span>
        </h1>
        <p className="mt-7 mx-auto max-w-[30ch] font-accent text-[clamp(16px,1.6vw,20px)] leading-snug">{t('community.hero.body')}</p>
      </div>
      {STORM.map((p) => <StormPhoto key={p.src} {...p} />)}
    </section>
  )
}

// ---------- 2 · Ticker ----------
function Ticker() {
  const { t } = useTranslation()
  const words = t('community.ticker', { returnObjects: true }) as string[]
  const line = (
    <span className="font-display uppercase whitespace-nowrap text-[clamp(1.3rem,3vw,2.6rem)] leading-none pr-10">
      {words.map((w) => (
        <span key={w}>{w} <span className="text-accent">●</span>{' '}</span>
      ))}
    </span>
  )
  return (
    <section data-tone="orange" className="text-fg overflow-hidden py-6 border-y-[3px] border-fg" aria-label={words.join(', ')}>
      <div className="flex w-max motion-safe:animate-[moar-tick_26s_linear_infinite]" aria-hidden="true">
        {line}{line}
      </div>
    </section>
  )
}

// ---------- 3 · Film strip: scrolls sideways while you scroll down ----------
function Film() {
  const { t } = useTranslation()
  const shots = t('community.film.shots', { returnObjects: true }) as { title: string; note: string }[]
  const srcs = [PHOTOS.walk, PHOTOS.flip, PHOTOS.padel, PHOTOS.jump, PHOTOS.nyc]
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [max, setMax] = useState(0)
  useEffect(() => {
    const measure = () => track.current && setMax(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (k) => -k * max)

  return (
    <section ref={ref} data-tone="brown" className="text-fg relative h-[320vh] md:h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-8 md:gap-10">
        <div className="page-container">
          <Eyebrow>{t('community.film.eyebrow')}</Eyebrow>
          <h2 className="mt-4 font-display uppercase leading-[0.95] text-[clamp(2.1rem,6vw,5.4rem)]">
            {t('community.film.titleA')} <span className="text-accent">{t('community.film.titleB')}</span>
          </h2>
        </div>
        <motion.div ref={track} style={{ x }} className="flex gap-5 md:gap-7 pl-6 lg:pl-12 will-change-transform">
          {shots.map((s, i) => (
            <figure key={s.title} className="m-0 shrink-0 w-[clamp(220px,30vw,440px)]">
              <div className="aspect-[4/5] max-h-[52vh] overflow-hidden bg-black">
                <img src={srcs[i % srcs.length]} alt={s.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-3">
                <b className="font-display uppercase text-[clamp(0.85rem,1.3vw,1.15rem)] leading-tight">{s.title}</b>
                <small className="font-accent text-[13px] opacity-70 text-right">{s.note}</small>
              </figcaption>
            </figure>
          ))}
          <a href={INSTAGRAM} className="shrink-0 w-[clamp(220px,30vw,440px)] aspect-[4/5] max-h-[52vh] border-[3px] border-fg grid place-items-center text-center p-8 hover:bg-fg/5 transition-colors">
            <span>
              <b className="block font-display uppercase text-[clamp(1.3rem,2.4vw,2.2rem)] leading-none">
                {t('community.film.endA')}<br /><span className="text-accent">{t('community.film.endB')}</span>
              </b>
              <span className="block mt-4 font-accent text-[15px]">{t('community.film.endTag')}</span>
            </span>
          </a>
          <div className="shrink-0 w-6 lg:w-12" />
        </motion.div>
      </div>
    </section>
  )
}

// ---------- 4 · What we stand for: a photo pops in behind each line ----------
const VALUE_PHOTOS = [
  { src: PHOTOS.flip, left: '58%', rotate: -6 },
  { src: PHOTOS.padel, left: '46%', rotate: 5 },
  { src: PHOTOS.jump, left: '66%', rotate: -3 },
]

function ValueRow({ title, body, photo }: { title: string; body: string; photo: (typeof VALUE_PHOTOS)[number] }) {
  const ref = useRef(null)
  const on = useInView(ref, { margin: '-30% 0px -28% 0px' })
  return (
    <div ref={ref} className="relative overflow-hidden border-t-[3px] border-fg last:border-b-[3px] py-[clamp(18px,3vw,34px)]">
      <img
        src={photo.src}
        alt=""
        loading="lazy"
        className="absolute z-[1] top-1/2 w-[clamp(140px,22vw,320px)] aspect-[4/5] object-cover border-[6px] border-white transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{
          left: photo.left,
          opacity: on ? 1 : 0,
          transform: `translate(-50%, -50%) rotate(${photo.rotate}deg) scale(${on ? 1 : 0.6})`,
        }}
      />
      <div className="relative z-[2] flex flex-col md:flex-row md:justify-between md:items-baseline gap-3 md:gap-5">
        <h3 className="font-display uppercase leading-[0.92] text-[clamp(1.8rem,7.4vw,8.6rem)]">{title}</h3>
        <p className="font-accent text-[clamp(14px,1.2vw,16px)] leading-snug max-w-[26ch] md:text-right">{body}</p>
      </div>
    </div>
  )
}

function Values() {
  const { t } = useTranslation()
  const values = t('community.values.items', { returnObjects: true }) as { title: string; body: string }[]
  return (
    <section data-tone="cream" className="text-fg py-24 lg:py-36">
      <div className="page-container">
        <Eyebrow className="mb-6">{t('community.values.eyebrow')}</Eyebrow>
        {values.map((v, i) => <ValueRow key={v.title} {...v} photo={VALUE_PHOTOS[i]} />)}
      </div>
    </section>
  )
}

// ---------- 5 · Founders note ----------
function Founders() {
  const { t } = useTranslation()
  return (
    <section data-tone="brown" className="text-fg py-24 lg:py-32">
      <div className="page-container grid md:grid-cols-[1.15fr_1fr] gap-12 md:gap-16 items-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <img src={PHOTOS.founders} alt={t('community.founders.alt')} loading="lazy" className="w-full aspect-[4/3] object-cover" />
          <span className="absolute right-2 md:-right-4 -bottom-5 bg-caforange text-brown font-display uppercase text-[clamp(0.85rem,1.4vw,1.2rem)] px-4 py-3 -rotate-[4deg]">
            {t('community.founders.stamp')}
          </span>
        </motion.div>
        <div>
          <h2 className="font-display uppercase leading-[0.95] text-[clamp(2rem,4.6vw,4.2rem)]">
            {t('community.founders.titleA')} <span className="text-accent">{t('community.founders.titleB')}</span>
          </h2>
          <p className="mt-6 mb-8 font-accent text-[clamp(16px,1.4vw,19px)] leading-relaxed opacity-90 max-w-[38ch]">{t('community.founders.body')}</p>
          <Link to="/about" className="inline-block text-accent font-display uppercase text-sm border-b-[3px] border-current pb-1.5">
            {t('community.founders.link')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ---------- 6 · Be in the next photo ----------
function YouTile({ label, tag }: { label: string; tag: string }) {
  return (
    <a href={INSTAGRAM} className="aspect-square border-[3px] border-dashed border-brown grid place-items-center text-center p-3 hover:bg-brown/10 transition-colors">
      <span>
        <b className="block font-display uppercase text-[clamp(0.8rem,1.5vw,1.3rem)] leading-tight">{label}</b>
        <small className="block mt-2 font-accent font-bold text-[13px]">{tag}</small>
      </span>
    </a>
  )
}

function Photo({ src, className = '' }: { src: string; className?: string }) {
  return (
    <a href={INSTAGRAM} className={`aspect-square overflow-hidden relative group ${className}`}>
      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </a>
  )
}

function NextPhoto() {
  const { t } = useTranslation()
  const tag = '#moarbars'
  return (
    <section data-tone="orange" className="text-fg pt-24 lg:pt-32 pb-32 lg:pb-40">
      <div className="page-container">
        <h2 className="font-display uppercase leading-[0.92] text-[clamp(2.4rem,9vw,8.6rem)]">
          {t('community.next.titleA')}<br />{t('community.next.titleB')}
        </h2>
        <p className="mt-6 max-w-[36ch] font-accent text-[clamp(16px,1.5vw,20px)] leading-snug">{t('community.next.body')}</p>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <a href={INSTAGRAM} className="col-span-2 row-span-2 overflow-hidden relative group">
            <img src={PHOTOS.nyc} alt="" loading="lazy" className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute left-2.5 bottom-2.5 bg-brown text-off-white font-accent font-bold text-[11px] px-2 py-1.5">@moarbars</span>
          </a>
          <Photo src={PHOTOS.flip} />
          <YouTile label={t('community.next.yours')} tag={tag} />
          <Photo src={PHOTOS.padel} />
          <Photo src={PHOTOS.jump} />
          <YouTile label={t('community.next.yours')} tag={tag} />
          <Photo src={PHOTOS.walk} />
          <Photo src={PHOTOS.founders} />
          <YouTile label={t('community.next.yoursShort')} tag={tag} />
        </div>
        <div className="mt-12 flex flex-wrap gap-3.5">
          <a href={INSTAGRAM} className="inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
            {t('community.next.follow')}
          </a>
          <Link to="/shop" className="inline-block border-[3px] border-brown text-brown px-7 py-[17px] font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
            {t('community.next.shop')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Community() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('community.metaTitle')}</title>
        <meta name="description" content={t('community.metaDescription')} />
      </Helmet>
      <Storm />
      <Ticker />
      <Film />
      <Values />
      <Founders />
      <NextPhoto />
    </>
  )
}
