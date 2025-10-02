import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      poker_tables: {
        Row: {
          id: string
          name: string
          game_type: 'holdem' | 'omaha4' | 'omaha6'
          stakes_small: number
          stakes_big: number
          max_players: number
          current_players: number
          status: 'waiting' | 'playing' | 'finished'
          pot: number
          community_cards: string[]
          current_turn: number
          dealer_position: number
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          game_type: 'holdem' | 'omaha4' | 'omaha6'
          stakes_small: number
          stakes_big: number
          max_players: number
          current_players?: number
          status?: 'waiting' | 'playing' | 'finished'
          pot?: number
          community_cards?: string[]
          current_turn?: number
          dealer_position?: number
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          game_type?: 'holdem' | 'omaha4' | 'omaha6'
          stakes_small?: number
          stakes_big?: number
          max_players?: number
          current_players?: number
          status?: 'waiting' | 'playing' | 'finished'
          pot?: number
          community_cards?: string[]
          current_turn?: number
          dealer_position?: number
          updated_at?: string
        }
      }
      table_players: {
        Row: {
          id: string
          table_id: string
          user_id: string
          username: string
          chips: number
          position: number
          cards: string[]
          status: 'waiting' | 'playing' | 'folded' | 'all_in'
          current_bet: number
          total_bet: number
          joined_at: string
        }
        Insert: {
          table_id: string
          user_id: string
          username: string
          chips: number
          position: number
          cards?: string[]
          status?: 'waiting' | 'playing' | 'folded' | 'all_in'
          current_bet?: number
          total_bet?: number
        }
        Update: {
          chips?: number
          cards?: string[]
          status?: 'waiting' | 'playing' | 'folded' | 'all_in'
          current_bet?: number
          total_bet?: number
        }
      }
      game_actions: {
        Row: {
          id: string
          table_id: string
          user_id: string
          action_type: 'fold' | 'check' | 'call' | 'raise' | 'all_in'
          amount: number
          created_at: string
        }
        Insert: {
          table_id: string
          user_id: string
          action_type: 'fold' | 'check' | 'call' | 'raise' | 'all_in'
          amount?: number
        }
      }
    }
  }
}