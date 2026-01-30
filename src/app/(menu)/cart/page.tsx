'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Icons แบบง่าย (ไม่ต้องใช้ lucide-react)
const ArrowLeft = () => <span className="text-xl">←</span>;
const Trash2 = () => <span className="text-xl">🗑</span>;
const Minus = () => <span className="text-lg">−</span>;
const Plus = () => <span className="text-lg">+</span>;
const ShoppingBag = () => <span className="text-4xl">🛍</span>;
const Loading = () => <span className="animate-spin">⟳</span>;

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, tableId, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      setError('ไม่มีรายการสินค้า');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Sending order:', { 
        table_id: tableId, 
        items_count: items.length, 
        total_amount: total 
      });
      
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

      console.log('📥 Response status:', res.status);
      
      // อ่าน response เป็น text ก่อน (ป้องกัน error ถ้าไม่ใช่ JSON)
      const text = await res.text();
      console.log('📥 Response text:', text.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // ถ้า parse JSON ไม่ได้ แสดงว่า server ส่ง error หรือ HTML กลับมา
        console.error('❌ JSON Parse Error:', parseError);
        throw new Error(`เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง (${res.status}): ${text.substring(0, 100)}`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: เกิดข้อผิดพลาด`);
      }
      
      console.log('✅ Order success:', data.order);
      
      // Clear cart and redirect
      clearCart();
      
      // Redirect ไปหน้าแสดงผลสำเร็จ
      if (tableId) {
        router.push(`/table/${tableId}?success=1&order=${data.order.id}`);
      } else {
        router.push('/?success=1');
      }
      
    } catch (error: any) {
      console.error('❌ Order error:', error);
      const errorMsg = error.message || 'ไม่สามารถสั่งอาหารได้ กรุณาลองใหม่';
      setError(errorMsg);
      // ไม่ใช้ alert เพราะจะขึ้นใน UI แทน
    } finally {
      setLoading(false);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const backLink = tableId ? `/table/${tableId}` : '/';

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4 opacity-50"><ShoppingBag /></div>
        <p className="text-gray-500 mb-2 text-lg">ตะกร้าว่างเปล่า</p>
        <p className="text-gray-600 text-sm mb-6">เลือกเมนูจากหน้าร้านก่อนนะครับ</p>
        <Link href={backLink}>
          <button className="px-8 py-3 bg-[#D4A574] text-[#0a0a0a] rounded-full font-bold hover:bg-[#E5B685] active:scale-95 transition-all">
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
            <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2C1810] text-[#D4A574] flex items-center justify-center hover:bg-[#252525] active:scale-95 transition">
              <ArrowLeft />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#D4A574]">ตะกร้าสินค้า</h1>
            <p className="text-xs text-gray-500">{itemCount} รายการ</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Table Info Card */}
        {tableId && (
          <div className="mb-4 p-4 bg-[#1A1A1A] rounded-2xl border border-[#2C1810]">
            <p className="text-gray-400 text-sm mb-1">สั่งจากโต๊ะ</p>
            <p className="text-[#D4A574] font-bold text-2xl">โต๊ะที่ {tableId}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-900/50 rounded-2xl text-red-400 text-sm">
            <p className="font-bold mb-1">เกิดข้อผิดพลาด</p>
            <p className="break-words">{error}</p>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2C1810]">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-xl bg-[#2C1810] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.product.image_url ? (
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name_th}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">☕</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#F5F5DC] mb-1 truncate">
                    {item.product.name_th}
                  </h3>
                  <p className="text-[#D4A574] font-bold text-lg mb-3">
                    ฿{item.product.price}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={loading}
                      className="w-10 h-10 rounded-full bg-[#2C1810] flex items-center justify-center text-[#D4A574] hover:bg-[#3C2820] active:scale-90 transition disabled:opacity-50"
                    >
                      <Minus />
                    </button>
                    <span className="text-white font-bold text-lg w-10 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={loading}
                      className="w-10 h-10 rounded-full bg-[#2C1810] flex items-center justify-center text-[#D4A574] hover:bg-[#3C2820] active:scale-90 transition disabled:opacity-50"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => removeItem(item.product.id)}
                  disabled={loading}
                  className="text-gray-500 hover:text-red-500 active:scale-90 transition p-2 disabled:opacity-50"
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
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-gray-400 text-sm">รวมทั้งหมด</p>
              <p className="text-gray-500 text-xs">{itemCount} รายการ ({items.length} หมวดหมู่)</p>
            </div>
            <p className="text-3xl font-bold text-[#D4A574]">฿{total}</p>
          </div>
          
          <button
            onClick={handleConfirmOrder}
            disabled={loading || items.length === 0}
            className="w-full bg-[#D4A574] text-[#0a0a0a] font-bold py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5B685] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loading /> กำลังสั่ง...
              </>
            ) : (
              'ยืนยันการสั่ง'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
