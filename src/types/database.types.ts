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
      groups: {
        Row: {
          id: string
          name: string
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          currency: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          group_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          name?: string
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          group_id: string
          description: string
          amount: number
          payer_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          description: string
          amount: number
          payer_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          description?: string
          amount?: number
          payer_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      expense_participants: {
        Row: {
          id: string
          expense_id: string
          member_id: string
          share_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          member_id: string
          share_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          member_id?: string
          share_amount?: number
          created_at?: string
        }
      }
    }
  }
}