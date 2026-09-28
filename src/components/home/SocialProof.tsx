import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function SocialProof() {
  const { t } = useTranslation()

  return (
    <section className="bg-off-white py-24">
      <div className="page-container">
        <AnimatedSection>
          <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading text-brown tracking-wide leading-tight">
            {t('socialProof.tagline')}
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
