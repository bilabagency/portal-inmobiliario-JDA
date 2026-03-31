import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/properties/PropertyCard'
import Link from 'next/link'

export default async function FeaturedProperties() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_media(*)')
    .eq('activo', true)
    .eq('destacado', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <section className="py-20 relative z-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Inmuebles Destacados</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explora las mejores oportunidades en Balcarce y alrededores.
          </p>
        </div>
        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p: Record<string, unknown>) => (
              <PropertyCard key={p.id as string} property={p as Record<string, unknown>} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No se encontraron propiedades.</p>
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            href="/buscador"
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-8 rounded-full transition-all"
          >
            Ver todos los inmuebles
          </Link>
        </div>
      </div>
    </section>
  )
}
