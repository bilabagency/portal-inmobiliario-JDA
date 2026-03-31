'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SearchFilters() {
  const router = useRouter()
  const supabase = createClient()
  const [barrios, setBarrios] = useState<string[]>([])
  const [count, setCount] = useState<number>(0)
  const [filters, setFilters] = useState({
    tipologia: '',
    operacion: '',
    dormitorios: '',
    barrio: '',
  })

  useEffect(() => {
    fetchBarrios()
    fetchCount()
  }, [])

  useEffect(() => {
    fetchCount()
  }, [filters])

  async function fetchBarrios() {
    const { data } = await supabase
      .from('properties')
      .select('barrio')
      .eq('activo', true)
      .not('barrio', 'is', null)
    if (data) {
      const unique = [...new Set(data.map(d => d.barrio).filter(Boolean))] as string[]
      setBarrios(unique.sort())
    }
  }

  async function fetchCount() {
    let query = supabase.from('properties').select('id', { count: 'exact', head: true }).eq('activo', true)
    if (filters.tipologia) query = query.eq('tipologia', filters.tipologia)
    if (filters.operacion) query = query.eq('operacion', filters.operacion)
    if (filters.dormitorios) {
      if (filters.dormitorios === '5+') query = query.gte('dormitorios', 5)
      else query = query.eq('dormitorios', parseInt(filters.dormitorios))
    }
    if (filters.barrio) query = query.eq('barrio', filters.barrio)
    const { count: c } = await query
    setCount(c ?? 0)
  }

  function handleSearch() {
    const params = new URLSearchParams()
    if (filters.tipologia) params.set('tipologia', filters.tipologia)
    if (filters.operacion) params.set('operacion', filters.operacion)
    if (filters.dormitorios) params.set('dormitorios', filters.dormitorios)
    if (filters.barrio) params.set('barrio', filters.barrio)
    router.push(`/buscador?${params.toString()}`)
  }

  function updateFilter(key: string, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const selectClass = "w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all font-medium cursor-pointer"

  return (
    <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="text-left">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Tipologia</label>
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
        <div className="text-left">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Operacion</label>
          <select value={filters.operacion} onChange={e => updateFilter('operacion', e.target.value)} className={selectClass}>
            <option value="">Todas</option>
            <option value="Venta">Venta</option>
            <option value="Alquiler">Alquiler</option>
            <option value="Alquiler Temporario">Alquiler Temporario</option>
          </select>
        </div>
        <div className="text-left">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Dormitorios</label>
          <select value={filters.dormitorios} onChange={e => updateFilter('dormitorios', e.target.value)} className={selectClass}>
            <option value="">Indistinto</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5+">5+</option>
          </select>
        </div>
        <div className="text-left">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Barrio</label>
          <select value={filters.barrio} onChange={e => updateFilter('barrio', e.target.value)} className={selectClass}>
            <option value="">Todos</option>
            {barrios.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm mt-4 cursor-pointer" onClick={handleSearch}>
        {count} propiedades encontradas
      </p>
    </div>
  )
}
