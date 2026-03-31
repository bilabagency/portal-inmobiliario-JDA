'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [ready, setReady] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isLoginPage) {
      setReady(true)
      return
    }
    checkAuth()
  }, [isLoginPage])

  async function checkAuth() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/admin/login'
      return
    }
    const { data: adminUser, error: adminError } = await supabase.from('admin_users').select('id').eq('id', user.id).single()
    if (adminError) {
      console.error('admin_users query error:', adminError)
    }
    if (!adminUser) {
      await supabase.auth.signOut()
      window.location.href = '/admin/login'
      return
    }
    const { count } = await supabase.from('consultas').select('id', { count: 'exact', head: true }).eq('leida', false)
    setUnreadCount(count ?? 0)
    setReady(true)
  }

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar unreadCount={unreadCount} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  )
}
