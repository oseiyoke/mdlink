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
      documents: {
        Row: {
          id: string
          title: string
          content: string
          edit_key: string
          slug: string
          created_at: string
          updated_at: string
          view_count: number
        }
        Insert: {
          id?: string
          title?: string
          content?: string
          edit_key: string
          slug: string
          created_at?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          id?: string
          title?: string
          content?: string
          edit_key?: string
          slug?: string
          created_at?: string
          updated_at?: string
          view_count?: number
        }
      }
    }
  }
}
