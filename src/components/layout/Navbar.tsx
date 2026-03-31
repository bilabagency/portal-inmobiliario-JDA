'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <img
            src="https://images.wasi.co/empresas/b20221124082928320437.png"
            alt="Rodriguez Alberghini"
            className="h-12 object-contain"
          />
        </Link>

        <div className="hidden md:flex gap-6 font-semibold text-gray-600">
          <Link href="/buscador" className="hover:text-primary transition-colors">Buscador</Link>
          <Link href="/destacados" className="hover:text-primary transition-colors">Destacados</Link>
          <Link href="/quienes-somos" className="hover:text-primary transition-colors">Quienes Somos</Link>
        </div>

        <Link
          href="#contacto"
          className="hidden md:inline-block bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all shadow-lg"
        >
          Contactenos
        </Link>

        <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <Link href="/buscador" className="block text-gray-700 font-medium hover:text-primary" onClick={() => setOpen(false)}>Buscador</Link>
          <Link href="/destacados" className="block text-gray-700 font-medium hover:text-primary" onClick={() => setOpen(false)}>Destacados</Link>
          <Link href="/quienes-somos" className="block text-gray-700 font-medium hover:text-primary" onClick={() => setOpen(false)}>Quienes Somos</Link>
          <Link
            href="#contacto"
            className="block bg-primary text-white text-center font-semibold py-2.5 rounded-full"
            onClick={() => setOpen(false)}
          >
            Contactenos
          </Link>
        </div>
      )}
    </nav>
  )
}
