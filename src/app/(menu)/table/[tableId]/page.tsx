'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Product, Category, ShopSettings } from '@/types'
import { useCart } from '@/context/CartContext'
import CategoryTabs from '@/components/menu/CategoryTabs'
import { Coffee, AlertTriangle, WifiOff } from 'lucide-react'
import Link from 'next/link'

// Component แสดงสินค้าแบบมีปุ่มเพิ่มในตะกร้า
function ProductCardWithCart({ product, currency, primaryColor }: { 
  product: Product, 
  currency: string, 
  primaryColor: string 
}) {
  const { addItem, items } = useCart()
  const [imageError, setImageError] = useState(false)
  
  const cartItem = items.find(i => i.product.id === product.id)
  const quantityInCart = cartItem?.quantity || 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price)
  }

  return (
    <div className="group relative bg-[#141414] rounded-2xl overflow-hidden border border-[#2C1810] hover:border-[#3C2820] transition-all">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#1A1A1A]">
        {!imageError && product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name_th}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2C1810] to-[#1A1A1A]">
            <span className="text-3xl">☕</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
        
        {/* Price Tag */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-[#0a0a0a]/80 backdrop-blur rounded-lg border border-[#2C1810]">
          <span className="text-[#D4A574] font-bold text-xs">
            {currency} {formatPrice(product.price)}
          </span>
        </div>

        {/* Quantity Badge */}
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#D4A574] flex items-center justify-center text-[#0a0a0a] text-xs font-bold">
            {quantityInCart}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-[#F5F5DC] text-sm mb-1 group-hover:text-[#D4A574] transition-colors">
          {product.name_th}
        </h3>
        
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        <button
          onClick={() => addItem({ product, quantity: 1 })}
          className="w-full py-2 rounded-xl font-medium transition-all active:scale-95"
          style={{ 
            backgroundColor: primaryColor,
            color: '#0a0a0a'
          }}
        >
          เพิ่มในตะกร้า
        </button>
      </div>
    </div>
  )
}

export default function TableMenuPage() {
  const params = useParams()
  const { setTableId } = useCart()
  const tableId = params.tableId as string
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (tableId) {
      setTableId(tableId)
    }
  }, [tableId, setTableId])

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setErrorMsg('การตั้งค่า Supabase ไม่ถูกต้อง')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      const [{ data: cats }, { data: prods }, { data: sets }] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('products').select('*').eq('is_available', true).order('created_at', { ascending: false }),
        supabase.from('shop_settings').select('*').single()
      ])

      if (cats) setCategories(cats)
      if (prods) setProducts(prods)
      if (sets) setSettings(sets)
      
    } catch (err: any) {
      setErrorMsg(err.message || 'ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category_id === selectedCategory)
    : products

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Table Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#2C1810]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#D4A574]">
              โต๊ะที่ {tableId}
            </h1>
            <p className="text-xs text-gray-500">
              {settings?.shop_name || 'Coffee Shop'}
            </p>
          </div>
          <Link 
            href="/cart"
            className="relative w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2C1810] flex items-center justify-center"
          >
            <Coffee className="w-5 h-5 text-[#D4A574]" />
          </Link>
        </div>
      </header>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 m-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      {/* Categories */}
      <div className="sticky top-[60px] z-40 bg-[#0a0a0a] border-b border-[#2C1810]/50">
        <div className="max-w-md mx-auto">
          <CategoryTabs 
            categories={categories} 
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            primaryColor={settings?.primary_color || '#D4A574'}
          />
        </div>
      </div>

      {/* Products Grid */}
      <section className="p-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCardWithCart 
              key={product.id}
              product={product}
              currency={settings?.currency || 'THB'}
              primaryColor={settings?.primary_color || '#D4A574'}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Coffee className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>ไม่มีสินค้าในหมวดหมู่นี้</p>
          </div>
        )}
      </section>

      {/* Cart Summary Bar */}
      <CartBar tableId={tableId} />
    </main>
  )
}

// Component แถบสรุปตะกร้าด้านล่าง
function CartBar({ tableId }: { tableId: string }) {
  const { items, total } = useCart()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  if (count === 0) return null

  return (
    <Link href="/cart">
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-[#D4A574] text-[#0a0a0a] rounded-2xl p-4 flex items-center justify-between shadow-2xl z-50">
        <div>
          <p className="text-sm font-medium">{count} รายการ</p>
          <p className="text-xs opacity-80">แตะเพื่อดูตะกร้า</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">฿{total}</p>
        </div>
      </div>
    </Link>
  )
}
