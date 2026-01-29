'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Star,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase
          .from('products')
          .select('*, category:categories(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
      ])

      if (productsData) setProducts(productsData)
      if (categoriesData) setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(products.filter(p => p.id !== id))
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const toggleAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !product.is_available })
        .eq('id', product.id)

      if (error) throw error

      setProducts(products.map(p => 
        p.id === product.id 
          ? { ...p, is_available: !p.is_available }
          : p
      ))
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const toggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: !product.is_featured })
        .eq('id', product.id)

      if (error) throw error

      setProducts(products.map(p => 
        p.id === product.id 
          ? { ...p, is_featured: !p.is_featured }
          : p
      ))
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F5F5DC] mb-2">จัดการสินค้า</h1>
        <p className="text-gray-500">เพิ่ม แก้ไข หรือลบสินค้าในเมนู</p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2.5 bg-[#1A1A1A] border border-[#2C1810] rounded-lg text-[#F5F5DC] focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name_th}</option>
          ))}
        </select>

        {/* Add Button */}
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#D4A574] text-[#0F0F0F] font-semibold rounded-lg hover:bg-[#C49464] transition"
        >
          <Plus className="w-5 h-5" />
          เพิ่มสินค้า
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#2C1810]">
          <p className="text-gray-500">ไม่พบสินค้า</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#1A1A1A] rounded-xl border border-[#2C1810] overflow-hidden hover:border-[#3C2820] transition"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-[#0F0F0F]">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name_th}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    ☕
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.is_featured && (
                    <div className="px-2 py-1 bg-[#D4A574] rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-[#0F0F0F]" />
                      <span className="text-xs font-bold text-[#0F0F0F]">แนะนำ</span>
                    </div>
                  )}
                  {!product.is_available && (
                    <div className="px-2 py-1 bg-red-600 rounded-md">
                      <span className="text-xs font-bold text-white">หมด</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#F5F5DC] text-lg">{product.name_th}</h3>
                    {product.name_en && (
                      <p className="text-xs text-gray-500">{product.name_en}</p>
                    )}
                  </div>
                  <span className="text-lg font-bold text-[#D4A574]">
                    ฿{product.price}
                  </span>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {product.description || 'ไม่มีคำอธิบาย'}
                </p>

                {product.category && (
                  <div className="mb-3">
                    <span className="text-xs px-2 py-1 bg-[#0F0F0F] text-gray-400 rounded-md border border-[#2C1810]">
                      {product.category.name_th}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAvailability(product)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      product.is_available
                        ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                        : 'bg-gray-700/20 text-gray-400 hover:bg-gray-700/30'
                    }`}
                  >
                    {product.is_available ? (
                      <><Eye className="w-4 h-4" /> พร้อมขาย</>
                    ) : (
                      <><EyeOff className="w-4 h-4" /> หมด</>
                    )}
                  </button>

                  <button
                    onClick={() => toggleFeatured(product)}
                    className={`px-3 py-2 rounded-lg transition ${
                      product.is_featured
                        ? 'bg-[#D4A574] text-[#0F0F0F]'
                        : 'bg-[#2C1810] text-gray-400 hover:bg-[#3C2820]'
                    }`}
                    title={product.is_featured ? 'ยกเลิกแนะนำ' : 'แนะนำสินค้า'}
                  >
                    <Star className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setShowModal(true)
                    }}
                    className="px-3 py-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 transition"
                    title="แก้ไข"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal - Coming next */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-[#F5F5DC] mb-4">
              {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
            </h2>
            <p className="text-gray-400 mb-4">Form จะมาในขั้นตอนถัดไป...</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-[#D4A574] text-[#0F0F0F] rounded-lg"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  )
}