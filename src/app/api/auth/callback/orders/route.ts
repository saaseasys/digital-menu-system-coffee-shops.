import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_id, items, total_amount, special_instructions } = body;

    // Generate Order Code (ORD-001, ORD-002...)
    const today = new Date();
    const prefix = `ORD-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`;
    
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .like('order_code', `${prefix}%`);
    
    const sequence = String((count || 0) + 1).padStart(3, '0');
    const order_code = `${prefix}-${sequence}`;

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        table_id,
        order_code,
        total_amount,
        final_amount: total_amount,
        special_instructions,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name_th,
      product_name_en: item.product.name_en,
      price_at_time: item.product.price,
      quantity: item.quantity,
      notes: item.notes,
      customizations: item.customizations || []
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Update table status to occupied
    if (table_id) {
      await supabase
        .from('tables')
        .update({ status: 'occupied' })
        .eq('id', table_id);
    }

    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}