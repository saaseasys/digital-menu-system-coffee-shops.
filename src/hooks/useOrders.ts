import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/order';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลครั้งแรก
    fetchOrders();

    // Subscribe realtime
    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order change:', payload);
          fetchOrders(); // หรือจะ update state แบบ optimistic ก็ได้
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, table:tables(*)`)
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  return { orders, loading, refetch: fetchOrders };
}