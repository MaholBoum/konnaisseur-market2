export interface PaymentRequestsTable {
  Row: {
    id: string
    order_id: string | null
    amount: number
    status: string
    wallet_address: string
    transaction_hash: string | null
    created_at: string
    updated_at: string
    webhook_url: string | null
    retry_count: number | null
    confirmed_at: string | null
    expiry: string | null
    network: string
    token_contract: string
  }
  Insert: {
    id?: string
    order_id?: string | null
    amount: number
    status?: string
    wallet_address: string
    transaction_hash?: string | null
    created_at?: string
    updated_at?: string
    webhook_url?: string | null
    retry_count?: number | null
    confirmed_at?: string | null
    expiry?: string | null
    network?: string
    token_contract?: string
  }
  Update: {
    id?: string
    order_id?: string | null
    amount?: number
    status?: string
    wallet_address?: string
    transaction_hash?: string | null
    created_at?: string
    updated_at?: string
    webhook_url?: string | null
    retry_count?: number | null
    confirmed_at?: string | null
    expiry?: string | null
    network?: string
    token_contract?: string
  }
}

export interface PaymentRequestErrorsTable {
  Row: {
    id: string
    payment_id: string | null
    error_message: string
    error_time: string | null
    created_at: string | null
  }
  Insert: {
    id?: string
    payment_id?: string | null
    error_message: string
    error_time?: string | null
    created_at?: string | null
  }
  Update: {
    id?: string
    payment_id?: string | null
    error_message?: string
    error_time?: string | null
    created_at?: string | null
  }
}

export interface WebhookFailuresTable {
  Row: {
    id: string
    payment_id: string | null
    webhook_url: string
    error_message: string
    failure_time: string | null
    created_at: string | null
  }
  Insert: {
    id?: string
    payment_id?: string | null
    webhook_url: string
    error_message: string
    failure_time?: string | null
    created_at?: string | null
  }
  Update: {
    id?: string
    payment_id?: string | null
    webhook_url?: string
    error_message?: string
    failure_time?: string | null
    created_at?: string | null
  }
}