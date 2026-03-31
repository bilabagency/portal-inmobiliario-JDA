'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface MediaGalleryProps {
  media: Array<{ url: string; tipo: string }>
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const images = media.filter(m => m.tipo === 'imagen')

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((m, i) => (
          <img
            key={i}
            src={m.url}
            alt={`Foto ${i + 1}`}
            className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setLightbox(i)}
          />
        ))}
      </div>

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
            src={images[lightbox].url}
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
