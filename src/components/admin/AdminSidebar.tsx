'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Building2, Image as ImageIcon, Mail, Settings, Users, LogOut } from 'lucide-react'

interface AdminSidebarProps {
  unreadCount: number
}

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/propiedades', label: 'Propiedades', icon: Building2 },
  { href: '/admin/media', label: 'Media e Imagenes', icon: ImageIcon },
  { href: '/admin/consultas', label: 'Consultas', icon: Mail },
  { href: '/admin/configuracion', label: 'Configuracion', icon: Settings },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
]

export default function AdminSidebar({ unreadCount }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 flex flex-col z-50">
      <div className="p-6">
        <img src="https://images.wasi.co/empresas/b20221124082928320437.png" alt="Logo" className="h-10 brightness-0 invert" />
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {links.map(link => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
              {link.href === '/admin/consultas' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="p-4">
        <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full transition-colors">
          <LogOut className="w-5 h-5" />
          Cerrar Sesion
        </button>
      </div>
    </aside>
  )
}
