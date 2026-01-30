import { CartProvider } from '@/context/CartContext'
import { ReactNode } from 'react'

interface MenuLayoutProps {
  children: ReactNode
}

export default function MenuLayout({ children }: MenuLayoutProps) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
