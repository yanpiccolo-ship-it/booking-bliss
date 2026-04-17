export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_conversations: {
        Row: {
          agent_id: string
          business_id: string
          created_at: string
          id: string
          metadata: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          business_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          business_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_conversations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          authorized: boolean | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          requires_authorization: boolean | null
          role: string
        }
        Insert: {
          authorized?: boolean | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          requires_authorization?: boolean | null
          role: string
        }
        Update: {
          authorized?: boolean | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          requires_authorization?: boolean | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_type: string
          ai_model: string
          business_id: string | null
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          name: string
          requires_authorization: boolean
          system_prompt: string
          updated_at: string
        }
        Insert: {
          agent_type: string
          ai_model?: string
          business_id?: string | null
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name: string
          requires_authorization?: boolean
          system_prompt: string
          updated_at?: string
        }
        Update: {
          agent_type?: string
          ai_model?: string
          business_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name?: string
          requires_authorization?: boolean
          system_prompt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_logs: {
        Row: {
          business_id: string
          dimensions: Json | null
          id: string
          metric_type: string
          metric_value: number | null
          recorded_at: string | null
        }
        Insert: {
          business_id: string
          dimensions?: Json | null
          id?: string
          metric_type: string
          metric_value?: number | null
          recorded_at?: string | null
        }
        Update: {
          business_id?: string
          dimensions?: Json | null
          id?: string
          metric_type?: string
          metric_value?: number | null
          recorded_at?: string | null
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          business_id: string
          error_message: string | null
          executed_at: string | null
          id: string
          payload: Json | null
          result: string | null
          rule_id: string | null
          trigger_event: string | null
        }
        Insert: {
          business_id: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          payload?: Json | null
          result?: string | null
          rule_id?: string | null
          trigger_event?: string | null
        }
        Update: {
          business_id?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          payload?: Json | null
          result?: string | null
          rule_id?: string | null
          trigger_event?: string | null
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          actions: Json | null
          business_id: string
          conditions: Json | null
          created_at: string | null
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          name: string
          trigger_event: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          business_id: string
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name: string
          trigger_event: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          business_id?: string
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name?: string
          trigger_event?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      availability_rules: {
        Row: {
          buffer_after: number | null
          buffer_before: number | null
          business_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          resource_id: string | null
          start_time: string
        }
        Insert: {
          buffer_after?: number | null
          buffer_before?: number | null
          business_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          resource_id?: string | null
          start_time: string
        }
        Update: {
          buffer_after?: number | null
          buffer_before?: number | null
          business_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          resource_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_rules_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      business_memberships: {
        Row: {
          business_id: string
          created_at: string
          end_date: string | null
          id: string
          membership_id: string
          start_date: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          membership_id: string
          start_date?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          membership_id?: string
          start_date?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_memberships_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_memberships_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          country: string | null
          created_at: string
          description: string | null
          gallery_urls: Json | null
          id: string
          is_active: boolean | null
          language: string | null
          logo_url: string | null
          metadata: Json | null
          name: string
          owner_id: string
          postal_code: string | null
          slug: string | null
          social_links: Json | null
          theme_color: string | null
          timezone: string | null
          updated_at: string
          vertical: Database["public"]["Enums"]["business_vertical"]
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          gallery_urls?: Json | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          owner_id: string
          postal_code?: string | null
          slug?: string | null
          social_links?: Json | null
          theme_color?: string | null
          timezone?: string | null
          updated_at?: string
          vertical: Database["public"]["Enums"]["business_vertical"]
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          gallery_urls?: Json | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          postal_code?: string | null
          slug?: string | null
          social_links?: Json | null
          theme_color?: string | null
          timezone?: string | null
          updated_at?: string
          vertical?: Database["public"]["Enums"]["business_vertical"]
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          language: string | null
          lead_business_name: string | null
          lead_email: string | null
          lead_name: string | null
          lead_phone: string | null
          lead_vertical: Database["public"]["Enums"]["business_vertical"] | null
          metadata: Json | null
          session_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          language?: string | null
          lead_business_name?: string | null
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_vertical?:
            | Database["public"]["Enums"]["business_vertical"]
            | null
          metadata?: Json | null
          session_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          language?: string | null
          lead_business_name?: string | null
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_vertical?:
            | Database["public"]["Enums"]["business_vertical"]
            | null
          metadata?: Json | null
          session_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_scores: {
        Row: {
          business_id: string
          cancellations: number | null
          completed: number | null
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          id: string
          no_shows: number | null
          reliability_score: number
          total_reservations: number | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          cancellations?: number | null
          completed?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          id?: string
          no_shows?: number | null
          reliability_score?: number
          total_reservations?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          cancellations?: number | null
          completed?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          id?: string
          no_shows?: number | null
          reliability_score?: number
          total_reservations?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_orders: {
        Row: {
          assigned_at: string | null
          business_id: string
          created_at: string | null
          delivered_at: string | null
          delivery_address: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          driver_id: string | null
          estimated_minutes: number | null
          id: string
          notes: string | null
          order_id: string
          picked_up_at: string | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          business_id: string
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          driver_id?: string | null
          estimated_minutes?: number | null
          id?: string
          notes?: string | null
          order_id: string
          picked_up_at?: string | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          business_id?: string
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          driver_id?: string | null
          estimated_minutes?: number | null
          id?: string
          notes?: string | null
          order_id?: string
          picked_up_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      demand_predictions: {
        Row: {
          business_id: string
          confidence_score: number | null
          created_at: string | null
          id: string
          model_version: string | null
          predicted_date: string
          predicted_demand: number | null
          service_id: string | null
        }
        Insert: {
          business_id: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          model_version?: string | null
          predicted_date: string
          predicted_demand?: number | null
          service_id?: string | null
        }
        Update: {
          business_id?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          model_version?: string | null
          predicted_date?: string
          predicted_demand?: number | null
          service_id?: string | null
        }
        Relationships: []
      }
      drivers: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          status: string | null
          vehicle: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          status?: string | null
          vehicle?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          status?: string | null
          vehicle?: string | null
        }
        Relationships: []
      }
      dynamic_pricing_rules: {
        Row: {
          base_multiplier: number | null
          business_id: string
          created_at: string | null
          day_of_week: number | null
          end_date: string | null
          end_time: string | null
          event_multiplier: number | null
          id: string
          is_active: boolean | null
          name: string | null
          service_id: string | null
          start_date: string | null
          start_time: string | null
        }
        Insert: {
          base_multiplier?: number | null
          business_id: string
          created_at?: string | null
          day_of_week?: number | null
          end_date?: string | null
          end_time?: string | null
          event_multiplier?: number | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          service_id?: string | null
          start_date?: string | null
          start_time?: string | null
        }
        Update: {
          base_multiplier?: number | null
          business_id?: string
          created_at?: string | null
          day_of_week?: number | null
          end_date?: string | null
          end_time?: string | null
          event_multiplier?: number | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          service_id?: string | null
          start_date?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          business_id: string
          created_at: string | null
          current_stock: number | null
          id: string
          is_active: boolean | null
          last_restock_at: string | null
          max_stock: number | null
          min_stock: number | null
          name: string
          sku: string | null
          supplier_id: string | null
          unit: string | null
          unit_cost_cents: number | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          current_stock?: number | null
          id?: string
          is_active?: boolean | null
          last_restock_at?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          sku?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_cost_cents?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          current_stock?: number | null
          id?: string
          is_active?: boolean | null
          last_restock_at?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          sku?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_cost_cents?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kitchen_orders: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          notes: string | null
          order_id: string
          priority: number | null
          ready_at: string | null
          started_at: string | null
          station_id: string | null
          status: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          priority?: number | null
          ready_at?: string | null
          started_at?: string | null
          station_id?: string | null
          status?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          priority?: number | null
          ready_at?: string | null
          started_at?: string | null
          station_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      kitchen_stations: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          max_rubros: number
          monthly_fee_cents: number
          name: string
          price_cents: number
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          max_rubros?: number
          monthly_fee_cents?: number
          name: string
          price_cents: number
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          max_rubros?: number
          monthly_fee_cents?: number
          name?: string
          price_cents?: number
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: Json | null
          business_id: string
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          menu_id: string
          name: string
          price_cents: number
        }
        Insert: {
          allergens?: Json | null
          business_id: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          menu_id: string
          name: string
          price_cents?: number
        }
        Update: {
          allergens?: Json | null
          business_id?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          menu_id?: string
          name?: string
          price_cents?: number
        }
        Relationships: []
      }
      menus: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          menu_item_id: string | null
          name: string
          notes: string | null
          order_id: string
          quantity: number
          status: string | null
          unit_price_cents: number
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          name: string
          notes?: string | null
          order_id: string
          quantity?: number
          status?: string | null
          unit_price_cents?: number
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          name?: string
          notes?: string | null
          order_id?: string
          quantity?: number
          status?: string | null
          unit_price_cents?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          business_id: string
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string | null
          reservation_id: string | null
          source: string | null
          status: string | null
          table_number: string | null
          total_cents: number | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reservation_id?: string | null
          source?: string | null
          status?: string | null
          table_number?: string | null
          total_cents?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reservation_id?: string | null
          source?: string | null
          status?: string | null
          table_number?: string | null
          total_cents?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      overbooking_settings: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          overbooking_percentage: number | null
          resource_type_id: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          overbooking_percentage?: number | null
          resource_type_id?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          overbooking_percentage?: number | null
          resource_type_id?: string | null
        }
        Relationships: []
      }
      pricing_adjustments: {
        Row: {
          adjustment_time: string | null
          applied_by: string | null
          business_id: string
          id: string
          metadata: Json | null
          new_price: number | null
          old_price: number | null
          reason: string | null
          service_id: string | null
        }
        Insert: {
          adjustment_time?: string | null
          applied_by?: string | null
          business_id: string
          id?: string
          metadata?: Json | null
          new_price?: number | null
          old_price?: number | null
          reason?: string | null
          service_id?: string | null
        }
        Update: {
          adjustment_time?: string | null
          applied_by?: string | null
          business_id?: string
          id?: string
          metadata?: Json | null
          new_price?: number | null
          old_price?: number | null
          reason?: string | null
          service_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_id: string | null
          created_at: string
          display_name: string | null
          id: string
          language: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          business_id: string
          created_at: string | null
          expected_at: string | null
          id: string
          items: Json | null
          notes: string | null
          ordered_at: string | null
          received_at: string | null
          status: string | null
          supplier_id: string
          total_cents: number | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          expected_at?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          ordered_at?: string | null
          received_at?: string | null
          status?: string | null
          supplier_id: string
          total_cents?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          expected_at?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          ordered_at?: string | null
          received_at?: string | null
          status?: string | null
          supplier_id?: string
          total_cents?: number | null
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          business_id: string
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string | null
          scans: number | null
          target_id: string | null
          type: string | null
        }
        Insert: {
          business_id: string
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          scans?: number | null
          target_id?: string | null
          type?: string | null
        }
        Update: {
          business_id?: string
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          scans?: number | null
          target_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      reservation_confirmations: {
        Row: {
          business_id: string
          channel: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          reservation_id: string
          responded_at: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          business_id: string
          channel?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          reservation_id: string
          responded_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          business_id?: string
          channel?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          reservation_id?: string
          responded_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          amount_paid_cents: number | null
          business_id: string
          check_in_date: string | null
          check_out_date: string | null
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          end_time: string | null
          id: string
          is_multi_day: boolean | null
          language_code: string | null
          metadata: Json | null
          nights_count: number | null
          notes: string | null
          party_size: number | null
          price_per_night: number | null
          raw_transcript: string | null
          reservation_date: string
          reservation_time: string
          resource_id: string | null
          room_type_id: string | null
          service_id: string
          source: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["reservation_status"] | null
          stripe_payment_id: string | null
          total_price: number | null
          updated_at: string
        }
        Insert: {
          amount_paid_cents?: number | null
          business_id: string
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string | null
          id?: string
          is_multi_day?: boolean | null
          language_code?: string | null
          metadata?: Json | null
          nights_count?: number | null
          notes?: string | null
          party_size?: number | null
          price_per_night?: number | null
          raw_transcript?: string | null
          reservation_date: string
          reservation_time: string
          resource_id?: string | null
          room_type_id?: string | null
          service_id: string
          source?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["reservation_status"] | null
          stripe_payment_id?: string | null
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          amount_paid_cents?: number | null
          business_id?: string
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string | null
          id?: string
          is_multi_day?: boolean | null
          language_code?: string | null
          metadata?: Json | null
          nights_count?: number | null
          notes?: string | null
          party_size?: number | null
          price_per_night?: number | null
          raw_transcript?: string | null
          reservation_date?: string
          reservation_time?: string
          resource_id?: string | null
          room_type_id?: string | null
          service_id?: string
          source?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["reservation_status"] | null
          stripe_payment_id?: string | null
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_exceptions: {
        Row: {
          alt_end_time: string | null
          alt_start_time: string | null
          business_id: string
          created_at: string | null
          exception_date: string
          id: string
          is_closed: boolean | null
          reason: string | null
          resource_id: string | null
        }
        Insert: {
          alt_end_time?: string | null
          alt_start_time?: string | null
          business_id: string
          created_at?: string | null
          exception_date: string
          id?: string
          is_closed?: boolean | null
          reason?: string | null
          resource_id?: string | null
        }
        Update: {
          alt_end_time?: string | null
          alt_start_time?: string | null
          business_id?: string
          created_at?: string | null
          exception_date?: string
          id?: string
          is_closed?: boolean | null
          reason?: string | null
          resource_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_exceptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_exceptions_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_types: {
        Row: {
          business_id: string
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_types_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          business_id: string
          capacity: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          resource_type_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          capacity?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          resource_type_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          capacity?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          resource_type_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_resource_type_id_fkey"
            columns: ["resource_type_id"]
            isOneToOne: false
            referencedRelation: "resource_types"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          id: string
          is_visible: boolean | null
          rating: number
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          id?: string
          is_visible?: boolean | null
          rating?: number
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          id?: string
          is_visible?: boolean | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          amenities: Json | null
          base_price: number | null
          business_id: string
          capacity: number | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          amenities?: Json | null
          base_price?: number | null
          business_id: string
          capacity?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          amenities?: Json | null
          base_price?: number | null
          business_id?: string
          capacity?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_types_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_pricing: {
        Row: {
          business_id: string
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string | null
          price_per_night: number | null
          room_type_id: string | null
          start_date: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price_per_night?: number | null
          room_type_id?: string | null
          start_date?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price_per_night?: number | null
          room_type_id?: string | null
          start_date?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          buffer_after: number | null
          buffer_before: number | null
          business_id: string
          capacity: number
          capacity_required: number | null
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          location: string | null
          metadata: Json | null
          name: string
          price_cents: number
          resource_type_id: string | null
          updated_at: string
        }
        Insert: {
          buffer_after?: number | null
          buffer_before?: number | null
          business_id: string
          capacity?: number
          capacity_required?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          location?: string | null
          metadata?: Json | null
          name: string
          price_cents?: number
          resource_type_id?: string | null
          updated_at?: string
        }
        Update: {
          buffer_after?: number | null
          buffer_before?: number | null
          business_id?: string
          capacity?: number
          capacity_required?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          location?: string | null
          metadata?: Json | null
          name?: string
          price_cents?: number
          resource_type_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_resource_type_id_fkey"
            columns: ["resource_type_id"]
            isOneToOne: false
            referencedRelation: "resource_types"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          business_id: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
        }
        Insert: {
          address?: string | null
          business_id: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          sender_id: string | null
          sender_role: string | null
          ticket_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          sender_id?: string | null
          sender_role?: string | null
          ticket_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          sender_id?: string | null
          sender_role?: string | null
          ticket_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          business_id: string | null
          category: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          resolved_at: string | null
          satisfaction_score: number | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          resolved_at?: string | null
          satisfaction_score?: number | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          resolved_at?: string | null
          satisfaction_score?: number | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist_notifications: {
        Row: {
          business_id: string
          channel: string | null
          id: string
          metadata: Json | null
          responded: boolean | null
          response_action: string | null
          sent_at: string | null
          waitlist_id: string
        }
        Insert: {
          business_id: string
          channel?: string | null
          id?: string
          metadata?: Json | null
          responded?: boolean | null
          response_action?: string | null
          sent_at?: string | null
          waitlist_id: string
        }
        Update: {
          business_id?: string
          channel?: string | null
          id?: string
          metadata?: Json | null
          responded?: boolean | null
          response_action?: string | null
          sent_at?: string | null
          waitlist_id?: string
        }
        Relationships: []
      }
      waitlists: {
        Row: {
          business_id: string
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          metadata: Json | null
          party_size: number | null
          priority: number | null
          requested_date: string | null
          requested_time: string | null
          service_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          metadata?: Json | null
          party_size?: number | null
          priority?: number | null
          requested_date?: string | null
          requested_time?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          metadata?: Json | null
          party_size?: number | null
          priority?: number | null
          requested_date?: string | null
          requested_time?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_best_resource: {
        Args: {
          p_business_id: string
          p_date: string
          p_party_size?: number
          p_service_id: string
          p_start_time: string
        }
        Returns: string
      }
      check_resource_availability: {
        Args: {
          p_date: string
          p_end_time: string
          p_resource_id: string
          p_start_time: string
        }
        Returns: boolean
      }
      flowcore_create_reservation: {
        Args: {
          p_business_id: string
          p_customer_email?: string
          p_customer_id?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_notes?: string
          p_party_size?: number
          p_requested_date: string
          p_requested_time: string
          p_service_id: string
          p_source?: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_owns_business: {
        Args: { _business_id: string }
        Returns: boolean
      }
      is_business_owner: { Args: never; Returns: boolean }
      owns_business: { Args: { _business_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "business_owner" | "end_customer"
      business_vertical:
        | "hospitality"
        | "gastronomia"
        | "travel"
        | "experiencias"
        | "espacios_culturales"
        | "servicios_profesionales"
        | "restaurante"
        | "hotel"
        | "hostel"
        | "retiro"
        | "workshop"
        | "coworking"
        | "coaching"
        | "terapias_alternativas"
        | "gym"
        | "yoga"
        | "pilates"
        | "tour"
        | "clases_particulares"
        | "personal_shopper"
        | "veterinaria"
        | "estetica"
        | "peluqueria"
        | "peluqueria_canina"
        | "spa"
        | "clinica"
      membership_tier: "basico" | "avanzado" | "personalizado"
      reservation_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "business_owner", "end_customer"],
      business_vertical: [
        "hospitality",
        "gastronomia",
        "travel",
        "experiencias",
        "espacios_culturales",
        "servicios_profesionales",
        "restaurante",
        "hotel",
        "hostel",
        "retiro",
        "workshop",
        "coworking",
        "coaching",
        "terapias_alternativas",
        "gym",
        "yoga",
        "pilates",
        "tour",
        "clases_particulares",
        "personal_shopper",
        "veterinaria",
        "estetica",
        "peluqueria",
        "peluqueria_canina",
        "spa",
        "clinica",
      ],
      membership_tier: ["basico", "avanzado", "personalizado"],
      reservation_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ],
    },
  },
} as const
