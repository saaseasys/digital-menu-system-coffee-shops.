'use client';

import { useOrders } from '@/hooks/useOrders';

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return <div className="p-8 text-center text-white">กำลังโหลด...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#D4A574] mb-6">จัดการออเดอร์</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-[#1A1A1A] border border-[#2C1810] rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#F5F5DC] font-bold">ออเดอร์ #{order.order_code}</h3>
                <p className="text-sm text-gray-500">
                  โต๊ะ {order.table?.table_number || 'ไม่ระบุ'} • 
                  {new Date(order.created_at).toLocaleTimeString('th-TH')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                order.status === 'pending' ? 'bg-yellow-900 text-yellow-400' :
                order.status === 'preparing' ? 'bg-blue-900 text-blue-400' :
                order.status === 'ready' ? 'bg-green-900 text-green-400' :
                'bg-gray-800 text-gray-400'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-[#D4A574] text-[#0a0a0a] py-2 rounded-xl font-medium">
                รับออเดอร์
              </button>
              <button className="flex-1 border border-[#D4A574] text-[#D4A574] py-2 rounded-xl">
                ยกเลิก
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
