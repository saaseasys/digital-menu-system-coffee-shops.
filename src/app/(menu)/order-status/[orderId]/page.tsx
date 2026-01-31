'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types/order';

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    
    // Realtime subscription
    const channel = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          fetchOrder();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const fetchOrder = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*), table:tables(*)')
      .eq('id', parseInt(orderId))
      .single();
    
    if (data) {
      setOrder(data as Order);
    }
    setLoading(false);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'รอการยืนยัน',
      'confirmed': 'ยืนยันแล้ว',
      'preparing': 'กำลังเตรียม',
      'ready': 'พร้อมเสิร์ฟ',
      'served': 'เสิร์ฟแล้ว',
      'paid': 'ชำระเงินแล้ว',
      'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#D4A574]">กำลังโหลด...</div>;
  if (!order) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-400">ไม่พบออเดอร์</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-[#D4A574] mb-6 text-center">สถานะออเดอร์</h1>
        
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2C1810] mb-4">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm mb-1">รหัสออเดอร์</p>
            <p className="text-2xl font-bold text-white">{order.order_code}</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className={`px-6 py-2 rounded-full text-lg font-bold ${
              order.status === 'cancelled' ? 'bg-red-900 text-red-400' :
              order.status === 'served' || order.status === 'paid' ? 'bg-green-900 text-green-400' :
              'bg-yellow-900 text-yellow-400'
            }`}>
              {getStatusText(order.status)}
            </div>
          </div>

          {order.table && (
            <p className="text-center text-gray-400 mb-4">
              โต๊ะที่ {order.table.table_number}
            </p>
          )}

          <div className="border-t border-[#2C1810] pt-4">
            <h3 className="text-white font-bold mb-3">รายการที่สั่ง</h3>
            <div className="space-y-2">
              {(order as any).items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-gray-300">
                  <span>{item.product_name} x{item.quantity}</span>
                  <span>฿{item.price_at_time * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#2C1810] mt-4 pt-4 flex justify-between text-[#D4A574] font-bold text-xl">
              <span>รวม</span>
              <span>฿{order.total_amount}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>หน้าจอนี้อัปเดตอัตโนมัติ</p>
          <p>ไม่ต้องรีเฟรช</p>
        </div>

        <button
          onClick={() => router.push(order.table_id ? `/table/${order.table_id}` : '/')}
          className="w-full mt-6 py-3 bg-[#2C1810] text-[#D4A574] rounded-xl hover:bg-[#3C2820]"
        >
          กลับไปหน้าเมนู
        </button>
      </div>
    </div>
  );

}
