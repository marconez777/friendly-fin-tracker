export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          default_context: "Pessoal" | "Empresa"
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          default_context?: "Pessoal" | "Empresa"
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          default_context?: "Pessoal" | "Empresa"
        }
      }
      categories: {
        Row: {
          id: number
          user_id: string
          name: string
          type: "Receita" | "Despesa"
          active: boolean
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          type: "Receita" | "Despesa"
          active?: boolean
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          type?: "Receita" | "Despesa"
          active?: boolean
        }
      }
      fixed_items: {
        Row: {
          id: number
          user_id: string
          description: string
          type: "Receita" | "Despesa"
          context: "Pessoal" | "Empresa"
          category_id: number
          value: number
          due_day: number
          active: boolean
        }
        Insert: {
          id?: number
          user_id: string
          description: string
          type: "Receita" | "Despesa"
          context: "Pessoal" | "Empresa"
          category_id: number
          value: number
          due_day: number
          active?: boolean
        }
        Update: {
          id?: number
          user_id?: string
          description?: string
          type?: "Receita" | "Despesa"
          context?: "Pessoal" | "Empresa"
          category_id?: number
          value?: number
          due_day?: number
          active?: boolean
        }
      }
      transactions: {
        Row: {
          id: number
          user_id: string
          date: string
          description: string
          type: "Receita" | "Despesa"
          context: "Pessoal" | "Empresa"
          category_id: number
          value: number
          status: "Pendente" | "Pago" | "Recebido"
          fixed_item_id: number | null
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          description: string
          type: "Receita" | "Despesa"
          context: "Pessoal" | "Empresa"
          category_id: number
          value: number
          status: "Pendente" | "Pago" | "Recebido"
          fixed_item_id?: number | null
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          description?: string
          type?: "Receita" | "Despesa"
          context?: "Pessoal" | "Empresa"
          category_id?: number
          value?: number
          status?: "Pendente" | "Pago" | "Recebido"
          fixed_item_id?: number | null
        }
      }
      cards: {
        Row: {
          id: number
          user_id: string
          label: string
          closing_day: number
          due_day: number
          context_mode: "Pessoal" | "Empresa" | "Misto"
        }
        Insert: {
          id?: number
          user_id: string
          label: string
          closing_day: number
          due_day: number
          context_mode: "Pessoal" | "Empresa" | "Misto"
        }
        Update: {
          id?: number
          user_id?: string
          label?: string
          closing_day?: number
          due_day?: number
          context_mode?: "Pessoal" | "Empresa" | "Misto"
        }
      }
      card_invoices: {
        Row: {
          id: number
          card_id: number
          month: string
          status: "Aberta" | "Fechada" | "Paga"
        }
        Insert: {
          id?: number
          card_id: number
          month: string
          status: "Aberta" | "Fechada" | "Paga"
        }
        Update: {
          id?: number
          card_id?: number
          month?: string
          status?: "Aberta" | "Fechada" | "Paga"
        }
      }
      card_invoice_items: {
        Row: {
          id: number
          card_invoice_id: number
          transaction_id: number
          installment_of: number | null
          installment_number: number
          installment_total: number
        }
        Insert: {
          id?: number
          card_invoice_id: number
          transaction_id: number
          installment_of?: number | null
          installment_number: number
          installment_total: number
        }
        Update: {
          id?: number
          card_invoice_id?: number
          transaction_id?: number
          installment_of?: number | null
          installment_number?: number
          installment_total?: number
        }
      }
      staging_items: {
        Row: {
          id: number
          user_id: string
          raw_payload: Json
          date: string
          description: string
          value: number
          card_label: string | null
          suggested_context: "Pessoal" | "Empresa" | null
          suggested_category_id: number | null
          status: "Pendente" | "Aprovado" | "Ignorado"
          decided_context: "Pessoal" | "Empresa" | null
          decided_category_id: number | null
        }
        Insert: {
          id?: number
          user_id: string
          raw_payload: Json
          date: string
          description: string
          value: number
          card_label?: string | null
          suggested_context?: "Pessoal" | "Empresa" | null
          suggested_category_id?: number | null
          status?: "Pendente" | "Aprovado" | "Ignorado"
          decided_context?: "Pessoal" | "Empresa" | null
          decided_category_id?: number | null
        }
        Update: {
          id?: number
          user_id?: string
          raw_payload?: Json
          date?: string
          description?: string
          value?: number
          card_label?: string | null
          suggested_context?: "Pessoal" | "Empresa" | null
          suggested_category_id?: number | null
          status?: "Pendente" | "Aprovado" | "Ignorado"
          decided_context?: "Pessoal" | "Empresa" | null
          decided_category_id?: number | null
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
