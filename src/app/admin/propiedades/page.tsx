'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, ExternalLink, Trash2 } from 'lucide-react'
import { formatPrecio } from '@/lib/utils/format'
import { toast } from 'sonner'

export default function AdminPropiedadesPage() {
  const supabase = createClient()
  const [properties, setProperties] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProperties() }, [])

  async function fetchProperties() {
    setLoading(true)
    const { data } = await supabase.from('properties').select('*, property_media(url, es_principal)').order('created_at', { ascending: false })
    setProperties(data || [])
    setLoading(false)
  }

  async function toggleField(id: string, field: string, value: boolean) {
    await supabase.from('properties').update({ [field]: value }).eq('id', id)
    setProperties(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    toast.success('Actualizado')
  }

  async function toggleLanding(id: string, tipo: string) {
    await supabase.from('properties').update({ landing_tipo: tipo }).eq('id', id)
    setProperties(prev => prev.map(p => p.id === id ? { ...p, landing_tipo: tipo } : p))
    toast.success('Tipo de landing actualizado')
  }

  async function deleteProperty(id: string) {
    if (!confirm('¿Seguro que queres eliminar esta propiedad?')) return
    await supabase.from('properties').delete().eq('id', id)
    setProperties(prev => prev.filter(p => p.id !== id))
    toast.success('Propiedad eliminada')
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Propiedades ({properties.length})</h1>
        <Link href="/admin/propiedades/nueva" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Propiedad
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Propiedad</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tipo</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Operacion</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Precio</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Landing</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map(p => {
              const media = (p.property_media as Array<Record<string, unknown>>) || []
              const thumb = (media.find(m => m.es_principal)?.url || media[0]?.url || '') as string
              return (
                <tr key={p.id as string} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {thumb ? (
                        <img src={thumb} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{p.titulo as string}</div>
                        <div className="text-sm text-gray-500">{(p.barrio as string) || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{(p.tipologia as string) || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`${p.operacion === 'Venta' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} px-2 py-1 rounded-full text-xs font-medium`}>
                      {(p.operacion as string) || 'Venta'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{formatPrecio(p.precio as number | null, p.moneda as string | null)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleField(p.id as string, 'activo', !p.activo)} className={`px-2 py-1 rounded-full text-xs font-medium ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.activo ? 'Activa' : 'Inactiva'}
                      </button>
                      <button onClick={() => toggleField(p.id as string, 'destacado', !p.destacado)} className={`px-2 py-1 rounded-full text-xs font-medium ${p.destacado ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.destacado ? '\u2605' : '\u2606'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => toggleLanding(p.id as string, 'visual')} className={`px-2 py-1 text-xs rounded ${p.landing_tipo === 'visual' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>Visual</button>
                      <button onClick={() => toggleLanding(p.id as string, 'informativo')} className={`px-2 py-1 text-xs rounded ${p.landing_tipo === 'informativo' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>Info</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/propiedades/${p.id}`} className="text-blue-600 hover:text-blue-800 p-1"><Pencil className="w-4 h-4" /></Link>
                      {p.slug ? <Link href={`/propiedades/${p.slug}`} target="_blank" className="text-gray-600 hover:text-gray-800 p-1"><ExternalLink className="w-4 h-4" /></Link> : null}
                      <button onClick={() => deleteProperty(p.id as string)} className="text-red-600 hover:text-red-800 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {properties.length === 0 && <div className="p-12 text-center text-gray-500">No hay propiedades cargadas</div>}
      </div>
    </div>
  )
}
