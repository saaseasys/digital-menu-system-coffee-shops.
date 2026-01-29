'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Category, ShopSettings } from '@/types'
import ProductCard from '@/components/menu/ProductCard'
import CategoryTabs from '@/components/menu/CategoryTabs'
import { Coffee, WifiOff } from 'lucide-react'

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories
      const { data: cats, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (catError) throw new Error(catError.message)

      // Fetch products
      const { data: prods, error: prodError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
      
      if (prodError) throw new Error(prodError.message)

      // Fetch settings
      const { data: sets, error: setError } = await supabase
        .from('shop_settings')
        .select('*')
        .single()
      
      // ไม่ throw error ถ้าไม่มี settings แต่ให้ใช้ค่า default
      if (setError && setError.code !== 'PGRST116') {
        console.warn('Settings error:', setError)
      }

      if (cats) setCategories(cats)
      if (prods) setProducts(prods)
      if (sets) setSettings(sets)
      
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('menu-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

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
    <main className="pb-24 max-w-md mx-auto md:max-w-3xl min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#2C1810] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-serif font-bold"
              style={{ color: settings?.primary_color || '#D4A574' }}
            >
              {settings?.shop_name || 'Coffee Shop'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {settings?.shop_tagline || 'Digital Menu'}
            </p>
          </div>
          {settings?.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt="logo" 
              className="w-12 h-12 rounded-full object-cover border border-[#2C1810]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#2C1810] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#D4A574]" />
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="p-4 m-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-400">
          <WifiOff className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Category Tabs */}
      <CategoryTabs 
        categories={categories} 
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        primaryColor={settings?.primary_color}
      />

      {/* Product Grid */}
      <div className="p-4 space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              currency={settings?.currency || 'THB'}
              primaryColor={settings?.primary_color || '#D4A574'}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>ไม่มีสินค้าในหมวดหมู่นี้</p>
            {error && <p className="text-xs mt-2 text-red-400">{error}</p>}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-[#0F0F0F] border-t border-[#2C1810] p-3 text-center text-xs text-gray-600">
        <p>Powered by BrewMenu Pro</p>
      </footer>
    </main>
  )
}
