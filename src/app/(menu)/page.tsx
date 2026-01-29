'use client'

import { useEffect, useState } from 'react'
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
  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setErrMsg(null)
      
      // Fetch categories
      const catsRes = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (catsRes.error) {
        setErrMsg(catsRes.error.message)
        setLoading(false)
        return
      }
      
      // Fetch products
      const prodsRes = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
      
      if (prodsRes.error) {
        setErrMsg(prodsRes.error.message)
        setLoading(false)
        return
      }
      
      // Fetch settings
      const setsRes = await supabase
        .from('shop_settings')
        .select('*')
        .single()
      
      if (catsRes.data) setCategories(catsRes.data)
      if (prodsRes.data) setProducts(prodsRes.data)
      if (setsRes.data) setSettings(setsRes.data)
      
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
    <main className="pb-24 max-w-md mx-auto md:max-w-3xl min-h-screen">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#2C1810] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#D4A574]">
              {settings?.shop_name || 'Coffee Shop'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {settings?.shop_tagline || 'Digital Menu'}
            </p>
          </div>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="logo" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#2C1810] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#D4A574]" />
            </div>
          )}
        </div>
      </header>

      {errMsg && (
        <div className="p-4 m-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-400">
          <WifiOff className="w-5 h-5" />
          <p className="text-sm">{errMsg}</p>
        </div>
      )}

      <CategoryTabs 
        categories={categories} 
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        primaryColor={settings?.primary_color}
      />

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
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 w-full bg-[#0F0F0F] border-t border-[#2C1810] p-3 text-center text-xs text-gray-600">
        Powered by BrewMenu Pro
      </footer>
    </main>
  )
}
