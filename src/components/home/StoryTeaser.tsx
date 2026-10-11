import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ArrowRight } from 'lucide-react'

export default function StoryTeaser() {
  const { t } = useTranslation()

  return (
    <section data-tone="cream" className="py-20 lg:py-28 text-fg">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('nav.about')}</p>
            <h2 className="mt-3 font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">
              {t('story.title')}
            </h2>
            <p className="mt-6 text-lg text-fg/80 leading-relaxed max-w-lg">
              {t('story.subtitle')}
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-1 font-accent font-semibold text-sm uppercase tracking-[0.12em] hover:gap-3 transition-all duration-300"
            >
              {t('story.cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="aspect-[4/3] overflow-hidden bg-fg/5">
              <img
                src="/images/founders.jpg"
                alt="MOAR Bar founders"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
