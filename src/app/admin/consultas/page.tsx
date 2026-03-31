'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminConsultasPage() {
  const supabase = createClient()
  const [consultas, setConsultas] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchConsultas() }, [])

  async function fetchConsultas() {
    setLoading(true)
    const { data } = await supabase.from('consultas').select('*, properties(titulo, slug)').order('created_at', { ascending: false })
    setConsultas(data || [])
    setLoading(false)
  }

  async function toggleLeida(id: string, leida: boolean) {
    await supabase.from('consultas').update({ leida }).eq('id', id)
    setConsultas(prev => prev.map(c => c.id === id ? { ...c, leida } : c))
  }

  async function deleteConsulta(id: string) {
    if (!confirm('¿Eliminar esta consulta?')) return
    await supabase.from('consultas').delete().eq('id', id)
    setConsultas(prev => prev.filter(c => c.id !== id))
    toast.success('Consulta eliminada')
  }

  const unread = consultas.filter(c => !c.leida).length

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consultas ({consultas.length})</h1>
        {unread > 0 && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">{unread} no leidas</span>}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Telefono</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mensaje</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Propiedad</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {consultas.map(c => {
              const prop = c.properties as Record<string, unknown> | null
              return (
                <tr key={c.id as string} className={`hover:bg-gray-50 ${!c.leida ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.nombre as string}</td>
                  <td className="px-6 py-4 text-gray-600">{(c.telefono as string) || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{(c.mensaje as string) || '-'}</td>
                  <td className="px-6 py-4">
                    {prop ? <Link href={`/propiedades/${prop.slug}`} target="_blank" className="text-primary hover:underline text-sm">{prop.titulo as string}</Link> : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(c.created_at as string).toLocaleDateString('es-AR')}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleLeida(c.id as string, !c.leida)} className={`px-2 py-1 rounded-full text-xs font-medium ${c.leida ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {c.leida ? 'Leida' : 'No leida'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteConsulta(c.id as string)} className="text-red-600 hover:text-red-800 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {consultas.length === 0 && <div className="p-12 text-center text-gray-500">No hay consultas</div>}
      </div>
    </div>
  )
}
