'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Coffee } from 'lucide-react'

export default function MenuPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      
      // ดึงข้อมูลทั้งหมดพร้อมกัน
      const [catRes, prodRes, setRes] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('products').select('*, category:categories(*)').eq('is_available', true).order('created_at', { ascending: false }),
        supabase.from('shop_settings').select('*').single()
      ])
      
      if (catRes.data) setCategories(catRes.data)
      if (prodRes.data) setProducts(prodRes.data)
      if (setRes.data) setSettings(setRes.data)
      
      setLoading(false)
    }
    
    loadData()
  }, [])

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category_id === selectedCategory)
    : products

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574]"></div>
      </div>
    )
  }

  return (
    <main className="pb-24 max-w-md mx-auto md:max-w-3xl min-h-screen bg-[#0F0F0F] text-[#F5F5DC]">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#2C1810] p-4">
        <h1 className="text-2xl font-serif font-bold text-[#D4A574]">
          {settings?.shop_name || 'Coffee Shop'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {settings?.shop_tagline || 'Digital Menu'}
        </p>
      </header>

      {/* Category Tabs - แบบง่าย */}
      <div className="sticky top-[72px] z-40 bg-[#0F0F0F] border-b border-[#2C1810] overflow-x-auto">
        <div className="flex space-x-2 p-4 min-w-max">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm ${selectedCategory === null ? 'bg-[#D4A574] text-[#0F0F0F]' : 'bg-[#1A1A1A] text-gray-400'}`}
          >
            ทั้งหมด
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm ${selectedCategory === cat.id ? 'bg-[#D4A574] text-[#0F0F0F]' : 'bg-[#1A1A1A] text-gray-400'}`}
            >
              {cat.name_th}
            </button>
          ))}
        </div>
      </div>

      {/* Product List - แบบง่าย */}
      <div className="p-4 space-y-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2C1810]">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{product.name_th}</h3>
              <span className="text-[#D4A574] font-bold">฿{product.price}</span>
            </div>
            {product.description && (
              <p className="text-sm text-gray-400 mt-2">{product.description}</p>
            )}
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>ไม่มีสินค้า</p>
          </div>
        )}
      </div>
    </main>
  )
}
