'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Coffee, LogOut } from 'lucide-react'

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-[#1A1A1A] border-b border-[#2C1810] p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Coffee className="w-6 h-6 text-[#D4A574]" />
          <h1 className="text-xl font-serif text-[#D4A574]">Admin</h1>
        </Link>
      </div>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4A574] transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>ออกจากระบบ</span>
      </button>
    </header>
  )
}