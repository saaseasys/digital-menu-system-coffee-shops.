import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service Role Key สำหรับ bypass RLS (ต้องมีใน .env)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_id, items, total_amount, special_instructions } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่มีรายการสินค้า' },
        { status: 400 }
      );
    }

    // Generate Order Code (ORD-20250130-001)
    const today = new Date();
    const prefix = `ORD-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`;
    
    const { count } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .ilike('order_code', `${prefix}%`);
    
    const sequence = String((count || 0) + 1).padStart(3, '0');
    const order_code = `${prefix}-${sequence}`;

    // 1. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        table_id: table_id || null,
        order_code,
        total_amount: total_amount || 0,
        final_amount: total_amount || 0,
        special_instructions: special_instructions || '',
        status: 'pending',
        payment_status: 'unpaid'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถสร้างออเดอร์ได้: ' + orderError.message },
        { status: 500 }
      );
    }

    // 2. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product?.id,
      product_name: item.product?.name_th || 'Unknown',
      product_name_en: item.product?.name_en || null,
      price_at_time: item.product?.price || 0,
      quantity: item.quantity || 1,
      notes: item.notes || '',
      customizations: item.customizations || [],
      status: 'pending'
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // ลบ order ที่สร้างไปแล้วถ้า items สร้างไม่สำเร็จ
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถสร้างรายการสินค้าได้: ' + itemsError.message },
        { status: 500 }
      );
    }

    // 3. Update table status if table_id exists
    if (table_id) {
      await supabaseAdmin
        .from('tables')
        .update({ status: 'occupied' })
        .eq('id', table_id);
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        items: orderItems
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}

// สำหรับดึงออเดอร์ทั้งหมด (GET)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, table:tables(*), items:order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
