'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import MediaUploader from './MediaUploader'
import { slugify, formatPrecio } from '@/lib/utils/format'

interface PropertyFormProps {
  property?: Record<string, unknown>
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!property

  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    titulo: (property?.titulo as string) || '',
    slug: (property?.slug as string) || '',
    descripcion: (property?.descripcion as string) || '',
    tipologia: (property?.tipologia as string) || 'Casa',
    operacion: (property?.operacion as string) || 'Venta',
    precio: property?.precio != null ? String(property.precio) : '',
    moneda: (property?.moneda as string) || 'USD',
    dormitorios: property?.dormitorios != null ? String(property.dormitorios) : '',
    banos: property?.banos != null ? String(property.banos) : '',
    superficie_total: property?.superficie_total != null ? String(property.superficie_total) : '',
    superficie_cubierta: property?.superficie_cubierta != null ? String(property.superficie_cubierta) : '',
    barrio: (property?.barrio as string) || '',
    direccion: (property?.direccion as string) || '',
    activo: property?.activo !== false,
    destacado: (property?.destacado as boolean) || false,
    landing_tipo: (property?.landing_tipo as string) || 'visual',
  })

  function update(key: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toNum(val: string): number | null {
    if (!val || val.trim() === '') return null
    const n = parseFloat(val)
    return isNaN(n) ? null : n
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo.trim()) { toast.error('El titulo es requerido'); return }

    setSaving(true)
    const slug = form.slug || slugify(form.titulo)
    const payload = {
      titulo: form.titulo,
      slug,
      descripcion: form.descripcion || null,
      tipologia: form.tipologia,
      operacion: form.operacion,
      precio: toNum(form.precio),
      moneda: form.moneda,
      dormitorios: toNum(form.dormitorios),
      banos: toNum(form.banos),
      superficie_total: toNum(form.superficie_total),
      superficie_cubierta: toNum(form.superficie_cubierta),
      barrio: form.barrio || null,
      direccion: form.direccion || null,
      activo: form.activo,
      destacado: form.destacado,
      landing_tipo: form.landing_tipo,
    }

    if (isEdit) {
      const { error } = await supabase.from('properties').update(payload).eq('id', property!.id as string)
      if (error) { toast.error('Error: ' + error.message); setSaving(false); return }
      toast.success('Propiedad actualizada')
      router.push('/admin/propiedades')
    } else {
      const { data, error } = await supabase.from('properties').insert(payload).select('id').single()
      if (error) { toast.error('Error: ' + error.message); setSaving(false); return }
      toast.success('Propiedad creada. Ahora podes agregar fotos y videos.')
      router.push(`/admin/propiedades/${data.id}`)
    }
  }

  const precioPreview = form.precio ? formatPrecio(parseFloat(form.precio), form.moneda) : ''

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
  const labelClass = "block text-sm font-medium text-gray-700 mb-2"

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
      {/* Info General */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informacion General</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Titulo *</label>
            <input value={form.titulo} onChange={e => update('titulo', e.target.value)} className={inputClass} required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Slug (auto-generado si vacio)</label>
            <input value={form.slug} onChange={e => update('slug', e.target.value)} className={inputClass} placeholder={form.titulo ? slugify(form.titulo) : 'se-genera-automaticamente'} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripcion</label>
            <textarea value={form.descripcion} onChange={e => update('descripcion', e.target.value)} className={inputClass} rows={4} />
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Tipologia *</label>
            <select value={form.tipologia} onChange={e => update('tipologia', e.target.value)} className={inputClass}>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Terreno">Terreno</option>
              <option value="Local">Local</option>
              <option value="Oficina">Oficina</option>
              <option value="Campo">Campo</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Operacion *</label>
            <select value={form.operacion} onChange={e => update('operacion', e.target.value)} className={inputClass}>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Alquiler Temporario">Alquiler Temporario</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Precio</label>
            <input type="number" value={form.precio} onChange={e => update('precio', e.target.value)} className={inputClass} placeholder="Dejar vacio para Consultar" />
            {precioPreview && <p className="text-sm text-primary font-semibold mt-1">{precioPreview}</p>}
          </div>
          <div>
            <label className={labelClass}>Moneda</label>
            <select value={form.moneda} onChange={e => update('moneda', e.target.value)} className={inputClass}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Dormitorios</label>
            <input type="number" value={form.dormitorios} onChange={e => update('dormitorios', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Banos</label>
            <input type="number" value={form.banos} onChange={e => update('banos', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Superficie Total m2</label>
            <input type="number" value={form.superficie_total} onChange={e => update('superficie_total', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Superficie Cubierta m2</label>
            <input type="number" value={form.superficie_cubierta} onChange={e => update('superficie_cubierta', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Ubicacion */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ubicacion</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Barrio</label>
            <input value={form.barrio} onChange={e => update('barrio', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Direccion</label>
            <input value={form.direccion} onChange={e => update('direccion', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Configuracion */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Configuracion</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={e => update('activo', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm font-medium text-gray-700">Propiedad activa</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.destacado} onChange={e => update('destacado', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm font-medium text-gray-700">Propiedad destacada</span>
          </label>
        </div>
        <div className="mt-6">
          <label className={labelClass}>Tipo de Landing</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => update('landing_tipo', 'visual')} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${form.landing_tipo === 'visual' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
              <p className="font-bold text-gray-900">Visual</p>
              <p className="text-sm text-gray-500">Hero fullscreen + galeria horizontal</p>
            </button>
            <button type="button" onClick={() => update('landing_tipo', 'informativo')} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${form.landing_tipo === 'informativo' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
              <p className="font-bold text-gray-900">Informativo</p>
              <p className="text-sm text-gray-500">Ficha detallada + sidebar contacto</p>
            </button>
          </div>
        </div>
      </div>

      {/* Media */}
      {isEdit ? (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Media</h3>
          <p className="text-sm text-gray-500 mb-4">Subi fotos y videos de la propiedad. La primera foto marcada como principal sera la portada.</p>
          <MediaUploader propertyId={property!.id as string} existingMedia={(property!.property_media as Array<Record<string, unknown>>) || []} />
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">Guarda la propiedad primero y despues vas a poder agregar fotos y videos.</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50">
          {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Propiedad'}
        </button>
        <button type="button" onClick={() => router.push('/admin/propiedades')} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
          Cancelar
        </button>
      </div>
    </form>
  )
}
