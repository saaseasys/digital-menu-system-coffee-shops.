'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Coffee, 
  Layers, 
  Star, 
  Settings, 
  Plus,
  Loader2
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    products: 0, 
    categories: 0, 
    featured: 0,
    loading: true 
  })
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    setUser(session.user)
  }

  const fetchStats = async () => {
    try {
      const [{ count: products }, { count: categories }, { count: featured }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true)
      ])

      setStats({
        products: products || 0,
        categories: categories || 0,
        featured: featured || 0,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#F5F5DC] mb-2">แดชบอร์ด</h2>
        <p className="text-gray-500">ภาพรวมร้านค้า</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2C1810] hover:border-[#3C2820] transition">
          <div className="flex items-center justify-between mb-4">
            <Coffee className="w-8 h-8 text-[#D4A574]" />
            <span className="text-xs text-gray-500">รายการ</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">สินค้าทั้งหมด</h3>
          <p className="text-3xl font-bold text-[#D4A574]">{stats.products}</p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2C1810] hover:border-[#3C2820] transition">
          <div className="flex items-center justify-between mb-4">
            <Layers className="w-8 h-8 text-[#D4A574]" />
            <span className="text-xs text-gray-500">หมวดหมู่</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">หมวดหมู่</h3>
          <p className="text-3xl font-bold text-[#D4A574]">{stats.categories}</p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2C1810] hover:border-[#3C2820] transition">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-[#D4A574]" />
            <span className="text-xs text-gray-500">แนะนำ</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">เมนูแนะนำ</h3>
          <p className="text-3xl font-bold text-[#D4A574]">{stats.featured}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-bold mb-4">จัดการอย่างรวดเร็ว</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-4 bg-[#1A1A1A] p-6 rounded-xl border border-[#2C1810] hover:border-[#D4A574] hover:bg-[#252525] transition group"
        >
          <div className="w-12 h-12 rounded-full bg-[#D4A574]/10 flex items-center justify-center group-hover:bg-[#D4A574]/20 transition">
            <Plus className="w-6 h-6 text-[#D4A574]" />
          </div>
          <div>
            <h4 className="font-bold text-[#F5F5DC] mb-1">จัดการสินค้า</h4>
            <p className="text-sm text-gray-500">เพิ่ม แก้ไข หรือลบเมนู</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/settings" 
          className="flex items-center gap-4 bg-[#1A1A1A] p-6 rounded-xl border border-[#2C1810] hover:border-[#D4A574] hover:bg-[#252525] transition group"
        >
          <div className="w-12 h-12 rounded-full bg-[#D4A574]/10 flex items-center justify-center group-hover:bg-[#D4A574]/20 transition">
            <Settings className="w-6 h-6 text-[#D4A574]" />
          </div>
          <div>
            <h4 className="font-bold text-[#F5F5DC] mb-1">ตั้งค่าร้าน</h4>
            <p className="text-sm text-gray-500">เปลี่ยนชื่อ โลโก้ และธีม</p>
          </div>
        </Link>
      </div>

      <div className="mt-8 p-4 bg-[#2C1810]/30 rounded-lg border border-[#2C1810]">
        <h4 className="text-[#D4A574] font-bold mb-2 flex items-center gap-2">
          <Star className="w-4 h-4" />
          เคล็ดลับการใช้งาน
        </h4>
        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
          <li>สินค้าที่ปิดการขายจะไม่แสดงในเมนูลูกค้า แต่ข้อมูลยังคงอยู่ในระบบ</li>
          <li>ติ๊ก "เมนูแนะนำ" เพื่อให้สินค้าขึ้นสัญลักษณ์ดาวในเมนู</li>
          <li>หมวดหมู่ที่ปิดใช้งานจะซ่อนจากเมนูอัตโนมัติ</li>
        </ul>
      </div>
    </div>
  )
}