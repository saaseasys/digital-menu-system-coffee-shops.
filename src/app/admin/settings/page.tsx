'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShopSettings } from '@/types'
import { Save, Loader2, Eye } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data) setSettings(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Check if settings exist
      const { data: existing } = await supabase
        .from('shop_settings')
        .select('id')
        .single()

      if (existing) {
        // Update
        const { error } = await supabase
          .from('shop_settings')
          .update(settings)
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('shop_settings')
          .insert([settings])

        if (error) throw error
      }

      alert('บันทึกการตั้งค่าเรียบร้อยแล้ว!')
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F5F5DC] mb-2">ตั้งค่าร้าน</h1>
        <p className="text-gray-500">แก้ไขชื่อร้าน สี และตั้งค่าการแสดงผล</p>
      </div>

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

          {/* Preview */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: settings.bg_color }}>
            <p className="text-sm text-gray-400 mb-3">ตัวอย่าง:</p>
            <div className="p-4 rounded-lg" style={{ backgroundColor: settings.card_color }}>
              <h3 className="font-bold mb-2" style={{ color: settings.primary_color }}>
                {settings.shop_name}
              </h3>
              <p className="text-sm text-gray-400">{settings.shop_tagline || 'Tagline ของคุณ'}</p>
              <button
                className="mt-3 px-4 py-2 rounded-lg font-medium"
                style={{ backgroundColor: settings.primary_color, color: settings.bg_color }}
              >
                ปุ่มตัวอย่าง
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2C1810] p-6">
          <h2 className="text-lg font-bold text-[#F5F5DC] mb-4">ฟีเจอร์</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enable_qr_order}
              onChange={(e) => setSettings({ ...settings, enable_qr_order: e.target.checked })}
              className="w-5 h-5 rounded border-[#2C1810] bg-[#0F0F0F] text-[#D4A574]"
            />
            <div>
              <p className="text-sm font-medium text-[#F5F5DC]">เปิดใช้งาน QR Code สั่งอาหาร</p>
              <p className="text-xs text-gray-500">ลูกค้าสามารถสแกน QR เพื่อสั่งอาหารได้ (Coming soon)</p>
            </div>
          </label>
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