'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ถ้าไม่มี lucide-react ให้ใช้ SVG หรือ Text แทน
const ArrowLeft = () => <span>←</span>;
const Trash2 = () => <span>🗑</span>;
const Minus = () => <span>−</span>;
const Plus = () => <span>+</span>;
const ShoppingBag = () => <span>🛍</span>;

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, tableId, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirmOrder = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending order:', { table_id: tableId, items, total_amount: total });
      
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
      console.log('Response:', data);
      
      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการสั่งอาหาร');
      }
      
      if (data.success && data.order) {
        clearCart();
        // ไปหน้าสถานะออเดอร์ หรือถ้าไม่มีก็กลับไปหน้าโต๊ะ
        if (tableId) {
          router.push(`/table/${tableId}?order=${data.order.id}`);
        } else {
          router.push('/?order=success');
        }
      } else {
        throw new Error('ไม่สามารถสร้างออเดอร์ได้');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      setError(error.message || 'ไม่สามารถสั่งอาหารได้ กรุณาลองใหม่');
      alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถสั่งอาหารได้'));
    } finally {
      setLoading(false);
    }
  };

  // คำนวณจำนวนรายการทั้งหมด
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // ลิงก์กลับ (ถ้ามี tableId ให้กลับไปโต๊ะนั้น)
  const backLink = tableId ? `/table/${tableId}` : '/';

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4 opacity-50"><ShoppingBag /></div>
        <p className="text-gray-500 mb-6 text-lg">ตะกร้าว่างเปล่า</p>
        <Link href={backLink}>
          <button className="px-8 py-3 bg-[#D4A574] text-[#0a0a0a] rounded-full font-bold hover:bg-[#E5B685] transition-colors">
            กลับไปเลือกเมนู
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#2C1810] p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href={backLink}>
            <button className="p-2 rounded-full bg-[#1A1A1A] border border-[#2C1810] text-[#D4A574] hover:bg-[#252525] transition">
              <ArrowLeft />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-[#D4A574]">ตะกร้าสินค้า</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Table Info */}
        {tableId && (
          <div className="mb-6 p-4 bg-[#1A1A1A] rounded-xl border border-[#2C1810]">
            <p className="text-gray-400 text-sm">สั่งจาก</p>
            <p className="text-[#D4A574] font-bold text-lg">โต๊ะที่ {tableId}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2C1810]">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-[#2C1810] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.product.image_url ? (
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name_th}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">☕</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#F5F5DC] mb-1 truncate">
                    {item.product.name_th}
                  </h3>
                  <p className="text-[#D4A574] font-bold mb-3">฿{item.product.price}</p>
                  
                  {/* Quantity Control */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-[#2C1810] flex items-center justify-center text-[#D4A574] hover:bg-[#3C2820] transition active:scale-95"
                    >
                      <Minus />
                    </button>
                    <span className="text-white font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-[#2C1810] flex items-center justify-center text-[#D4A574] hover:bg-[#3C2820] transition active:scale-95"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="text-gray-600 hover:text-red-500 transition p-2"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#2C1810] p-4 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-500 text-sm">รวมทั้งหมด ({itemCount} รายการ)</p>
              <p className="text-xs text-gray-600">{items.length} หมวดหมู่</p>
            </div>
            <p className="text-3xl font-bold text-[#D4A574]">฿{total}</p>
          </div>
          
          <button
            onClick={handleConfirmOrder}
            disabled={loading || items.length === 0}
            className="w-full bg-[#D4A574] text-[#0a0a0a] font-bold py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5B685] active:scale-[0.98] transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> กำลังสั่ง...
              </span>
            ) : (
              'ยืนยันการสั่ง'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
