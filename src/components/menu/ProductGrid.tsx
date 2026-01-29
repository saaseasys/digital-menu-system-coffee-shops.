import ProductCard from './ProductCard'
import { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  currency: string
  primaryColor: string
}

export default function ProductGrid({ products, currency, primaryColor }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>ไม่มีสินค้าในหมวดหมู่นี้</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currency={currency}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  )
}