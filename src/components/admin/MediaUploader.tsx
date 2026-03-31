'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, X, Star, Plus, Image as ImageIcon, Play } from 'lucide-react'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface MediaUploaderProps {
  propertyId: string
  existingMedia: Array<Record<string, unknown>>
}

export default function MediaUploader({ propertyId, existingMedia }: MediaUploaderProps) {
  const supabase = createClient()
  const [media, setMedia] = useState(existingMedia.sort((a, b) => (a.orden as number) - (b.orden as number)))
  const [uploading, setUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [progress, setProgress] = useState(0)

  const onDropImages = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    const total = acceptedFiles.length
    let done = 0

    for (const file of acceptedFiles) {
      const ext = file.name.split('.').pop()
      const path = `${propertyId}/fotos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage.from('property-media').upload(path, file)
      if (uploadError) { toast.error(`Error subiendo ${file.name}`); continue }

      const { data: { publicUrl } } = supabase.storage.from('property-media').getPublicUrl(path)

      const { data: inserted } = await supabase.from('property_media').insert({
        property_id: propertyId,
        url: publicUrl,
        tipo: 'imagen',
        orden: media.length + done,
        es_principal: media.length === 0 && done === 0,
      }).select().single()

      if (inserted) setMedia(prev => [...prev, inserted])
      done++
      setProgress(Math.round((done / total) * 100))
    }

    setUploading(false)
    setProgress(0)
    toast.success(`${done} imagen(es) subida(s)`)
  }, [propertyId, media.length])

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDrag } = useDropzone({
    onDrop: onDropImages,
    accept: { 'image/*': [] },
  })

  async function addVideoUrl() {
    if (!videoUrl.trim()) return
    const { data: inserted } = await supabase.from('property_media').insert({
      property_id: propertyId,
      url: videoUrl.trim(),
      tipo: 'video',
      orden: media.length,
      es_principal: false,
    }).select().single()

    if (inserted) {
      setMedia(prev => [...prev, inserted])
      setVideoUrl('')
      toast.success('Video agregado')
    }
  }

  async function deleteMedia(id: string) {
    await supabase.from('property_media').delete().eq('id', id)
    setMedia(prev => prev.filter(m => m.id !== id))
    toast.success('Eliminado')
  }

  async function setPrincipal(id: string) {
    await supabase.from('property_media').update({ es_principal: false }).eq('property_id', propertyId)
    await supabase.from('property_media').update({ es_principal: true }).eq('id', id)
    setMedia(prev => prev.map(m => ({ ...m, es_principal: m.id === id })))
    toast.success('Portada actualizada')
  }

  const images = media.filter(m => m.tipo === 'imagen')
  const videos = media.filter(m => m.tipo === 'video')
  const principal = media.find(m => m.es_principal)

  return (
    <div className="space-y-8">
      {/* Portada actual */}
      {principal && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Portada actual</p>
          <div className="flex items-center gap-4">
            {principal.tipo === 'imagen' ? (
              <>
                <img src={principal.url as string} alt="" className="w-24 h-16 object-cover rounded-lg ring-2 ring-primary" />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4" /> Foto
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-16 bg-black rounded-lg ring-2 ring-primary flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Play className="w-4 h-4" /> Video: {(principal.url as string).substring(0, 40)}...
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Photos */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Fotos</h4>
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map(m => (
              <div key={m.id as string} className="relative group">
                <img src={m.url as string} alt="" className={`w-full h-32 object-cover rounded-lg ${m.es_principal ? 'ring-2 ring-primary' : ''}`} />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => setPrincipal(m.id as string)} title="Usar como portada" className={`p-1 rounded ${m.es_principal ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:text-primary'} shadow`}>
                    <Star className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => deleteMedia(m.id as string)} className="p-1 rounded bg-white text-red-600 shadow">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {m.es_principal ? <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">Portada</span> : null}
              </div>
            ))}
          </div>
        )}

        <div {...getImageRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isImageDrag ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
          <input {...getImageInputProps()} />
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">{uploading ? `Subiendo... ${progress}%` : 'Arrastra imagenes o hace click para seleccionar'}</p>
        </div>
        {uploading && (
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Videos */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Videos</h4>
        {videos.length > 0 && (
          <div className="space-y-4 mb-4">
            {videos.map(v => (
              <div key={v.id as string} className={`flex items-center gap-4 rounded-lg p-3 ${v.es_principal ? 'bg-primary/5 ring-2 ring-primary' : 'bg-gray-50'}`}>
                <div className="w-48 aspect-video rounded overflow-hidden bg-black shrink-0">
                  <ReactPlayer src={v.url as string} width="100%" height="100%" light />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">{v.url as string}</p>
                  {v.es_principal ? <span className="text-xs text-primary font-semibold">Portada</span> : null}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => setPrincipal(v.id as string)} title="Usar como portada" className={`p-1.5 rounded ${v.es_principal ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:text-primary border border-gray-200'}`}>
                    <Star className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => deleteMedia(v.id as string)} className="p-1.5 rounded bg-white text-red-600 border border-gray-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="URL de YouTube o Vimeo"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />
          <button type="button" onClick={addVideoUrl} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
