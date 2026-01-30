import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Order, Table } from '@/types/order'; // หรือจาก database.types

// กำหนด Type สำหรับข้อมูลที่มีการ Join (รวม table)
type OrderWithTable = Order & {
  table: Table | null;
};

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            table:tables(*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching orders:', error);
          return;
        }

        // Cast ข้อมูลให้ตรงกับ Type (Supabase ส่ง null ได้ แต่ Type อาจจะไม่รองรับ)
        if (data) {
          setOrders(data as unknown as OrderWithTable[]);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Subscribe realtime
    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading, refetch: () => {} };
}
