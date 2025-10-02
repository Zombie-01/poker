import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  balance: number;
  avatar: string;
  level: number;
  isAdmin: boolean;
}

interface GameState {
  tableId: string | null;
  players: any[];
  pot: number;
  currentTurn: number;
  gamePhase: 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
}

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  gameState: GameState;
  notifications: any[];
  settings: {
    sound: boolean;
    vibration: boolean;
    autoHide: boolean;
    streamMode: boolean;
    language: 'en' | 'mn';
  };
  stats: {
    activePlayers: number;
    activeTables: number;
    totalPot: number;
  };
}

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_BALANCE'; payload: number }
  | { type: 'JOIN_TABLE'; payload: string }
  | { type: 'LEAVE_TABLE' }
  | { type: 'UPDATE_GAME_STATE'; payload: Partial<GameState> }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'UPDATE_STATS'; payload: Partial<AppState['stats']> };

const initialState: AppState = {
  user: null,
  isLoggedIn: false,
  gameState: {
    tableId: null,
    players: [],
    pot: 0,
    currentTurn: 0,
    gamePhase: 'waiting',
  },
  notifications: [],
  settings: {
    sound: true,
    vibration: true,
    autoHide: false,
    streamMode: false,
    language: 'en',
  },
  stats: {
    activePlayers: 1247,
    activeTables: 89,
    totalPot: 45230,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    case 'UPDATE_BALANCE':
      return state.user ? {
        ...state,
        user: { ...state.user, balance: action.payload }
      } : state;
    case 'JOIN_TABLE':
      return {
        ...state,
        gameState: { ...state.gameState, tableId: action.payload }
      };
    case 'LEAVE_TABLE':
      return {
        ...state,
        gameState: { ...initialState.gameState }
      };
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        gameState: { ...state.gameState, ...action.payload }
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}