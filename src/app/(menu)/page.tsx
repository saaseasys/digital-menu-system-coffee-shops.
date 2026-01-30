'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Product, Category, ShopSettings } from '@/types'
import ProductCard from '@/components/menu/ProductCard'
import CategoryTabs from '@/components/menu/CategoryTabs'
import { Coffee, WifiOff, AlertTriangle, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setErrorMsg('การตั้งค่า Supabase ไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setErrorMsg(null)

      const [{ data: cats }, { data: prods }, { data: sets }] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('products').select(`*, category:categories(*)`).eq('is_available', true).order('created_at', { ascending: false }),
        supabase.from('shop_settings').select('*').single()
      ])

      if (cats) setCategories(cats)
      if (prods) setProducts(prods)
      if (sets) setSettings(sets)
      
    } catch (err: any) {
      console.error('Error:', err)
      setErrorMsg(err.message || 'ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    if (!isSupabaseConfigured()) return

    const channel = supabase
      .channel('menu-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchData)
      .subscribe()

    // Scroll listener for header effect
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fetchData])

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category_id === selectedCategory)
    : products

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#D4A574] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-32 overflow-x-hidden">
      {/* Sticky Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-lg shadow-2xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-md mx-auto md:max-w-3xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className={`font-serif font-bold transition-all duration-300 ${
              scrolled ? 'text-lg text-[#D4A574]' : 'text-2xl text-[#D4A574]'
            }`}>
              {settings?.shop_name || 'Coffee Shop'}
            </h1>
            {!scrolled && (
              <p className="text-xs text-gray-500 mt-0.5">รักในรสชาติกาแฟ</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover border-2 border-[#2C1810]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C1810] to-[#1a1a1a] flex items-center justify-center border border-[#D4A574]/20">
                <Coffee className="w-5 h-5 text-[#D4A574]" />
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A574]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative max-w-md mx-auto md:max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#F5F5DC] leading-tight">
              สัมผัสรสชาติ<br />
              <span className="text-[#D4A574]">กาแฟคุณภาพ</span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm max-w-[250px]">
              คัดสรรเมล็ดกาแฟพิเศษ คั่วสดใหม่ทุกวัน เพื่อความหอมกรุ่นที่สมบูรณ์แบบ
            </p>
          </motion.div>

          {/* Stats Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3"
          >
            <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#2C1810] rounded-2xl px-4 py-2">
              <p className="text-[#D4A574] font-bold text-lg">{products.length}+</p>
              <p className="text-[10px] text-gray-500">เมนูเครื่องดื่ม</p>
            </div>
            <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#2C1810] rounded-2xl px-4 py-2">
              <p className="text-[#D4A574] font-bold text-lg">5-10</p>
              <p className="text-[10px] text-gray-500">นาที</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <CategoryTabs 
        categories={categories} 
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        primaryColor={settings?.primary_color}
      />

      {/* Error Message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 mx-4 mt-4 bg-red-900/10 border border-red-900/30 rounded-xl flex items-center gap-3 p-4 text-red-400"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <section className="px-4 mt-6 max-w-md mx-auto md:max-w-3xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
        >
          {filteredProducts.map((product, index) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard 
                product={product} 
                currency={settings?.currency || 'THB'}
                primaryColor={settings?.primary_color || '#D4A574'}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && !errorMsg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500 col-span-2"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
              <Coffee className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-sm">ไม่มีสินค้าในหมวดหมู่นี้</p>
          </motion.div>
        )}
      </section>

      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#D4A574] to-[#B8935F] rounded-full shadow-2xl shadow-[#D4A574]/20 flex items-center justify-center z-40 group"
      >
        <ShoppingBag className="w-6 h-6 text-[#0a0a0a] group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#0a0a0a]">
          0
        </span>
      </motion.button>

      {/* Footer */}
      <footer className="mt-16 text-center pb-8">
        <p className="text-xs text-gray-700">Powered by BrewMenu Pro</p>
      </footer>
    </main>
  )
}
