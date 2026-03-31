import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LandingVisual from '@/components/properties/landing/LandingVisual'
import LandingInformativo from '@/components/properties/landing/LandingInformativo'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: property } = await supabase
    .from('properties')
    .select('titulo, descripcion, property_media(*)')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (!property) return { title: 'Propiedad no encontrada' }

  const media = (property.property_media as Array<Record<string, unknown>>) || []
  const mainImage = media.find((m: Record<string, unknown>) => m.es_principal)?.url as string || media[0]?.url as string || undefined

  return {
    title: `${property.titulo} | Rodriguez Alberghini`,
    description: property.descripcion?.substring(0, 160) || 'Propiedad en Balcarce, Buenos Aires.',
    openGraph: {
      title: property.titulo,
      description: property.descripcion?.substring(0, 160) || undefined,
      images: mainImage ? [mainImage] : undefined,
    },
  }
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*, property_media(*)')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (!property) notFound()

  const { data: configRows } = await supabase.from('site_config').select('key, value')
  const config: Record<string, string> = {}
  configRows?.forEach((row: { key: string; value: string | null }) => {
    config[row.key] = row.value || ''
  })

  if (property.landing_tipo === 'informativo') {
    return <LandingInformativo property={property} config={config} />
  }

  return <LandingVisual property={property} config={config} />
}
