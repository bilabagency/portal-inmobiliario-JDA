'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import MediaUploader from './MediaUploader'
import { slugify } from '@/lib/utils/format'

const optionalNumber = z.union([z.number(), z.nan()]).optional().transform(v => (v != null && !isNaN(v) ? v : undefined))

const schema = z.object({
  titulo: z.string().min(1, 'Titulo requerido'),
  slug: z.string().optional(),
  descripcion: z.string().optional(),
  tipologia: z.string().min(1, 'Tipologia requerida'),
  operacion: z.string().min(1, 'Operacion requerida'),
  precio: optionalNumber,
  moneda: z.string().optional(),
  dormitorios: optionalNumber,
  banos: optionalNumber,
  superficie_total: optionalNumber,
  superficie_cubierta: optionalNumber,
  barrio: z.string().optional(),
  direccion: z.string().optional(),
  activo: z.boolean(),
  destacado: z.boolean(),
  landing_tipo: z.string(),
})

type FormData = {
  titulo: string
  slug?: string
  descripcion?: string
  tipologia: string
  operacion: string
  precio?: number
  moneda?: string
  dormitorios?: number
  banos?: number
  superficie_total?: number
  superficie_cubierta?: number
  barrio?: string
  direccion?: string
  activo: boolean
  destacado: boolean
  landing_tipo: string
}

interface PropertyFormProps {
  property?: Record<string, unknown>
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!property

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: (property?.titulo as string) || '',
      slug: (property?.slug as string) || '',
      descripcion: (property?.descripcion as string) || '',
      tipologia: (property?.tipologia as string) || 'Casa',
      operacion: (property?.operacion as string) || 'Venta',
      precio: (property?.precio as number) || undefined,
      moneda: (property?.moneda as string) || 'ARS',
      dormitorios: (property?.dormitorios as number) || undefined,
      banos: (property?.banos as number) || undefined,
      superficie_total: (property?.superficie_total as number) || undefined,
      superficie_cubierta: (property?.superficie_cubierta as number) || undefined,
      barrio: (property?.barrio as string) || '',
      direccion: (property?.direccion as string) || '',
      activo: property?.activo !== false,
      destacado: (property?.destacado as boolean) || false,
      landing_tipo: (property?.landing_tipo as string) || 'visual',
    },
  })

  const titulo = watch('titulo')
  const landingTipo = watch('landing_tipo')

  async function onSubmit(data: FormData) {
    const slug = data.slug || slugify(data.titulo)
    const payload = { ...data, slug }

    if (isEdit) {
      const { error } = await supabase.from('properties').update(payload).eq('id', property!.id as string)
      if (error) { toast.error('Error: ' + error.message); return }
      toast.success('Propiedad actualizada')
    } else {
      const { error } = await supabase.from('properties').insert(payload)
      if (error) { toast.error('Error: ' + error.message); return }
      toast.success('Propiedad creada')
    }
    router.push('/admin/propiedades')
    router.refresh()
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
  const labelClass = "block text-sm font-medium text-gray-700 mb-2"
  const errorClass = "text-red-500 text-sm mt-1"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
      {/* Info General */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informacion General</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Titulo *</label>
            <input {...register('titulo')} className={inputClass} />
            {errors.titulo && <p className={errorClass}>{errors.titulo.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Slug (auto-generado si vacio)</label>
            <input {...register('slug')} className={inputClass} placeholder={titulo ? slugify(titulo) : 'se-genera-automaticamente'} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripcion</label>
            <textarea {...register('descripcion')} className={inputClass} rows={4} />
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Tipologia *</label>
            <select {...register('tipologia')} className={inputClass}>
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
            <select {...register('operacion')} className={inputClass}>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Alquiler Temporario">Alquiler Temporario</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Precio</label>
            <input type="number" {...register('precio')} className={inputClass} placeholder="Dejar vacio para Consultar" />
          </div>
          <div>
            <label className={labelClass}>Moneda</label>
            <select {...register('moneda')} className={inputClass}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Dormitorios</label>
            <input type="number" {...register('dormitorios')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Banos</label>
            <input type="number" {...register('banos')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Superficie Total m2</label>
            <input type="number" {...register('superficie_total')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Superficie Cubierta m2</label>
            <input type="number" {...register('superficie_cubierta')} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Ubicacion */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ubicacion</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Barrio</label>
            <input {...register('barrio')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Direccion</label>
            <input {...register('direccion')} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Configuracion */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Configuracion</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('activo')} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm font-medium text-gray-700">Propiedad activa</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('destacado')} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm font-medium text-gray-700">Propiedad destacada</span>
          </label>
        </div>
        <div className="mt-6">
          <label className={labelClass}>Tipo de Landing</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setValue('landing_tipo', 'visual')} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${landingTipo === 'visual' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
              <p className="font-bold text-gray-900">Visual</p>
              <p className="text-sm text-gray-500">Alto impacto visual</p>
            </button>
            <button type="button" onClick={() => setValue('landing_tipo', 'informativo')} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${landingTipo === 'informativo' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
              <p className="font-bold text-gray-900">Informativo</p>
              <p className="text-sm text-gray-500">Detallado y estructurado</p>
            </button>
          </div>
        </div>
      </div>

      {/* Media */}
      {isEdit && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Media</h3>
          <MediaUploader propertyId={property!.id as string} existingMedia={(property!.property_media as Array<Record<string, unknown>>) || []} />
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : 'Guardar Propiedad'}
        </button>
        <button type="button" onClick={() => router.push('/admin/propiedades')} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
          Cancelar
        </button>
      </div>
    </form>
  )
}
