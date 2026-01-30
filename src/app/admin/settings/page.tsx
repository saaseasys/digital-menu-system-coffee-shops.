'use client'

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { ShopSettings } from '@/types'
import { Save, Loader2, Eye, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<ShopSettings>({
    shop_name: 'My Coffee Shop',
    shop_tagline: '',
    logo_url: '',
    primary_color: '#D4A574',
    bg_color: '#0F0F0F',
    card_color: '#1A1A1A',
    currency: 'THB',
    enable_qr_order: false
  })

  useEffect(() => {
    // Check if Supabase is configured first
    if (!isSupabaseConfigured()) {
      setError('กรุณาตั้งค่า Supabase (NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY) ใน Environment Variables')
      setLoading(false)
      return
    }
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (data) {
        setSettings(data)
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err)
      setError('ไม่สามารถโหลดข้อมูลได้: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!isSupabaseConfigured()) {
      alert('Supabase ไม่ได้ตั้งค่า')
      return
    }

    try {
      setSaving(true)
      setError(null)

      // Check if settings exist
      const { data: existing, error: checkError } = await supabase
        .from('shop_settings')
        .select('id')
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      // Remove id from settings before update/insert
      const { id, ...settingsData } = settings

      if (existing) {
        const { error } = await supabase
          .from('shop_settings')
          .update(settingsData)
          .eq('id', existing.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('shop_settings')
          .insert([settingsData])

        if (error) throw error
      }

      alert('บันทึกการตั้งค่าเรียบร้อยแล้ว!')
    } catch (error: any) {
      console.error('Save error:', error)
      setError('เกิดข้อผิดพลาด: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
      </div>
    )
  }

  // Show error state if Supabase not configured
  if (error && !isSupabaseConfigured()) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">การตั้งค่าไม่สมบูรณ์</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            กรุณาเพิ่ม Environment Variables ใน Vercel:<br/>
            <code className="bg-black/30 px-2 py-1 rounded mt-2 inline-block">NEXT_PUBLIC_SUPABASE_URL</code><br/>
            <code className="bg-black/30 px-2 py-1 rounded mt-1 inline-block">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F5F5DC] mb-2">ตั้งค่าร้าน</h1>
        <p className="text-gray-500">แก้ไขชื่อร้าน สี และตั้งค่าการแสดงผล</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* ... rest of your JSX code ไม่ต้องแก้ ... */}
      <div className="space-y-6">
        {/* Shop Info */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2C1810] p-6">
          <h2 className="text-lg font-bold text-[#F5F5DC] mb-4">ข้อมูลร้าน</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ชื่อร้าน *
              </label>
              <input
                type="text"
                value={settings.shop_name}
                onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                placeholder="SLOWBAR Coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.shop_tagline || ''}
                onChange={(e) => setSettings({ ...settings, shop_tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                placeholder="Crafted with passion, served with love"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                URL โลโก้
              </label>
              <input
                type="url"
                value={settings.logo_url || ''}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                สกุลเงิน
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
              >
                <option value="THB">THB - บาท</option>
                <option value="USD">USD - ดอลลาร์</option>
                <option value="EUR">EUR - ยูโร</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2C1810] p-6">
          <h2 className="text-lg font-bold text-[#F5F5DC] mb-4">สีธีม</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                สีหลัก (Primary)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-16 h-11 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                สีพื้นหลัง (Background)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.bg_color}
                  onChange={(e) => setSettings({ ...settings, bg_color: e.target.value })}
                  className="w-16 h-11 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.bg_color}
                  onChange={(e) => setSettings({ ...settings, bg_color: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                สีการ์ด (Card)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.card_color}
                  onChange={(e) => setSettings({ ...settings, card_color: e.target.value })}
                  className="w-16 h-11 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.card_color}
                  onChange={(e) => setSettings({ ...settings, card_color: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A574] text-[#0F0F0F] font-bold rounded-lg hover:bg-[#C49464] transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                บันทึกการตั้งค่า
              </>
            )}
          </button>

          <a
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#252525] text-gray-300 rounded-lg hover:bg-[#2C2C2C] transition font-medium"
          >
            <Eye className="w-5 h-5" />
            ดูหน้าเมนู
          </a>
        </div>
      </div>
    </div>
  )
}
