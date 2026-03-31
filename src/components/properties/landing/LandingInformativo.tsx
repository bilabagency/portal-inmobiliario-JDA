'use client'

import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Home, MessageCircle } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import MediaGallery from '@/components/properties/MediaGallery'
import { formatPrecio } from '@/lib/utils/format'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface LandingInformativoProps {
  property: Record<string, unknown>
  config: Record<string, string>
}

export default function LandingInformativo({ property, config }: LandingInformativoProps) {
  const p = property
  const media = ((p.property_media as Array<Record<string, unknown>>) || []).sort((a, b) => (a.orden as number) - (b.orden as number))
  const images = media.filter(m => m.tipo === 'imagen')
  const videos = media.filter(m => m.tipo === 'video')
  const mainImage = images.find(m => m.es_principal)?.url as string || images[0]?.url as string || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000'
  const precioTexto = formatPrecio(p.precio as number | null, p.moneda as string | null)

  const details = [
    { label: 'Tipologia', value: p.tipologia as string },
    { label: 'Operacion', value: p.operacion as string },
    { label: 'Precio', value: precioTexto },
    { label: 'Dormitorios', value: p.dormitorios != null ? String(p.dormitorios) : null },
    { label: 'Banos', value: p.banos != null ? String(p.banos) : null },
    { label: 'Superficie Total', value: p.superficie_total ? `${p.superficie_total} m2` : null },
    { label: 'Superficie Cubierta', value: p.superficie_cubierta ? `${p.superficie_cubierta} m2` : null },
    { label: 'Barrio', value: p.barrio as string },
    { label: 'Direccion', value: p.direccion as string },
  ].filter(d => d.value)

  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <img src="https://images.wasi.co/empresas/b20221124082928320437.png" alt="Logo" className="h-12 object-contain" />
          </Link>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="w-3 h-3" /> Inicio</Link>
          <span>/</span>
          <span>{p.tipologia as string}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{p.titulo as string}</span>
        </div>
      </div>

      {/* Main image */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-gray-900 overflow-hidden">
        <img src={mainImage} alt={p.titulo as string} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-6 pb-8">
            <div className={`${p.operacion === 'Venta' ? 'bg-primary' : 'bg-blue-600'} px-4 py-1 rounded text-xs font-bold text-white inline-block mb-3 uppercase tracking-wider`}>
              En {(p.operacion as string) || 'Venta'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{p.titulo as string}</h1>
            <p className="text-gray-300 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {(p.barrio as string) || 'Balcarce'}, Buenos Aires
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Precio</p>
              <p className="text-4xl font-bold text-primary">{precioTexto}</p>
            </div>

            {/* Details table */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Caracteristicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {details.map((d, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{d.label}</p>
                    <p className="font-semibold text-gray-900">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {p.descripcion ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripcion</h2>
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{p.descripcion as string}</p>
              </div>
            ) : null}

            {/* Gallery */}
            {images.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeria</h2>
                <MediaGallery media={images.map(m => ({ url: m.url as string, tipo: m.tipo as string }))} />
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>
                <div className="space-y-6">
                  {videos.map((v, i) => (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-black">
                      <ReactPlayer src={v.url as string} width="100%" height="100%" controls />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar contact */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">¿Te interesa esta propiedad?</h3>
              <ContactForm propertyId={p.id as string} propertyTitle={p.titulo as string} />
            </div>
          </div>
        </div>
      </div>

      {/* Full-width contact */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Dejanos tu consulta</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ContactForm propertyId={p.id as string} propertyTitle={p.titulo as string} />
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      {config.contacto_whatsapp && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={`https://wa.me/${config.contacto_whatsapp}?text=Hola, me interesa la propiedad: ${p.titulo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      )}

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-200 bg-gray-50">
        <img src="https://images.wasi.co/empresas/b20221124082928320437.png" alt="Logo" className="h-8 mx-auto mb-4 opacity-50" />
        <p>2026 Rodriguez Alberghini | Negocios Inmobiliarios. Balcarce, Buenos Aires.</p>
      </footer>
    </>
  )
}
