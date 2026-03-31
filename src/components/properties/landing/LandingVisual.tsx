'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize, ArrowLeft, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { formatPrecio } from '@/lib/utils/format'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface LandingVisualProps {
  property: Record<string, unknown>
  config: Record<string, string>
}

function buildUbicacion(p: Record<string, unknown>): string {
  const parts: string[] = []
  if (p.barrio) parts.push(p.barrio as string)
  if (p.localidad) parts.push(p.localidad as string)
  if (parts.length === 0) parts.push('Buenos Aires')
  return parts.join(', ')
}

export default function LandingVisual({ property, config }: LandingVisualProps) {
  const p = property
  const media = ((p.property_media as Array<Record<string, unknown>>) || []).sort((a, b) => (a.orden as number) - (b.orden as number))
  const images = media.filter(m => m.tipo === 'imagen')
  const videos = media.filter(m => m.tipo === 'video')

  // Portada: buscar el media marcado como principal (puede ser foto o video)
  const principal = media.find(m => m.es_principal)
  const portadaEsVideo = principal?.tipo === 'video'
  const portadaVideoUrl = portadaEsVideo ? principal?.url as string : null
  const portadaImageUrl = !portadaEsVideo
    ? (principal?.url as string || images[0]?.url as string || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000')
    : (images[0]?.url as string || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000')

  const precioTexto = formatPrecio(p.precio as number | null, p.moneda as string | null)
  const ubicacion = buildUbicacion(p)

  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50 px-6 py-4 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center">
        <Link href="/">
          <img
            src="https://images.wasi.co/empresas/b20221124082928320437.png"
            alt="Logo"
            className="h-10 object-contain brightness-0 invert"
          />
        </Link>
        <Link
          href="/"
          className="text-white border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all flex items-center gap-2 font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>
      </div>

      {/* Hero fullscreen */}
      <div className="relative w-full h-[92vh] min-h-[600px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {portadaEsVideo && portadaVideoUrl ? (
            <ReactPlayer
              src={portadaVideoUrl}
              width="100%"
              height="100%"
              playing
              muted
              loop
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          ) : (
            <img src={portadaImageUrl} alt={p.titulo as string} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-6 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <div className={`${p.operacion === 'Venta' ? 'bg-primary' : 'bg-blue-600'} px-4 py-1 rounded text-xs font-bold text-white inline-flex items-center mb-4 uppercase tracking-wider`}>
                  En {(p.operacion as string) || 'Venta'}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
                  {p.titulo as string}
                </h1>
                <p className="text-xl text-gray-300 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  {ubicacion}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Precio</p>
                <p className="text-4xl md:text-5xl font-bold text-white">{precioTexto}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data bar */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between py-5 gap-6">
            <div className="flex flex-wrap items-center gap-8 md:gap-12">
              {p.dormitorios != null ? (
                <div className="flex items-center gap-3">
                  <Bed className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-3xl font-bold text-white">{p.dormitorios as number}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Dormitorios</p>
                  </div>
                </div>
              ) : null}
              {(p.banos as number) > 0 ? (
                <div className="flex items-center gap-3">
                  <Bath className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-3xl font-bold text-white">{p.banos as number}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Banos</p>
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-3">
                <Maximize className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-3xl font-bold text-white">{(p.superficie_total as number) || 0}<span className="text-lg">m2</span></p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Superficie</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => document.getElementById('formPrincipal')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg flex items-center gap-3 text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Solicitar info
            </button>
          </div>
        </div>
      </div>

      {/* Description + Gallery preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Sobre esta propiedad</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{p.titulo as string}</h2>
              <div className="w-16 h-1 bg-primary mb-8" />
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {(p.descripcion as string) || 'Contactanos para mas informacion sobre esta propiedad.'}
              </p>
              <button
                onClick={() => document.getElementById('formPrincipal')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Solicitar detalles
              </button>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={images[0]?.url as string}
                  className="col-span-2 w-full h-64 object-cover rounded-xl cursor-pointer hover:opacity-90"
                  onClick={() => setLightbox(0)}
                  alt=""
                />
                {images.length > 1 ? (
                  <img
                    src={images[1].url as string}
                    className="w-full h-40 object-cover rounded-xl cursor-pointer hover:opacity-90"
                    onClick={() => setLightbox(1)}
                    alt=""
                  />
                ) : null}
                {images.length > 2 ? (
                  <div className="relative">
                    <img
                      src={images[2].url as string}
                      className="w-full h-40 object-cover rounded-xl cursor-pointer hover:opacity-90"
                      onClick={() => setLightbox(2)}
                      alt=""
                    />
                    {images.length > 3 ? (
                      <div
                        className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/60"
                        onClick={() => setLightbox(2)}
                      >
                        <span className="text-white font-bold text-lg">+{images.length - 2} fotos</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
                <p className="text-gray-400">Sin imagenes adicionales</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full gallery */}
      {images.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Galeria</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{images.length} fotos{videos.length > 0 ? ' y videos' : ''}</h2>
            <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar snap-x snap-mandatory">
              {images.map((m, i) => (
                <img
                  key={i}
                  src={m.url as string}
                  alt={`Foto ${i + 1}`}
                  className="shrink-0 w-full md:w-[700px] h-[450px] object-cover rounded-2xl cursor-pointer hover:opacity-95 snap-center"
                  onClick={() => setLightbox(i)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Videos</p>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((v, i) => (
                <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-black">
                  <ReactPlayer src={v.url as string} width="100%" height="100%" controls />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact form */}
      <section id="formPrincipal" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-4">Contacto</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">¿Interesado en esta propiedad?</h2>
            <p className="text-gray-400 text-lg">Complete el formulario y un asesor se comunicara en menos de 24hs</p>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
            <ContactForm propertyId={p.id as string} propertyTitle={p.titulo as string} />
          </div>
        </div>
      </section>

      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        {config.contacto_whatsapp ? (
          <a
            href={`https://wa.me/${config.contacto_whatsapp}?text=Hola, me interesa la propiedad: ${p.titulo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
        ) : (
          <button
            onClick={() => document.getElementById('formPrincipal')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-full shadow-2xl flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Consultar
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-center border-t border-gray-800">
        <img
          src="https://images.wasi.co/empresas/b20221124082928320437.png"
          alt="Logo"
          className="h-8 mx-auto mb-4 brightness-0 invert opacity-50"
        />
        <p className="text-gray-500 text-sm">Rodriguez Alberghini | {ubicacion}</p>
      </footer>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white" onClick={() => setLightbox(null)}>
            <X size={32} />
          </button>
          {lightbox > 0 && (
            <button
              className="absolute left-4 text-white bg-white/10 p-2 rounded-full hover:bg-white/20"
              onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1) }}
            >
              <ChevronLeft size={32} />
            </button>
          )}
          <img
            src={images[lightbox]?.url as string}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          {lightbox < images.length - 1 && (
            <button
              className="absolute right-4 text-white bg-white/10 p-2 rounded-full hover:bg-white/20"
              onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1) }}
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}
    </>
  )
}
