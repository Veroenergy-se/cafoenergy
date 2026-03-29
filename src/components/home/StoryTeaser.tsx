import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ArrowRight } from 'lucide-react'

export default function StoryTeaser() {
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-near-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-white leading-tight">
              {t('story.title')}
            </h2>
            <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-lg">
              {t('story.subtitle')}
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-gold font-semibold font-accent hover:gap-3 transition-all duration-300"
            >
              {t('story.cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white/5">
              <img
                src="/images/founders.jpg"
                alt="CAFO Energy founders"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
