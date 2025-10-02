import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type PokerTable = Database['public']['Tables']['poker_tables']['Row']
type TablePlayer = Database['public']['Tables']['table_players']['Row']

export function usePokerTables() {
  const [tables, setTables] = useState<PokerTable[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTables()
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('poker_tables')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'poker_tables' },
        (payload) => {
          console.log('Table update:', payload)
          fetchTables()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchTables = async () => {
    try {
      const { data, error } = await supabase
        .from('poker_tables')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTables(data || [])
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTable = async (tableData: Database['public']['Tables']['poker_tables']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('poker_tables')
        .insert(tableData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating table:', error)
      throw error
    }
  }

  const joinTable = async (tableId: string, userId: string, username: string) => {
    try {
      // First, get available position
      const { data: existingPlayers } = await supabase
        .from('table_players')
        .select('position')
        .eq('table_id', tableId)

      const occupiedPositions = existingPlayers?.map(p => p.position) || []
      const maxPositions = 9 // Support up to 9 players
      const availablePosition = Array.from({ length: maxPositions }, (_, i) => i)
        .find(pos => !occupiedPositions.includes(pos))

      if (availablePosition === undefined) {
        throw new Error('Ширээ дүүрсэн байна')
      }

      // Add player to table
      const { error: playerError } = await supabase
        .from('table_players')
        .insert({
          table_id: tableId,
          user_id: userId,
          username,
          chips: 1000,
          position: availablePosition
        })

      if (playerError) throw playerError

      // Player count is automatically updated by database trigger

      return availablePosition
    } catch (error) {
      console.error('Error joining table:', error)
      throw error
    }
  }

  const leaveTable = async (tableId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('table_players')
        .delete()
        .eq('table_id', tableId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error leaving table:', error)
      throw error
    }
  }
  return { tables, loading, createTable, joinTable, leaveTable, refetch: fetchTables }
}

export function useTablePlayers(tableId: string | null) {
  const [players, setPlayers] = useState<TablePlayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tableId) return

    fetchPlayers()

    // Subscribe to real-time player updates
    const subscription = supabase
      .channel(`table_players_${tableId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'table_players', filter: `table_id=eq.${tableId}` },
        (payload) => {
          console.log('Player update:', payload)
          fetchPlayers()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [tableId])

  const fetchPlayers = async () => {
    if (!tableId) return

    try {
      const { data, error } = await supabase
        .from('table_players')
        .select('*')
        .eq('table_id', tableId)
        .order('position')

      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Error fetching players:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePlayerAction = async (userId: string, action: string, amount: number = 0) => {
    if (!tableId) return

    try {
      // Record the action
      const { error: actionError } = await supabase
        .from('game_actions')
        .insert({
          table_id: tableId,
          user_id: userId,
          action_type: action as any,
          amount
        })

      if (actionError) throw actionError

      // Update player status if needed
      if (action === 'fold') {
        const { error: playerError } = await supabase
          .from('table_players')
          .update({ status: 'folded' })
          .eq('table_id', tableId)
          .eq('user_id', userId)

        if (playerError) throw playerError
      }
    } catch (error) {
      console.error('Error updating player action:', error)
      throw error
    }
  }

  return { players, loading, updatePlayerAction, refetch: fetchPlayers }
}