'use client'

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { ShopSettings } from '@/types'
import { Save, Loader2, Eye, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Default settings สำรองไว้เสมอ
const DEFAULT_SETTINGS: ShopSettings = {
  shop_name: 'My Coffee Shop',
  shop_tagline: '',
  logo_url: '',
  primary_color: '#D4A574',
  bg_color: '#0F0F0F',
  card_color: '#1A1A1A',
  currency: 'THB',
  enable_qr_order: false
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS)
  const [dbId, setDbId] = useState<number | null>(null) // เก็บ id แยกต่างหาก

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('กรุณาตั้งค่า Supabase URL และ Anon Key ใน Environment Variables')
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
        .maybeSingle() // ใช้ maybeSingle แทน single จะได้ไม่ error ถ้าไม่มีข้อมูล

      if (error) throw error
      
      if (data) {
        setDbId(data.id)
        setSettings({
          shop_name: data.shop_name || DEFAULT_SETTINGS.shop_name,
          shop_tagline: data.shop_tagline || '',
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || DEFAULT_SETTINGS.primary_color,
          bg_color: data.bg_color || DEFAULT_SETTINGS.bg_color,
          card_color: data.card_color || DEFAULT_SETTINGS.card_color,
          currency: data.currency || 'THB',
          enable_qr_order: data.enable_qr_order || false
        })
      }
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError('โหลดข้อมูลไม่สำเร็จ: ' + err.message)
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

      // สร้าง object ใหม่โดยตรง ไม่ใช้ destructuring (ป้องกัน error)
      const settingsData = {
        shop_name: settings.shop_name,
        shop_tagline: settings.shop_tagline,
        logo_url: settings.logo_url,
        primary_color: settings.primary_color,
        bg_color: settings.bg_color,
        card_color: settings.card_color,
        currency: settings.currency,
        enable_qr_order: settings.enable_qr_order,
        updated_at: new Date().toISOString()
      }

      if (dbId) {
        // Update
        const { error } = await supabase
          .from('shop_settings')
          .update(settingsData)
          .eq('id', dbId)
        if (error) throw error
      } else {
        // Insert
        const { data, error } = await supabase
          .from('shop_settings')
          .insert([{ ...settingsData, created_at: new Date().toISOString() }])
          .select()
        if (error) throw error
        if (data && data[0]) setDbId(data[0].id)
      }

      alert('บันทึกสำเร็จ!')
    } catch (err: any) {
      console.error('Save error:', err)
      setError('บันทึกไม่สำเร็จ: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ถ้า env ไม่ถูกต้อง แสดง error ชัดเจน
  if (!isSupabaseConfigured() && !loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Environment Variables ไม่ครบ</h2>
          <p className="text-gray-400 mb-4">กรุณาเพิ่มใน Vercel:</p>
          <div className="text-left inline-block bg-black/30 p-4 rounded text-sm font-mono text-gray-300">
            <div>NEXT_PUBLIC_SUPABASE_URL=https://...</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
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

      <div className="space-y-6">
        {/* Shop Info */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2C1810] p-6">
          <h2 className="text-lg font-bold text-[#F5F5DC] mb-4">ข้อมูลร้าน</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อร้าน *</label>
              <input
                type="text"
                value={settings.shop_name}
                onChange={(e) => setSettings(s => ({ ...s, shop_name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Tagline</label>
              <input
                type="text"
                value={settings.shop_tagline || ''}
                onChange={(e) => setSettings(s => ({ ...s, shop_tagline: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">URL โลโก้</label>
              <input
                type="url"
                value={settings.logo_url || ''}
                onChange={(e) => setSettings(s => ({ ...s, logo_url: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                placeholder="https://..."
              />
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
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </button>

          <a href="/" target="_blank" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#252525] text-gray-300 rounded-lg hover:bg-[#2C2C2C] transition">
            <Eye className="w-5 h-5" />
            ดูหน้าเมนู
          </a>
        </div>
      </div>
    </div>
  )
}
