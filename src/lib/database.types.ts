export interface Database {
  public: {
    Tables: {
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
          prep_time_min: number | null
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
          prep_time_min?: number | null
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
          prep_time_min?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
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
      customizations: {
        Row: {
          id: number
          product_id: number
          name: string
          options: any
          is_required: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: never
          product_id: number
          name: string
          options?: any
          is_required?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: never
          product_id?: number
          name?: string
          options?: any
          is_required?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customizations_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
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