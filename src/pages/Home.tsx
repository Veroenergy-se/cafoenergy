import { Helmet } from 'react-helmet-async'
import Hero from '@/components/home/Hero'
import BrandMarquee from '@/components/home/BrandMarquee'
import Manifesto from '@/components/home/Manifesto'
import TradeOff from '@/components/home/TradeOff'
import InsideBar from '@/components/home/InsideBar'
import NutritionComparison from '@/components/home/NutritionComparison'
import TwoInOne from '@/components/home/TwoInOne'
import ProductCards from '@/components/home/ProductCards'
import DayTimeline from '@/components/home/DayTimeline'
import StoryTeaser from '@/components/home/StoryTeaser'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>MOAR Bar — More energy. More focus.</title>
        <meta name="description" content="The caffeinated protein bar. 90 mg natural caffeine and 14 g protein in one bar: your coffee and your snack in one." />
      </Helmet>
      <Hero />
      <BrandMarquee />
      <ProductCards />
      <Manifesto />
      <TradeOff />
      <InsideBar />
      <NutritionComparison />
      <TwoInOne />
      <DayTimeline />
      <StoryTeaser />
    </>
  )
}
