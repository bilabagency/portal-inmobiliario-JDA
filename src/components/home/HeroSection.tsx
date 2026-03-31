'use client'

import SearchFilters from './SearchFilters'

interface HeroSectionProps {
  config: Record<string, string>
}

export default function HeroSection({ config }: HeroSectionProps) {
  const heroImage = config.hero_imagen_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000'

  return (
    <header className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pb-16 pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hero"
          className="absolute w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-slate-50 z-10" />
      </div>
      <div className="relative z-20 container mx-auto px-6 text-center mt-10">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary font-semibold text-sm tracking-widest uppercase mb-6">
            {config.contacto_direccion || 'Balcarce, Buenos Aires'}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
            {config.hero_titulo_negro || 'Encontra el lugar'}
            <br />
            <span className="bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
              {config.hero_titulo_rojo || 'ideal para tu familia'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light mt-6 max-w-2xl mx-auto mb-12">
            {config.hero_subtitulo || 'Acompañamos tus proyectos inmobiliarios con transparencia, experiencia y el mejor trato humano.'}
          </p>
        </div>
        <SearchFilters />
      </div>
    </header>
  )
}
