'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ContactFormProps {
  propertyId?: string
  propertyTitle?: string
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState(propertyTitle ? `Hola, me interesa la propiedad: ${propertyTitle}` : '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('consultas').insert({
      nombre,
      telefono,
      mensaje,
      property_id: propertyId || null,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre</label>
        <input
          type="text"
          required
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Telefono</label>
        <input
          type="text"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mensaje</label>
        <textarea
          rows={4}
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar Mensaje'}
      </button>
    </form>
  )
}
