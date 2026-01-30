'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, tableId, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_id: tableId ? parseInt(tableId) : null,
          items,
          total_amount: total,
          special_instructions: ''
        })
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/order-status/${data.order.id}`);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">ตะกร้าว่างเปล่า</p>
          <Link href="/" className="text-[#D4A574] underline">
            กลับไปเลือกเมนู
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 pb-32">
      <h1 className="text-2xl font-bold text-[#D4A574] mb-6">ตะกร้าสินค้า</h1>
      {tableId && (
        <p className="text-gray-500 mb-4">โต๊ะที่ {tableId}</p>
      )}
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="bg-[#1A1A1A] p-4 rounded-2xl flex justify-between items-center">
            <div>
              <h3 className="text-[#F5F5DC] font-medium">{item.product.name_th}</h3>
              <p className="text-[#D4A574]">฿{item.product.price}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-[#2C1810] text-[#D4A574]"
              >
                -
              </button>
              <span className="text-white">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-[#2C1810] text-[#D4A574]"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#2C1810] p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">รวมทั้งหมด</span>
          <span className="text-2xl font-bold text-[#D4A574]">฿{total}</span>
        </div>
        <button
          onClick={handleConfirmOrder}
          disabled={loading}
          className="w-full bg-[#D4A574] text-[#0a0a0a] font-bold py-4 rounded-2xl disabled:opacity-50"
        >
          {loading ? 'กำลังสั่ง...' : 'ยืนยันการสั่ง'}
        </button>
      </div>
    </div>
  );
}