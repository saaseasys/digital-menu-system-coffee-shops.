export interface Category {
  id: number
  name_th: string
  name_en?: string | null
  sort_order: number
  color?: string | null
  is_active: boolean
  created_at?: string
}

export interface Product {
  id: number
  category_id: number | null
  name_th: string
  name_en?: string | null
  description?: string | null
  price: number
  image_url?: string | null
  is_available: boolean
  is_featured: boolean
  tags?: string[] | null
  prep_time_min?: number | null
  created_at?: string
  updated_at?: string
  category?: Category | null
}

export interface ShopSettings {
  id?: number
  shop_name: string
  shop_tagline?: string | null
  logo_url?: string | null
  primary_color: string
  bg_color: string
  card_color: string
  currency: string
  enable_qr_order: boolean
}

export interface Customization {
  id: number
  product_id: number
  name: string
  options: any[]
  is_required: boolean
  sort_order: number
}