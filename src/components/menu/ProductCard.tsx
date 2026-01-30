'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { Clock, Star, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
  currency: string
  primaryColor: string
  index?: number
}

export default function ProductCard({ product, currency, primaryColor, index = 0 }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price)
  }

  return (
    <motion.div 
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="relative bg-[#141414] rounded-3xl overflow-hidden border border-[#2C1810] hover:border-[#D4A574]/30 transition-colors duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#D4A574]/5">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#1A1A1A]">
          {/* Skeleton Loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] animate-pulse" />
          )}
          
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name_th}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                setImageLoaded(true)
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2C1810] to-[#1A1A1A]">
              <span className="text-4xl opacity-30">☕</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

          {/* Featured Badge */}
          {product.is_featured && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-[#D4A574]/90 shadow-lg"
            >
              <Star className="w-4 h-4 text-[#0a0a0a] fill-current" />
            </motion.div>
          )}

          {/* Unavailable Overlay */}
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold rounded-full backdrop-blur-md">
                หมดชั่วคราว
              </span>
            </div>
          )}

          {/* Quick Add Button (Visible on Hover) */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#D4A574] flex items-center justify-center shadow-lg hover:bg-[#E5B685] transition-colors"
          >
            <Plus className="w-5 h-5 text-[#0a0a0a]" />
          </motion.button>

          {/* Price Tag - Floating */}
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-[#0a0a0a]/80 backdrop-blur-md rounded-full border border-[#2C1810]">
            <span className="text-[#D4A574] font-bold text-sm">
              {currency} {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-[#F5F5DC] text-sm leading-tight line-clamp-1 group-hover:text-[#D4A574] transition-colors">
                {product.name_th}
              </h3>
              {product.name_en && (
                <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wider">
                  {product.name_en}
                </p>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed h-8">
            {product.description || 'ไม่มีคำอธิบาย'}
          </p>

          {/* Tags & Time */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2C1810]/50">
            <div className="flex gap-1 flex-wrap">
              {product.tags?.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[9px] px-2 py-1 rounded-full bg-[#0F0F0F] text-gray-500 border border-[#2C1810]/50"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {product.prep_time_min && (
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{product.prep_time_min}m</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
