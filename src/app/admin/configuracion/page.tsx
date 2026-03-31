'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import * as Tabs from '@radix-ui/react-tabs'

export default function AdminConfiguracionPage() {
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

  async function saveKey(key: string, value: string) {
    const { error } = await supabase.from('site_config').update({ value }).eq('key', key)
    if (error) { toast.error('Error al guardar'); return }
    setConfig(prev => ({ ...prev, [key]: value }))
    toast.success('Guardado')
  }

  async function saveMultiple(keys: string[]) {
    for (const key of keys) {
      await supabase.from('site_config').update({ value: config[key] || '' }).eq('key', key)
    }
    toast.success('Cambios guardados')
  }

  function updateLocal(key: string, value: string) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuracion</h1>
      <Tabs.Root defaultValue="pixel">
        <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6">
          <Tabs.Trigger value="pixel" className="px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">Meta Pixel</Tabs.Trigger>
          <Tabs.Trigger value="textos" className="px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">Textos del Sitio</Tabs.Trigger>
          <Tabs.Trigger value="contacto" className="px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">Contacto</Tabs.Trigger>
          <Tabs.Trigger value="seo" className="px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">SEO</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pixel" className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-600 mb-4">Ingresa solo el ID numerico de tu Pixel de Meta (ej: 1234567890)</p>
          <input value={config.meta_pixel_id || ''} onChange={e => updateLocal('meta_pixel_id', e.target.value)} className={inputClass} placeholder="1234567890" />
          {config.meta_pixel_id && (
            <pre className="mt-4 bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
              {`fbq('init', '${config.meta_pixel_id}');\nfbq('track', 'PageView');`}
            </pre>
          )}
          <button onClick={() => saveKey('meta_pixel_id', config.meta_pixel_id || '')} className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Guardar</button>
        </Tabs.Content>

        <Tabs.Content value="textos" className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero titulo (negro)</label>
            <input value={config.hero_titulo_negro || ''} onChange={e => updateLocal('hero_titulo_negro', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero titulo (rojo)</label>
            <input value={config.hero_titulo_rojo || ''} onChange={e => updateLocal('hero_titulo_rojo', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero subtitulo</label>
            <textarea value={config.hero_subtitulo || ''} onChange={e => updateLocal('hero_subtitulo', e.target.value)} className={inputClass} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About titulo</label>
            <input value={config.about_titulo || ''} onChange={e => updateLocal('about_titulo', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About texto 1</label>
            <textarea value={config.about_texto1 || ''} onChange={e => updateLocal('about_texto1', e.target.value)} className={inputClass} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About texto 2</label>
            <textarea value={config.about_texto2 || ''} onChange={e => updateLocal('about_texto2', e.target.value)} className={inputClass} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About mision</label>
            <textarea value={config.about_mision || ''} onChange={e => updateLocal('about_mision', e.target.value)} className={inputClass} rows={2} />
          </div>
          <button onClick={() => saveMultiple(['hero_titulo_negro', 'hero_titulo_rojo', 'hero_subtitulo', 'about_titulo', 'about_texto1', 'about_texto2', 'about_mision'])} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Guardar cambios</button>
        </Tabs.Content>

        <Tabs.Content value="contacto" className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (con codigo de pais)</label>
            <input value={config.contacto_whatsapp || ''} onChange={e => updateLocal('contacto_whatsapp', e.target.value)} className={inputClass} placeholder="5491123456789" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
            <input value={config.contacto_email || ''} onChange={e => updateLocal('contacto_email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direccion</label>
            <input value={config.contacto_direccion || ''} onChange={e => updateLocal('contacto_direccion', e.target.value)} className={inputClass} />
          </div>
          <button onClick={() => saveMultiple(['contacto_whatsapp', 'contacto_email', 'contacto_direccion'])} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Guardar</button>
        </Tabs.Content>

        <Tabs.Content value="seo" className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titulo del sitio</label>
            <input value={config.seo_titulo || ''} onChange={e => updateLocal('seo_titulo', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion del sitio</label>
            <textarea value={config.seo_descripcion || ''} onChange={e => updateLocal('seo_descripcion', e.target.value)} className={inputClass} rows={3} />
          </div>
          <button onClick={() => saveMultiple(['seo_titulo', 'seo_descripcion'])} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Guardar</button>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
