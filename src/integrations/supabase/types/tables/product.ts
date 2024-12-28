export interface ProductsTable {
  Row: {
    id: string
    name: string
    description: string | null
    price: number
    image: string
    category: string
    is_new: boolean | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    name: string
    description?: string | null
    price: number
    image: string
    category: string
    is_new?: boolean | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    name?: string
    description?: string | null
    price?: number
    image?: string
    category?: string
    is_new?: boolean | null
    created_at?: string
    updated_at?: string
  }
}

export interface ProductCouponsTable {
  Row: {
    product_id: string
    coupon_id: string
  }
  Insert: {
    product_id: string
    coupon_id: string
  }
  Update: {
    product_id?: string
    coupon_id?: string
  }
}