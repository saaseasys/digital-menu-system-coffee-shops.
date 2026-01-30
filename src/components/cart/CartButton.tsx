'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartButton() {
  const { items, total } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  if (count === 0) return null;

  return (
    <Link href="/cart">
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-[#D4A574] text-[#0a0a0a] rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform">
          <ShoppingBag size={20} />
          <span className="font-bold">{count} รายการ</span>
          <span className="font-bold">฿{total}</span>
        </div>
      </div>
    </Link>
  );
}