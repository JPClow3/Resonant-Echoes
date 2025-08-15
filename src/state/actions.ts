import { GeminiResponseData, PlayerNote, MindMapLayout, ActiveModal } from '../types';

export type Action =
  | { type: 'START_GAME' }
  | { type: 'API_CALL_START', payload?: { message?: string } }
  | { type: 'STREAMING_TEXT_UPDATE', payload: string }
  | { type: 'API_CALL_SUCCESS'; payload: GeminiResponseData }
  | { type: 'API_CALL_FAILURE'; payload: string }
  | { type: 'SET_IMAGE_URL'; payload: string }
  | { type: 'IMAGE_GENERATION_START' }
  | { type: 'RESET_GAME' }
  | { type: 'INITIALIZE_GAME_STATE', payload: any } // Using 'any' for localStorage flexibility
  | { type: 'CHOOSE_ARCHETYPE', payload: string }
  | { type: 'CHOOSE_ORIGIN', payload: string }
  | { type: 'CHOOSE_BACKGROUND', payload: string }
  | { type: 'SUBMIT_NAME', payload: string }
  | { type: 'SET_HOME_SCREEN_IMAGE_LOADING', payload: boolean }
  | { type: 'SET_HOME_SCREEN_IMAGE_URL', payload: { url: string | null, error?: string } }
  | { type: 'UPDATE_VOLUME', payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_COLOR_BLIND_ASSIST' }
  | { type: 'SET_ACTIVE_MODAL', payload: ActiveModal }
  | { type: 'ADD_HISTORY_ENTRY', payload: any } // Type HistoryEntry causes circular dependency with reducer file
  | { type: 'SET_LAST_CHOICE', payload: number }
  | { type: 'ADD_PLAYER_REFLECTION', payload: string }
  | { type: 'DISMISS_DREAM_VISION' }
  | { type: 'SUBMIT_LORE_INTERPRETATION', payload: string }
  | { type: 'CANCEL_LORE_INTERPRETATION' }
  | { type: 'CLEAR_INSIGHT_TO_NAME' }
  | { type: 'ADD_PLAYER_NOTE', payload: { title: string, content: string } }
  | { type: 'UPDATE_PLAYER_NOTE', payload: PlayerNote }
  | { type: 'DELETE_PLAYER_NOTE', payload: string }
  | { type: 'UPDATE_MIND_MAP_LAYOUT', payload: MindMapLayout }
  | { type: 'RESONANCE_SURGE_TOGGLE' }
  | { type: 'SET_LANGUAGE', payload: 'en' | 'pt' }
  | { type: 'INTRO_VIDEO_START', payload: { message: string } }
  | { type: 'INTRO_VIDEO_LOADING_UPDATE', payload: { message: string } }
  | { type: 'INTRO_VIDEO_SUCCESS', payload: { url: string } }
  | { type: 'INTRO_VIDEO_FAILURE', payload: { error: string } }
  | { type: 'SUMMARIZE_HISTORY_SUCCESS', payload: string };
