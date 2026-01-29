'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Coffee, 
  LayoutDashboard, 
  Package, 
  Layers, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const menuItems = [
  { 
    label: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Products', 
    href: '/admin/products', 
    icon: Package 
  },
  { 
    label: 'Categories', 
    href: '/admin/categories', 
    icon: Layers 
  },
  { 
    label: 'Settings', 
    href: '/admin/settings', 
    icon: Settings 
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Skip layout for login page
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#0F0F0F]">{children}</div>
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      setUser(session.user)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A1A1A] border-r border-[#2C1810]">
        {/* Logo */}
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

        {/* Navigation */}
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

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#2C1810]">
          {user && (
            <div className="mb-3 px-4 py-2 bg-[#252525] rounded-lg">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm text-[#D4A574] font-medium truncate">
                {user.email}
              </p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs text-gray-500 hover:text-[#D4A574] transition-colors border border-[#2C1810]"
          >
            <Coffee className="w-4 h-4" />
            View Menu
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

            <div className="p-4 border-t border-[#2C1810]">
              {user && (
                <div className="mb-3 px-4 py-2 bg-[#252525] rounded-lg">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm text-[#D4A574] font-medium truncate">
                    {user.email}
                  </p>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header - Mobile */}
        <header className="lg:hidden bg-[#1A1A1A] border-b border-[#2C1810] p-4 flex justify-between items-center sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-[#D4A574]" />
          </button>
          
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-[#D4A574]" />
            <h1 className="text-lg font-bold text-[#D4A574]">Admin</h1>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
          >
            <Coffee className="w-5 h-5 text-gray-400" />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
