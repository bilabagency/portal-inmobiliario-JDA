'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ContactSection() {
  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('consultas').insert({
      nombre,
      telefono,
      mensaje,
    })
    setLoading(false)
    if (error) {
      toast.error('Error al enviar la consulta')
      return
    }
    toast.success('Consulta enviada correctamente')
    setNombre('')
    setTelefono('')
    setMensaje('')
  }

  return (
    <section id="contacto" className="py-24 relative bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Dejanos tu consulta</h2>
          <p className="text-gray-600 text-lg">Completa tus datos y te responderemos a la brevedad.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Nombre</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Telefono</label>
              <input
                type="text"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Mensaje</label>
              <textarea
                rows={3}
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-5 rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </section>
  )
}
