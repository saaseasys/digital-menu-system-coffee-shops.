'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface Category {
  id: number
  name_th: string
}

interface CategoryTabsProps {
  categories: Category[]
  selected: number | null
  onSelect: (id: number | null) => void
  primaryColor?: string
}

export default function CategoryTabs({ 
  categories, 
  selected, 
  onSelect, 
  primaryColor = '#D4A574' 
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [categories])

  const handleScroll = () => checkScroll()

  return (
    <div className="sticky top-[60px] z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#2C1810]/50">
      {/* Gradient Overlays for scroll indication */}
      <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex space-x-3 p-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <motion.button
          onClick={() => onSelect(null)}
          whileTap={{ scale: 0.95 }}
          className="relative px-6 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0"
          style={{
            backgroundColor: selected === null ? primaryColor : '#141414',
            color: selected === null ? '#0a0a0a' : '#9CA3AF',
            border: selected === null ? 'none' : '1px solid #2C1810'
          }}
        >
          ทั้งหมด
          {selected === null && (
            <motion.div 
              layoutId="activeTab"
              className="absolute inset-0 rounded-2xl border-2 border-[#D4A574]/50"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
        
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0"
            style={{
              backgroundColor: selected === cat.id ? primaryColor : '#141414',
              color: selected === cat.id ? '#0a0a0a' : '#9CA3AF',
              border: selected === cat.id ? 'none' : '1px solid #2C1810'
            }}
          >
            {cat.name_th}
            {selected === cat.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 rounded-2xl border-2 border-[#D4A574]/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
