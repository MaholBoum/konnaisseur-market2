export interface OrdersTable {
  Row: {
    id: string
    total_amount: number
    coupon_code: string | null
    discount_amount: number | null
    final_amount: number
    status: string
    created_at: string
    telegram_username: string | null
  }
  Insert: {
    id?: string
    total_amount: number
    coupon_code?: string | null
    discount_amount?: number | null
    final_amount: number
    status?: string
    created_at?: string
    telegram_username?: string | null
  }
  Update: {
    id?: string
    total_amount?: number
    coupon_code?: string | null
    discount_amount?: number | null
    final_amount?: number
    status?: string
    created_at?: string
    telegram_username?: string | null
  }
}

export interface OrderItemsTable {
  Row: {
    id: string
    order_id: string | null
    product_id: string | null
    quantity: number
    unit_price: number
    total_price: number
  }
  Insert: {
    id?: string
    order_id?: string | null
    product_id?: string | null
    quantity: number
    unit_price: number
    total_price: number
  }
  Update: {
    id?: string
    order_id?: string | null
    product_id?: string | null
    quantity?: number
    unit_price?: number
    total_price?: number
  }
}