import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize } from 'lucide-react'
import { formatPrecio } from '@/lib/utils/format'

interface PropertyCardProps {
  property: Record<string, unknown>
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const p = property
  const media = (p.property_media as Array<Record<string, unknown>>) || []
  const mainImage = media.find(m => m.es_principal)?.url as string || media[0]?.url as string || null

  return (
    <Link href={`/propiedades/${p.slug || p.id}`}>
      <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-red-400 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer">
        <div className="relative h-64 overflow-hidden">
          <div className={`absolute top-4 left-4 z-20 ${p.operacion === 'Venta' ? 'bg-primary' : 'bg-gray-800'} px-3 py-1 rounded-full text-xs font-bold text-white shadow-md`}>
            {((p.operacion as string) || 'VENTA').toUpperCase()}
          </div>
          {p.destacado ? (
            <div className="absolute top-4 right-4 z-20 bg-amber-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
              DESTACADA
            </div>
          ) : null}
          {mainImage ? (
            <img
              src={mainImage}
              alt={p.titulo as string}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Maximize className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-6">
          <span className="text-primary text-sm font-bold uppercase tracking-wider">
            {(p.tipologia as string) || 'Propiedad'}
          </span>
          <h3 className="font-bold text-xl text-gray-900 mt-1 mb-2">{p.titulo as string}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-4 gap-2">
            <MapPin className="w-4 h-4" />
            {[p.barrio, p.localidad].filter(Boolean).join(', ') || 'Buenos Aires'}
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <div className="flex gap-4 text-gray-600 text-sm">
              {p.dormitorios != null ? (
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4" /> {p.dormitorios as number}
                </span>
              ) : null}
              {p.banos != null ? (
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" /> {p.banos as number}
                </span>
              ) : null}
              {p.superficie_total != null ? (
                <span className="flex items-center gap-1">
                  <Maximize className="w-4 h-4" /> {p.superficie_total as number} m²
                </span>
              ) : null}
            </div>
            <span className="font-bold text-primary">
              {formatPrecio(p.precio as number | null, p.moneda as string | null)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
