import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ดึงออเดอร์เฉพาะ ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        table:tables(*)
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบออเดอร์' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// อัปเดตสถานะออเดอร์ (เช่น paid, cancelled)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updates: any = {
      ...body,
      updated_at: new Date().toISOString()
    };

    // ถ้ามีการจ่ายเงิน บันทึกเวลาจ่าย
    if (body.payment_status === 'paid') {
      updates.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ลบออเดอร์ (Soft delete หรือ Hard delete - ใช้ระวัง)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // อัปเดตสถานะเป็น cancelled แทนการลบจริง (Soft delete)
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'ยกเลิกออเดอร์เรียบร้อย',
      order: data 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}