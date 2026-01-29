'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { Clock, Star } from 'lucide-react'

interface ProductCardProps {
  product: Product
  currency: string
  primaryColor: string
}

export default function ProductCard({ product, currency, primaryColor }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [imageError, setImageError] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price)
  }

  return (
    <div 
      className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2C1810] hover:border-[#3C2820] transition-all duration-300 cursor-pointer group"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex p-4 gap-4">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          {product.image_url && !imageError ? (
            <img 
              src={product.image_url} 
              alt={product.name_th}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#2C1810] rounded-xl flex items-center justify-center text-2xl">
              ☕
            </div>
          )}
          
          {product.is_featured && (
            <div 
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <Star className="w-3 h-3 text-[#0F0F0F] fill-current" />
            </div>
          )}
          
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
              <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                หมด
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-medium text-[#F5F5DC] text-base leading-tight line-clamp-1">
                {product.name_th}
              </h3>
              {product.name_en && (
                <p className="text-xs text-gray-500 mt-0.5">{product.name_en}</p>
              )}
            </div>
            <span 
              className="font-bold text-lg"
              style={{ color: primaryColor }}
            >
              {currency} {formatPrice(product.price)}
            </span>
          </div>
          
          <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
            {product.description || 'ไม่มีคำอธิบาย'}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.tags.slice(0, 3).map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[#0F0F0F] text-gray-400 border border-[#2C1810]"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 text-gray-500">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Prep Time */}
          {product.prep_time_min && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{product.prep_time_min} นาที</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && product.description && (
        <div className="px-4 pb-4 border-t border-[#2C1810] mt-2 pt-3">
          <p className="text-sm text-gray-300 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  )
}