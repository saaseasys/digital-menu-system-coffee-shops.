'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Save, X } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name_th: '',
    name_en: '',
    sort_order: 0,
    color: '#8B4513'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      if (data) setCategories(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('categories')
          .insert([formData])

        if (error) throw error
      }

      fetchCategories()
      resetForm()
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name_th: category.name_th,
      name_en: category.name_en || '',
      sort_order: category.sort_order,
      color: category.color || '#8B4513'
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCategories(categories.filter(c => c.id !== id))
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const toggleActive = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id)

      if (error) throw error

      setCategories(categories.map(c =>
        c.id === category.id ? { ...c, is_active: !c.is_active } : c
      ))
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name_th: '',
      name_en: '',
      sort_order: categories.length,
      color: '#8B4513'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F5F5DC] mb-2">จัดการหมวดหมู่</h1>
        <p className="text-gray-500">เพิ่ม แก้ไข หรือลบหมวดหมู่สินค้า</p>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2C1810] p-6 mb-6">
        <h2 className="text-lg font-bold text-[#F5F5DC] mb-4">
          {editingId ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ชื่อหมวดหมู่ (ไทย) *
              </label>
              <input
                type="text"
                required
                value={formData.name_th}
                onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                placeholder="กาแฟร้อน"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ชื่อหมวดหมู่ (English)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                placeholder="Hot Coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ลำดับ
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                สี
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-11 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-[#0F0F0F] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-[#252525] text-gray-300 rounded-lg hover:bg-[#2C2C2C] transition"
              >
                ยกเลิก
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-[#D4A574] text-[#0F0F0F] font-semibold rounded-lg hover:bg-[#C49464] transition"
            >
              {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
            </button>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-[#1A1A1A] rounded-lg border border-[#2C1810] p-4 flex items-center gap-4 hover:border-[#3C2820] transition"
          >
            <div
              className="w-12 h-12 rounded-lg flex-shrink-0"
              style={{ backgroundColor: category.color || '#8B4513' }}
            />

            <div className="flex-1">
              <h3 className="font-semibold text-[#F5F5DC]">{category.name_th}</h3>
              {category.name_en && (
                <p className="text-sm text-gray-500">{category.name_en}</p>
              )}
              <p className="text-xs text-gray-600 mt-1">ลำดับ: {category.sort_order}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  category.is_active
                    ? 'bg-green-900/20 text-green-400'
                    : 'bg-gray-700/20 text-gray-400'
                }`}
              >
                {category.is_active ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => handleEdit(category)}
                className="px-3 py-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 transition"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(category.id)}
                className="px-3 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}