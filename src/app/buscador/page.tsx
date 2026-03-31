'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/properties/PropertyCard'
import { createClient } from '@/lib/supabase/client'

function BuscadorContent() {
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [properties, setProperties] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    tipologia: searchParams.get('tipologia') || '',
    operacion: searchParams.get('operacion') || '',
    dormitorios: searchParams.get('dormitorios') || '',
    barrio: searchParams.get('barrio') || '',
    precioMin: '',
    precioMax: '',
    superficieMin: '',
  })
  const [orden, setOrden] = useState('recientes')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [barrios, setBarrios] = useState<string[]>([])
  const perPage = 10

  useEffect(() => {
    fetchBarrios()
  }, [])

  useEffect(() => {
    setPage(1)
    fetchProperties()
  }, [filters, orden])

  useEffect(() => {
    fetchProperties()
  }, [page])

  async function fetchBarrios() {
    const { data } = await supabase.from('properties').select('barrio').eq('activo', true).not('barrio', 'is', null)
    if (data) {
      const unique = [...new Set(data.map(d => d.barrio).filter(Boolean))] as string[]
      setBarrios(unique.sort())
    }
  }

  async function fetchProperties() {
    setLoading(true)
    let query = supabase.from('properties').select('*, property_media(*)', { count: 'exact' }).eq('activo', true)

    if (filters.tipologia) query = query.eq('tipologia', filters.tipologia)
    if (filters.operacion) query = query.eq('operacion', filters.operacion)
    if (filters.dormitorios) {
      if (filters.dormitorios === '5+') query = query.gte('dormitorios', 5)
      else query = query.eq('dormitorios', parseInt(filters.dormitorios))
    }
    if (filters.barrio) query = query.eq('barrio', filters.barrio)
    if (filters.precioMin) query = query.gte('precio', parseFloat(filters.precioMin))
    if (filters.precioMax) query = query.lte('precio', parseFloat(filters.precioMax))
    if (filters.superficieMin) query = query.gte('superficie_total', parseFloat(filters.superficieMin))

    if (orden === 'precio_asc') query = query.order('precio', { ascending: true, nullsFirst: false })
    else if (orden === 'precio_desc') query = query.order('precio', { ascending: false, nullsFirst: false })
    else query = query.order('created_at', { ascending: false })

    const from = (page - 1) * perPage
    query = query.range(from, from + perPage - 1)

    const { data, count } = await query
    setProperties(data || [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  function updateFilter(key: string, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const selectClass = "w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
  const totalPages = Math.ceil(total / perPage)

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Buscador de Propiedades</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 sticky top-24">
              <h3 className="font-bold text-gray-900">Filtros</h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipologia</label>
                <select value={filters.tipologia} onChange={e => updateFilter('tipologia', e.target.value)} className={selectClass}>
                  <option value="">Todas</option>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Local">Local</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Campo">Campo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Operacion</label>
                <select value={filters.operacion} onChange={e => updateFilter('operacion', e.target.value)} className={selectClass}>
                  <option value="">Todas</option>
                  <option value="Venta">Venta</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Alquiler Temporario">Alquiler Temporario</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dormitorios</label>
                <select value={filters.dormitorios} onChange={e => updateFilter('dormitorios', e.target.value)} className={selectClass}>
                  <option value="">Indistinto</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Barrio</label>
                <select value={filters.barrio} onChange={e => updateFilter('barrio', e.target.value)} className={selectClass}>
                  <option value="">Todos</option>
                  {barrios.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Min</label>
                <input type="number" value={filters.precioMin} onChange={e => updateFilter('precioMin', e.target.value)} className={selectClass} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Max</label>
                <input type="number" value={filters.precioMax} onChange={e => updateFilter('precioMax', e.target.value)} className={selectClass} placeholder="Sin limite" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Superficie Min (m2)</label>
                <input type="number" value={filters.superficieMin} onChange={e => updateFilter('superficieMin', e.target.value)} className={selectClass} placeholder="0" />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500">{total} propiedades encontradas</p>
              <select value={orden} onChange={e => setOrden(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="recientes">Mas recientes</option>
                <option value="precio_asc">Precio ↑</option>
                <option value="precio_desc">Precio ↓</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-200" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {properties.map(p => <PropertyCard key={p.id as string} property={p} />)}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-10 h-10 rounded-lg font-medium ${n === page ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">No se encontraron propiedades.</p>
                <button onClick={() => setFilters({ tipologia: '', operacion: '', dormitorios: '', barrio: '', precioMin: '', precioMax: '', superficieMin: '' })} className="mt-4 text-primary hover:underline font-medium">
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function BuscadorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-gray-200 border-t-primary rounded-full animate-spin" /></div>}>
      <BuscadorContent />
    </Suspense>
  )
}
