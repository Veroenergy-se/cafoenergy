import { Helmet } from 'react-helmet-async'
import Hero from '@/components/home/Hero'
import SocialProof from '@/components/home/SocialProof'
import ProductCards from '@/components/home/ProductCards'
import NutritionComparison from '@/components/home/NutritionComparison'
import Testimonials from '@/components/home/Testimonials'
import StoryTeaser from '@/components/home/StoryTeaser'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>CAFO Energy — Focus. For Hours.</title>
        <meta name="description" content="The clean caffeinated protein bar. Real energy that lasts, with green tea caffeine, protein, and zero added sugar. No crash, no nonsense." />
      </Helmet>
      <Hero />
      <SocialProof />
      <ProductCards />
      <NutritionComparison />
      <Testimonials />
      <StoryTeaser />
    </>
  )
}
