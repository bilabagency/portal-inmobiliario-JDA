interface AboutSectionProps {
  config: Record<string, string>
}

export default function AboutSection({ config }: AboutSectionProps) {
  const aboutImage = config.about_imagen_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'

  return (
    <section className="py-24 relative bg-white border-y border-gray-200">
      <div className="container mx-auto px-6">
        <div className="bg-gray-50 rounded-3xl p-8 md:p-16 border border-gray-100 shadow-lg max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-2/5">
              <img
                src={aboutImage}
                alt="Equipo"
                className="w-full h-auto rounded-2xl border border-gray-200 shadow-md"
              />
            </div>
            <div className="w-full md:w-3/5 text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                Conocemos{' '}
                <span className="bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                  nuestra ciudad.
                </span>
              </h2>
              <div className="w-16 h-1 bg-primary mb-8" />
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Somos <strong>Rodriguez Alberghini</strong>,{' '}
                  {config.about_texto1 || 'una inmobiliaria con arraigo y vision de futuro en Balcarce.'}
                </p>
                <p>
                  {config.about_texto2 || 'Trabajamos cada dia para unir familias con sus hogares ideales, priorizando siempre la honestidad y la transparencia.'}
                </p>
                <p>
                  <em className="text-gray-500">
                    {config.about_mision || 'Nuestra mision es cuidar tu patrimonio como si fuera el nuestro.'}
                  </em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
