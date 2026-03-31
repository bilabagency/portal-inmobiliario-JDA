'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    const { data: adminUser } = await supabase.from('admin_users').select('id').eq('id', user.id).single()
    if (!adminUser) {
      await supabase.auth.signOut()
      router.push('/admin/login')
      return
    }
    const { count } = await supabase.from('consultas').select('id', { count: 'exact', head: true }).eq('leida', false)
    setUnreadCount(count ?? 0)
    setReady(true)
  }

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar unreadCount={unreadCount} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  )
}
