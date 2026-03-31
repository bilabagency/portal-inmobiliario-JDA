import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AboutSection from '@/components/home/AboutSection'
import ContactSection from '@/components/home/ContactSection'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function QuienesSomosPage() {
  const supabase = await createClient()
  const { data: configRows } = await supabase.from('site_config').select('key, value')

  const config: Record<string, string> = {}
  configRows?.forEach((row: { key: string; value: string | null }) => {
    config[row.key] = row.value || ''
  })

  return (
    <>
      <Navbar />
      <div className="pt-8">
        <AboutSection config={config} />
        <ContactSection />
      </div>
      <Footer />
    </>
  )
}
