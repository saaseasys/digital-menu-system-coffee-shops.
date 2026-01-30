export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ==========================================
      // ตารางเดิม (Existing)
      // ==========================================
      categories: {
        Row: {
          id: number
          name_th: string
          name_en: string | null
          sort_order: number
          color: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: never
          name_th: string
          name_en?: string | null
          sort_order?: number
          color?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: never
          name_th?: string
          name_en?: string | null
          sort_order?: number
          color?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: number
          category_id: number | null
          name_th: string
          name_en: string | null
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          tags: string[] | null
          prep_time_min: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          category_id?: number | null
          name_th: string
          name_en?: string | null
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          tags?: string[] | null
          prep_time_min?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          category_id?: number | null
          name_th?: string
          name_en?: string | null
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          tags?: string[] | null
          prep_time_min?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      customizations: {
        Row: {
          id: number
          product_id: number
          name: string
          options: Json
          is_required: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: never
          product_id: number
          name: string
          options?: Json
          is_required?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: never
          product_id?: number
          name?: string
          options?: Json
          is_required?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customizations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      shop_settings: {
        Row: {
          id: number
          shop_name: string
          shop_tagline: string | null
          logo_url: string | null
          primary_color: string
          bg_color: string
          card_color: string
          currency: string
          enable_qr_order: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          shop_name?: string
          shop_tagline?: string | null
          logo_url?: string | null
          primary_color?: string
          bg_color?: string
          card_color?: string
          currency?: string
          enable_qr_order?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          shop_name?: string
          shop_tagline?: string | null
          logo_url?: string | null
          primary_color?: string
          bg_color?: string
          card_color?: string
          currency?: string
          enable_qr_order?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_versions: {
        Row: {
          id: number
          version: string
          description: string | null
          applied_at: string
        }
        Insert: {
          id?: never
          version: string
          description?: string | null
          applied_at?: string
        }
        Update: {
          id?: never
          version?: string
          description?: string | null
          applied_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // ==========================================
      // ตารางใหม่ (New - Order System)
      // ==========================================
      tables: {
        Row: {
          id: number
          table_number: string
          qr_code_url: string | null
          status: 'available' | 'occupied' | 'reserved' | 'cleaning'
          seat_count: number
          position_x: number
          position_y: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          table_number: string
          qr_code_url?: string | null
          status?: 'available' | 'occupied' | 'reserved' | 'cleaning'
          seat_count?: number
          position_x?: number
          position_y?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          table_number?: string
          qr_code_url?: string | null
          status?: 'available' | 'occupied' | 'reserved' | 'cleaning'
          seat_count?: number
          position_x?: number
          position_y?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: number
          table_id: number | null
          order_code: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
          payment_method: 'cash' | 'transfer' | 'qr_promptpay' | null
          payment_status: 'unpaid' | 'paid' | 'refunded'
          total_amount: number
          discount_amount: number
          final_amount: number
          customer_count: number
          customer_name: string | null
          special_instructions: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          completed_at: string | null
          paid_at: string | null
        }
        Insert: {
          id?: never
          table_id?: number | null
          order_code: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
          payment_method?: 'cash' | 'transfer' | 'qr_promptpay' | null
          payment_status?: 'unpaid' | 'paid' | 'refunded'
          total_amount?: number
          discount_amount?: number
          final_amount?: number
          customer_count?: number
          customer_name?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          completed_at?: string | null
          paid_at?: string | null
        }
        Update: {
          id?: never
          table_id?: number | null
          order_code?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
          payment_method?: 'cash' | 'transfer' | 'qr_promptpay' | null
          payment_status?: 'unpaid' | 'paid' | 'refunded'
          total_amount?: number
          discount_amount?: number
          final_amount?: number
          customer_count?: number
          customer_name?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          completed_at?: string | null
          paid_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number | null
          product_name: string
          product_name_en: string | null
          price_at_time: number
          quantity: number
          customizations: Json
          notes: string | null
          status: 'pending' | 'cooking' | 'ready' | 'served'
          created_at: string
        }
        Insert: {
          id?: never
          order_id: number
          product_id?: number | null
          product_name: string
          product_name_en?: string | null
          price_at_time: number
          quantity: number
          customizations?: Json
          notes?: string | null
          status?: 'pending' | 'cooking' | 'ready' | 'served'
          created_at?: string
        }
        Update: {
          id?: never
          order_id?: number
          product_id?: number | null
          product_name?: string
          product_name_en?: string | null
          price_at_time?: number
          quantity?: number
          customizations?: Json
          notes?: string | null
          status?: 'pending' | 'cooking' | 'ready' | 'served'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      table_sessions: {
        Row: {
          id: number
          table_id: number
          current_order_id: number | null
          session_token: string
          customer_phone: string | null
          started_at: string
          ended_at: string | null
          status: 'active' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: never
          table_id: number
          current_order_id?: number | null
          session_token: string
          customer_phone?: string | null
          started_at?: string
          ended_at?: string | null
          status?: 'active' | 'completed' | 'cancelled'
        }
        Update: {
          id?: never
          table_id?: number
          current_order_id?: number | null
          session_token?: string
          customer_phone?: string | null
          started_at?: string
          ended_at?: string | null
          status?: 'active' | 'completed' | 'cancelled'
        }
        Relationships: [
          {
            foreignKeyName: "table_sessions_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_sessions_current_order_id_fkey"
            columns: ["current_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper Types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience Types
export type Category = Tables<'categories'>
export type Product = Tables<'products'>
export type ShopSettings = Tables<'shop_settings'>
export type Table = Tables<'tables'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type TableSession = Tables<'table_sessions'>
