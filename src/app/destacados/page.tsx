import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/properties/PropertyCard'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function DestacadosPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_media(*)')
    .eq('activo', true)
    .eq('destacado', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Inmuebles Destacados</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explora las mejores oportunidades en Balcarce y alrededores.
          </p>
        </div>
        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p: Record<string, unknown>) => (
              <PropertyCard key={p.id as string} property={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No hay propiedades destacadas por el momento.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
