'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Building2, Star, Mail, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({ active: 0, featured: 0, todayConsultas: 0, totalConsultas: 0 })
  const [recentConsultas, setRecentConsultas] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetchStats()
    fetchRecent()
  }, [])

  async function fetchStats() {
    const { count: active } = await supabase.from('properties').select('id', { count: 'exact', head: true }).eq('activo', true)
    const { count: featured } = await supabase.from('properties').select('id', { count: 'exact', head: true }).eq('destacado', true)
    const today = new Date().toISOString().split('T')[0]
    const { count: todayC } = await supabase.from('consultas').select('id', { count: 'exact', head: true }).gte('created_at', today)
    const { count: totalC } = await supabase.from('consultas').select('id', { count: 'exact', head: true })
    setStats({ active: active ?? 0, featured: featured ?? 0, todayConsultas: todayC ?? 0, totalConsultas: totalC ?? 0 })
  }

  async function fetchRecent() {
    const { data } = await supabase.from('consultas').select('*').order('created_at', { ascending: false }).limit(5)
    setRecentConsultas(data || [])
  }

  const cards = [
    { label: 'Propiedades Activas', value: stats.active, icon: Building2, color: 'bg-blue-500' },
    { label: 'Destacadas', value: stats.featured, icon: Star, color: 'bg-amber-500' },
    { label: 'Consultas Hoy', value: stats.todayConsultas, icon: Mail, color: 'bg-green-500' },
    { label: 'Total Consultas', value: stats.totalConsultas, icon: Mail, color: 'bg-primary' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/admin/propiedades/nueva" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /> Agregar Nueva Propiedad
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Ultimas Consultas</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Nombre</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Telefono</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Mensaje</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentConsultas.map((c) => (
              <tr key={c.id as string} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{c.nombre as string}</td>
                <td className="px-6 py-4 text-gray-600">{(c.telefono as string) || '-'}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{(c.mensaje as string) || '-'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(c.created_at as string).toLocaleDateString('es-AR')}</td>
              </tr>
            ))}
            {recentConsultas.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No hay consultas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
