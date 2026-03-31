'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Trash2, Plus } from 'lucide-react'

export default function AdminUsuariosPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', nombre: '', password: '', rol: 'editor' })

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  async function createUser() {
    if (!form.email || !form.password) { toast.error('Email y contrasena requeridos'); return }
    // Note: creating auth users requires service_role key, which should be done via API route
    // For now we'll insert into admin_users assuming the auth user was created via Supabase dashboard
    toast.error('Para crear usuarios, primero crea el usuario en Supabase Auth y luego agrega su ID aqui.')
    setShowModal(false)
  }

  async function updateRole(id: string, rol: string) {
    await supabase.from('admin_users').update({ rol }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, rol } : u))
    toast.success('Rol actualizado')
  }

  async function deleteUser(id: string) {
    if (!confirm('¿Eliminar este usuario admin?')) return
    await supabase.from('admin_users').delete().eq('id', id)
    setUsers(prev => prev.filter(u => u.id !== id))
    toast.success('Usuario eliminado')
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios Admin</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Agregar usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rol</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u.id as string} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{(u.nombre as string) || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{u.email as string}</td>
                <td className="px-6 py-4">
                  <select value={u.rol as string} onChange={e => updateRole(u.id as string, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
                    <option value="editor">Editor</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(u.created_at as string).toLocaleDateString('es-AR')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteUser(u.id as string)} className="text-red-600 hover:text-red-800 p-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-12 text-center text-gray-500">No hay usuarios admin</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Agregar usuario admin</h2>
            <p className="text-sm text-gray-500 mb-4">Primero crea el usuario en Supabase Auth (Dashboard &gt; Authentication &gt; Users), luego ingresa los datos aqui.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option value="editor">Editor</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createUser} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg">Agregar</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
