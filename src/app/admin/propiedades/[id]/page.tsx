'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import PropertyForm from '@/components/admin/PropertyForm'

export default function EditPropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [property, setProperty] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase.from('properties').select('*, property_media(*)').eq('id', id).single()
      setProperty(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>
  if (!property) return <p className="text-center py-20 text-gray-500">Propiedad no encontrada</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Propiedad</h1>
      <PropertyForm property={property} />
    </div>
  )
}
