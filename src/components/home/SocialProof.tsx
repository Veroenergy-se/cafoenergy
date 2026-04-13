import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function SocialProof() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#141414] py-24">
      <div className="page-container">
        <AnimatedSection>
          <p className="text-center text-5xl sm:text-7xl lg:text-8xl xl:text-[5.5rem] font-heading text-[#F2EDE6] tracking-wide leading-tight">
            {t('socialProof.tagline')}
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
