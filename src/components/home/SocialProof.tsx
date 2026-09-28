import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function SocialProof() {
  const { t } = useTranslation()

  return (
    <section className="bg-off-white py-24">
      <div className="page-container">
        <AnimatedSection>
          <p className="text-center text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-heading text-brown tracking-wide leading-tight">
            {t('socialProof.tagline')}
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
