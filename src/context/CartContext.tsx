'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem } from '@/types/order'

interface CartContextType {
  items: CartItem[]
  tableId: string | null
  currentOrderId: string | null // เพิ่ม: เก็บออเดอร์ที่กำลังทำอยู่
  addItem: (item: CartItem) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  setTableId: (id: string) => void
  loadPendingOrder: (orderId: string) => Promise<void> // เพิ่ม: โหลดออเดอร์ค้าง
  syncWithServer: () => Promise<void> // เพิ่ม: sync กับ server
  total: number
  itemCount: number
  mounted: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [tableId, setTableIdState] = useState<string | null>(null)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null) // State ใหม่
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true)
    try {
      const savedCart = localStorage.getItem('brewmenu_cart')
      const savedTable = localStorage.getItem('brewmenu_tableId')
      const savedOrderId = localStorage.getItem('brewmenu_currentOrderId')
      
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        setItems(Array.isArray(parsed) ? parsed : [])
      }
      if (savedTable) setTableIdState(savedTable)
      if (savedOrderId) setCurrentOrderId(savedOrderId)
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
    setCurrentOrderId(null) // เคลียร์ orderId ด้วย
    try {
      localStorage.removeItem('brewmenu_cart')
      localStorage.removeItem('brewmenu_currentOrderId')
    } catch (e) {
      console.error('Error clearing cart:', e)
    }
  }

  // ฟังก์ชันใหม่: โหลดออเดอร์ที่ยังไม่เสร็จ
  const loadPendingOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      const data = await res.json()
      
      if (data.success && data.order) {
        // ถ้าออเดอร์ยังไม่ served หรือ paid ให้เก็บไว้
        if (['pending', 'confirmed', 'preparing'].includes(data.order.status)) {
          setCurrentOrderId(orderId)
          localStorage.setItem('brewmenu_currentOrderId', orderId)
        } else {
          // ออเดอร์เสร็จแล้ว ล้าง reference
          localStorage.removeItem('brewmenu_currentOrderId')
          setCurrentOrderId(null)
        }
      }
    } catch (error) {
      console.error('Error loading pending order:', error)
    }
  }

  // ฟังก์ชันใหม่: Sync กับ server
  const syncWithServer = async () => {
    if (!currentOrderId) return
    await loadPendingOrder(currentOrderId)
  }

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, 
      tableId, 
      currentOrderId, // เพิ่มใน value
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      setTableId, 
      loadPendingOrder, // เพิ่มใน value
      syncWithServer, // เพิ่มใน value
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
