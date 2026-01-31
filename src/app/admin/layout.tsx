'use client'

// บังคับให้ไม่ทำ Static Generation และไม่ Cache
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Coffee, 
  LayoutDashboard, 
  Package, 
  Layers, 
  Settings, 
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Table,
  ClipboardList
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Tables', href: '/admin/tables', icon: Table },
  { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]
console.log('✅ Admin Layout Loaded v2.1 at:', new Date().toISOString())
console.log('✅ Admin Layout Loaded - Menu Items:', menuItems)
console.log('✅ File Version: v2.1 - With Tables & Orders')

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoginPage, setIsLoginPage] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log('🔍 AdminLayout Mounted - Pathname:', pathname)
    console.log('📋 Menu Items Count:', menuItems.length)
    
    if (pathname === '/admin/login') {
      setIsLoginPage(true)
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setError('Supabase ไม่ได้ตั้งค่า')
          setLoading(false)
          return
        }

        const { data: { session }, error: authError } = await supabase.auth.getSession()
        if (authError) throw authError

        if (!session) {
          router.push('/admin/login')
          return
        }
        
        setUser(session.user)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (isLoginPage) {
    console.log('🔑 Login Page Detected - Rendering without layout')
    return <div className="min-h-screen bg-[#0F0F0F]">{children}</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-6 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-[#D4A574] text-[#0F0F0F] rounded-lg font-bold"
          >
            ไปหน้า Login
          </button>
        </div>
      </div>
    )
  }

  console.log('🎯 Rendering Layout with', menuItems.length, 'menu items:', menuItems.map(i => i.label).join(', '))

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A1A1A] border-r border-[#2C1810]">
        <div className="p-6 border-b border-[#2C1810]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4A574] rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#0F0F0F]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#D4A574]">Admin Panel</h1>
              <p className="text-xs text-gray-500">BrewMenu Pro</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#D4A574] text-[#0F0F0F] font-semibold'
                    : 'text-gray-400 hover:bg-[#252525] hover:text-[#D4A574]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#2C1810] space-y-2">
          {user && (
            <div className="mb-3 px-4 py-2 bg-[#252525] rounded-lg">
              <p className="text-xs text-gray-500">เข้าสู่ระบบด้วย</p>
              <p className="text-sm text-[#D4A574] font-medium truncate">
                {user.email}
              </p>
            </div>
          )}
          
          <button
            onClick={() => router.back()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#252525] hover:text-[#D4A574] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับ</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs text-gray-500 hover:text-[#D4A574] transition-colors border border-[#2C1810]"
          >
            <Coffee className="w-4 h-4" />
            ดูหน้าเมนู
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside 
            className="w-64 h-full bg-[#1A1A1A] border-r border-[#2C1810] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2C1810] flex justify-between items-center">
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4A574] rounded-lg flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-[#0F0F0F]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[#D4A574]">Admin Panel</h1>
                  <p className="text-xs text-gray-500">BrewMenu Pro</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#D4A574] text-[#0F0F0F] font-semibold'
                        : 'text-gray-400 hover:bg-[#252525] hover:text-[#D4A574]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-[#2C1810] space-y-2">
              {user && (
                <div className="mb-3 px-4 py-2 bg-[#252525] rounded-lg">
                  <p className="text-xs text-gray-500">เข้าสู่ระบบด้วย</p>
                  <p className="text-sm text-[#D4A574] font-medium truncate">
                    {user.email}
                  </p>
                </div>
              )}
              
              <button
                onClick={() => router.back()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#252525] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>กลับ</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden bg-[#1A1A1A] border-b border-[#2C1810] p-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#252525] rounded-lg transition-colors text-gray-400"
              title="กลับ"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
              title="เมนู"
            >
              <Menu className="w-6 h-6 text-[#D4A574]" />
            </button>
          </div>
          
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#D4A574]">Admin</h1>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-900/20 rounded-lg transition-colors text-red-400"
            title="ออกจากระบบ"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}


