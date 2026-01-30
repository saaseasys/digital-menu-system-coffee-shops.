// ไม่แตะไฟล์ types/index.ts เดิม สร้างใหม่ไว้ import เพิ่ม
export interface Table {
  id: number;
  table_number: string;
  qr_code_url?: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  seat_count: number;
  created_at: string;
}

export interface Order {
  id: number;
  table_id: number | null;
  order_code: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  payment_method?: 'cash' | 'transfer' | 'qr_promptpay' | 'card';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  total_amount: number;
  final_amount: number;
  customer_name?: string;
  special_instructions?: string;
  created_at: string;
  table?: Table;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price_at_time: number;
  quantity: number;
  customizations: any[];
  notes?: string;
  status: 'pending' | 'cooking' | 'ready' | 'served';
}

export interface CartItem {
  product: any; // ใช้ Product จาก types/index.ts
  quantity: number;
  notes?: string;
  customizations?: any[];
}
