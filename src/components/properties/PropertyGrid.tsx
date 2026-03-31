import PropertyCard from './PropertyCard'

interface PropertyGridProps {
  properties: Record<string, unknown>[]
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-xl">No se encontraron propiedades.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(p => (
        <PropertyCard key={p.id as string} property={p} />
      ))}
    </div>
  )
}
