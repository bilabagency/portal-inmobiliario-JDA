'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
import { Upload, Trash2 } from 'lucide-react'

function ImageUploadSection({ label, currentUrl, bucketPath, configKey }: { label: string; currentUrl: string; bucketPath: string; configKey: string }) {
  const supabase = createClient()
  const [url, setUrl] = useState(currentUrl)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploading(true)
    const file = acceptedFiles[0]
    const ext = file.name.split('.').pop()
    const path = `${bucketPath}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('site-assets').upload(path, file)
    if (uploadError) { toast.error('Error al subir'); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(path)
    await supabase.from('site_config').update({ value: publicUrl }).eq('key', configKey)
    setUrl(publicUrl)
    setUploading(false)
    toast.success('Imagen actualizada')
  }, [bucketPath, configKey])

  async function handleDelete() {
    if (!confirm('¿Eliminar esta imagen?')) return
    await supabase.from('site_config').update({ value: '' }).eq('key', configKey)
    setUrl('')
    toast.success('Imagen eliminada')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-4">{label}</h3>
      {url && (
        <div className="relative inline-block mb-4">
          <img src={url} alt={label} className="w-full max-w-md h-48 object-cover rounded-lg" />
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition-colors"
            title="Eliminar imagen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm">{uploading ? 'Subiendo...' : url ? 'Arrastra para reemplazar' : 'Arrastra una imagen o hace click'}</p>
      </div>
    </div>
  )
}

export default function AdminMediaPage() {
  const supabase = createClient()
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_config').select('key, value')
      const cfg: Record<string, string> = {}
      data?.forEach((r: { key: string; value: string | null }) => { cfg[r.key] = r.value || '' })
      setConfig(cfg)
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Media del Sitio</h1>
      <div className="space-y-6">
        <ImageUploadSection label="Hero Principal" currentUrl={config.hero_imagen_url || ''} bucketPath="hero" configKey="hero_imagen_url" />
        <ImageUploadSection label="Quienes Somos - Foto" currentUrl={config.about_imagen_url || ''} bucketPath="about" configKey="about_imagen_url" />
      </div>
    </div>
  )
}
