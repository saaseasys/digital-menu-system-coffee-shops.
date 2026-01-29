'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react'

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  onClose: () => void
  onSuccess: () => void
}

export default function ProductForm({ product, categories, onClose, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null)
  const [formData, setFormData] = useState({
    name_th: product?.name_th || '',
    name_en: product?.name_en || '',
    description: product?.description || '',
    price: product?.price || 0,
    category_id: product?.category_id || null,
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
    prep_time_min: product?.prep_time_min || 5,
    tags: product?.tags?.join(', ') || '',
    image_url: product?.image_url || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
        price: Number(formData.price),
        prep_time_min: Number(formData.prep_time_min),
      }

      if (product) {
        // Update
        const { error } = await supabase
          .from('products')
          .update(dataToSave)
          .eq('id', product.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('products')
          .insert([dataToSave])

        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image_url: url })
    setImagePreview(url)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#1A1A1A] rounded-xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#2C1810]">
          <h2 className="text-2xl font-bold text-[#F5F5DC]">
            {product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#252525] rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Preview & URL */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-400">รูปสินค้า</label>
            
            {/* Image Preview */}
            <div className="w-full h-48 bg-[#0F0F0F] rounded-lg border border-[#2C1810] flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={() => setImagePreview(null)}
                />
              ) : (
                <div className="text-center text-gray-600">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">ไม่มีรูปภาพ</p>
                </div>
              )}
            </div>

            {/* Image URL Input */}
            <input
              type="url"
              placeholder="URL รูปภาพ (https://...)"
              value={formData.image_url}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
            />
            <p className="text-xs text-gray-500">
              * ระบบ upload รูปจะมาในขั้นตอนถัดไป ตอนนี้ใส่ URL ได้เลย
            </p>
          </div>

          {/* Product Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ชื่อสินค้า (ไทย) *
              </label>
              <input
                type="text"
                required
                value={formData.name_th}
                onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
                placeholder="เอสเปรสโซ่"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ชื่อสินค้า (English)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
                placeholder="Espresso"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">คำอธิบาย</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574] resize-none"
              placeholder="กาแฟเข้มข้น สไตล์อิตาเลียนแท้"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">ราคา (บาท) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
                placeholder="75"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">หมวดหมู่</label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
              >
                <option value="">ไม่ระบุ</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_th}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prep Time & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                เวลาเตรียม (นาที)
              </label>
              <input
                type="number"
                min="0"
                value={formData.prep_time_min}
                onChange={(e) => setFormData({ ...formData, prep_time_min: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tags (คั่นด้วยคอมม่า)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
                placeholder="เข้ม, ร้อน"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-5 h-5 rounded border-[#2C1810] bg-[#0F0F0F] text-[#D4A574] focus:ring-[#D4A574]"
              />
              <span className="text-sm text-gray-300">พร้อมขาย</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-[#2C1810] bg-[#0F0F0F] text-[#D4A574] focus:ring-[#D4A574]"
              />
              <span className="text-sm text-gray-300">เมนูแนะนำ (แสดงดาวในเมนู)</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#2C1810]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#252525] text-gray-300 rounded-lg hover:bg-[#2C2C2C] transition font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#D4A574] text-[#0F0F0F] rounded-lg hover:bg-[#C49464] transition font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                product ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}