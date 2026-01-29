'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Coffee, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-[#2C1810] w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2C1810] rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-[#D4A574]" />
          </div>
          <h1 className="text-2xl font-serif text-[#D4A574] mb-2">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500">จัดการเมนูร้านกาแฟ</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#2C1810] rounded-lg p-3 text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574] transition"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#2C1810] rounded-lg p-3 text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574] transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4A574] text-[#0F0F0F] font-bold py-3 rounded-lg hover:bg-[#C49464] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-600 text-center">
          สำหรับการใช้งานครั้งแรก กรุณาสร้างผู้ใช้ใน Supabase Dashboard
        </p>
      </div>
    </div>
  )
}