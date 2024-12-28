export interface AppConfigTable {
  Row: {
    key: string
    value: string
    description: string | null
    updated_at: string | null
  }
  Insert: {
    key: string
    value: string
    description?: string | null
    updated_at?: string | null
  }
  Update: {
    key?: string
    value?: string
    description?: string | null
    updated_at?: string | null
  }
}

export interface CouponsTable {
  Row: {
    id: string
    code: string
    discount_percentage: number
    is_active: boolean | null
    created_at: string
    expires_at: string | null
  }
  Insert: {
    id?: string
    code: string
    discount_percentage: number
    is_active?: boolean | null
    created_at?: string
    expires_at?: string | null
  }
  Update: {
    id?: string
    code?: string
    discount_percentage?: number
    is_active?: boolean | null
    created_at?: string
    expires_at?: string | null
  }
}