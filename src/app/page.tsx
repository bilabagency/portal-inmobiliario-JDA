import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MetaPixel from '@/components/layout/MetaPixel'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import AboutSection from '@/components/home/AboutSection'
import ContactSection from '@/components/home/ContactSection'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const { data: configRows } = await supabase.from('site_config').select('key, value')

  const config: Record<string, string> = {}
  configRows?.forEach((row: { key: string; value: string | null }) => {
    config[row.key] = row.value || ''
  })

  return (
    <>
      <MetaPixel pixelId={config.meta_pixel_id} />
      <Navbar />
      <HeroSection config={config} />
      <FeaturedProperties />
      <AboutSection config={config} />
      <ContactSection />
      <Footer />
    </>
  )
}
