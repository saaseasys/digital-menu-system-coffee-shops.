'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// แก้ Type นี้ให้รองรับ null ทั้งหมด
interface CartItem {
  product: {
    id: number
    name_th: string
    name_en?: string | null  // ← แก้ตรงนี้ ให้เป็น string | null | undefined
    price: number
    image_url?: string | null  // ← แก้ตรงนี้ด้วย
    description?: string | null  // ← และตรงนี้
  }
  quantity: number
  notes?: string
  customizations?: any[]
}

interface CartContextType {
  items: CartItem[]
  tableId: string | null
  addItem: (item: CartItem) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  setTableId: (id: string) => void
  total: number
  itemCount: number
  mounted: boolean // เพิ่ม flag สำหรับจัดการ hydration
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [tableId, setTableIdState] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true)
    try {
      const savedCart = localStorage.getItem('brewmenu_cart')
      const savedTable = localStorage.getItem('brewmenu_tableId')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        setItems(Array.isArray(parsed) ? parsed : [])
      }
      if (savedTable) setTableIdState(savedTable)
    } catch (e) {
      console.error('Error loading cart:', e)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('brewmenu_cart', JSON.stringify(items))
      } catch (e) {
        console.error('Error saving cart:', e)
      }
    }
  }, [items, mounted])

  const setTableId = (id: string) => {
    setTableIdState(id)
    try {
      localStorage.setItem('brewmenu_tableId', id)
    } catch (e) {
      console.error('Error saving tableId:', e)
    }
  }

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === item.product.id)
      if (existing) {
        return prev.map(i => 
          i.product.id === item.product.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev => prev.map(i => 
      i.product.id === productId ? { ...i, quantity } : i
    ))
  }

  const clearCart = () => {
    setItems([])
    try {
      localStorage.removeItem('brewmenu_cart')
    } catch (e) {
      console.error('Error clearing cart:', e)
    }
  }

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, 
      tableId, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      setTableId, 
      total,
      itemCount,
      mounted
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

