
import React, { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

import {
  WhisperingEchoDetail, LoreEntryData, LoreFragmentData, HistoryEntry,
  GeminiResponseData, GameState, GameContextForAI, GamePhase,
  PlayerInventoryItem, DissonanceEffect, PlayerTemporaryCondition,
  ArchetypeProfile, OriginProfile, BackgroundProfile, CharacterProfile, PlayerNote,
  EchoHotspot
} from './types';

import {
  GEMINI_NARRATIVE_MODEL, IMAGEN_IMAGE_MODEL, PLACEHOLDER_IMAGE_URL,
  PLACEHOLDER_HOME_SCREEN_IMAGE_URL, CORE_SYSTEM_INSTRUCTION,
  CONTINUE_GAME_PROMPT_TEMPLATE, SYNTHESIZE_ECHOES_PROMPT_TEMPLATE,
  SYNTHESIZE_LORE_FRAGMENTS_PROMPT_TEMPLATE, ATTUNE_TO_ARTIFACT_PROMPT_TEMPLATE,
  REQUEST_PLAYER_REFLECTION_PROMPT_TEMPLATE, API_KEY_ERROR_MESSAGE_KEY,
  GENERIC_API_ERROR_MESSAGE_KEY,
  HOME_SCREEN_IMAGE_PROMPT,
  ARCHETYPES_DATA, ORIGINS_DATA, BACKGROUNDS_DATA,
  CHARACTER_CREATION_INTRO_PROMPT, ARCHETYPE_SELECTED_PROMPT_TEMPLATE,
  ORIGIN_SELECTED_PROMPT_TEMPLATE, BACKGROUND_SELECTED_PROMPT_TEMPLATE,
  NAME_SUBMITTED_PROMPT_TEMPLATE, INITIAL_GAME_PROMPT, FOCUS_SENSES_PROMPT_TEMPLATE,
  RESONANCE_SURGE_PROMPT_TEMPLATE
} from './constants';

import LoadingIndicator from './components/LoadingIndicator';
import InteractiveText from './components/InteractiveText';
import StoryDisplay from './components/StoryDisplay';
import ImageDisplay from './components/ImageDisplay';
import ChoicesDisplay from './components/ChoicesDisplay';
import RenownDisplay from './components/RenownDisplay';
import WhisperingEchoesDisplay from './components/WhisperingEchoesDisplay';
import LoreJournal from './components/LoreJournal';
import HistoryLog from './components/HistoryLog';
import RestartButton from './components/RestartButton';
import GameStatusDisplay from './components/GameStatusDisplay';
import HomeScreen from './components/HomeScreen';
import SettingsPanel from './components/SettingsPanel';
import DreamRumorDisplay from './components/DreamRumorDisplay';
import LoreInterpretationModal from './components/LoreInterpretationModal';
import PlayerNotesModal from './components/PlayerNotesModal';
import IntroVideoPlayer from './components/IntroVideoPlayer'; // Import the new component

const soundService = {
    playMusic: (key: string, options?: { volume?: number, loop?: boolean }) => console.log(`Playing music ${key}`, options),
    playSound: (key: string, options?: { volume?: number }) => console.log(`Playing sound ${key}`, options),
    stopMusic: (key: string) => console.log(`Stopping music ${key}`),
    setMasterVolume: (volume: number) => console.log(`Master volume set to ${volume}`),
    toggleMute: (mute?: boolean) => console.log(`Mute toggled to ${mute}`),
};

// Translation Data Store
const translations = {
  // General
  "Resonant Echoes": { en: "Resonant Echoes", pt: "Ecos Ressonantes" },
  "Settings": { en: "Settings", pt: "Opções" },
  "Cancel": { en: "Cancel", pt: "Cancelar" },
  "Skip Intro": { en: "Skip Intro", pt: "Pular Introdução" },


  // HomeScreen
  "Enter the world of Resonant Echoes, where history breathes and your choices shape reality.": { en: "Enter the world of Resonant Echoes, where history breathes and your choices shape reality.", pt: "Entre no mundo de Ecos Ressonantes, onde a história respira e suas escolhas moldam a realidade." },
  "New Chronicle": { en: "New Chronicle", pt: "Nova Crônica" },
  "Whispers of the Weave (Settings)": { en: "Whispers of the Weave (Settings)", pt: "Sussurros da Trama (Opções)" },
  "A tale woven by Gemini & React.": { en: "A tale woven by Gemini & React.", pt: "Um conto tecido por Gemini & React." },

  // App.tsx specific UI elements in StoryDisplayContainer
  "The Journey of {name}, the {archetype}": { en: "The Journey of {name}, the {archetype}", pt: "A Jornada de {name}, o/a {archetype}" },
  "Dissonance Active:": { en: "Dissonance Active:", pt: "Dissonância Ativa:" },
  "Conditions:": { en: "Conditions:", pt: "Condições:" },
  "The Unfolding Path": { en: "The Unfolding Path", pt: "O Caminho Que Se Desdobra" },
  "Synthesize ({count})": { en: "Synthesize ({count})", pt: "Sintetizar ({count})" },
  "Focus Senses": { en: "Focus Senses", pt: "Focar Sentidos" },
  "Resonance Surge": { en: "Resonance Surge", pt: "Surto de Ressonância" },
  "Surge (CD: {cooldown})": { en: "Surge (CD: {cooldown})", pt: "Surto (TR: {cooldown})" },
  "Ponder Moment": { en: "Ponder Moment", pt: "Ponderar Momento" },
  "Pondering...": { en: "Pondering...", pt: "Ponderando..." },
  "Tome ({count})": { en: "Tome ({count})", pt: "Tomo ({count})" },
  "Path Taken ({count})": { en: "Path Taken ({count})", pt: "Caminho Percorrido ({count})" },
  "My Journal ({count})": { en: "My Journal ({count})", pt: "Meu Diário ({count})" },

  // App.tsx - ErrorDisplay
  "A Dissonant Chord!": { en: "A Dissonant Chord!", pt: "Uma Corda Dissonante!" },
  "Return to Safety": { en: "Return to Safety", pt: "Retornar à Segurança" },
  "Restart Chronicle": { en: "Restart Chronicle", pt: "Reiniciar Crônica" },

  // App.tsx - NameInsightForm
  "Name Your Understanding": { en: "Name Your Understanding", pt: "Nomeie Seu Entendimento" },
  "Give it a name (3-50 chars):": { en: "Give it a name (3-50 chars):", pt: "Dê um nome (3-50 caracteres):" },
  "Solidify": { en: "Solidify", pt: "Solidificar" },
  "Solidifying...": { en: "Solidifying...", pt: "Solidificando..." },

  // App.tsx - NameInput for Character Creation
  "Enter Your Name:": { en: "Enter Your Name:", pt: "Insira Seu Nome:" },
  "Claim Your Name": { en: "Claim Your Name", pt: "Reivindicar Seu Nome" },

  // App.tsx - Footer
  "Resonant Echoes. Created with Gemini & React.": { en: "Resonant Echoes. Created with Gemini & React.", pt: "Ecos Ressonantes. Criado com Gemini & React." },
  "Fonts: MedievalSharp & EB Garamond by Google Fonts.": { en: "Fonts: MedievalSharp & EB Garamond by Google Fonts.", pt: "Fontes: MedievalSharp & EB Garamond por Google Fonts." },

  // SettingsPanel
  "Whispers of the Weave": { en: "Whispers of the Weave", pt: "Sussurros da Trama" },
  "Language / Idioma": { en: "Language / Idioma", pt: "Idioma / Language" },
  "Changing language will restart the current chronicle.": { en: "Changing language will restart the current chronicle.", pt: "Mudar o idioma reiniciará a crônica atual." },
  "English": { en: "English", pt: "Inglês" },
  "Português": { en: "Português", pt: "Português" },
  "Appearance": { en: "Appearance", pt: "Aparência" },
  "Current Theme: Ancient Parchment": { en: "Current Theme: Ancient Parchment", pt: "Tema Atual: Pergaminho Antigo" },
  "Current Theme: Moonlit Archives": { en: "Current Theme: Moonlit Archives", pt: "Tema Atual: Arquivos Enluarados" },
  "Switch to {theme} mode": { en: "Switch to {theme} mode", pt: "Mudar para modo {theme}" },
  "dark": { en: "dark", pt: "escuro" },
  "light": { en: "light", pt: "claro" },
  "Color-Blind Assist: Enabled": { en: "Color-Blind Assist: Enabled", pt: "Assistência para Daltonismo: Ativado" },
  "Color-Blind Assist: Disabled": { en: "Color-Blind Assist: Disabled", pt: "Assistência para Daltonismo: Desativado" },
  "Enhances contrast & visual cues.": { en: "Enhances contrast & visual cues.", pt: "Melhora contraste e pistas visuais." },
  "Toggle Color-Blind Assist Mode {status}": { en: "Toggle Color-Blind Assist Mode {status}", pt: "Alternar Modo de Assistência para Daltonismo {status}" },
  "off": { en: "off", pt: "desligado" },
  "on": { en: "on", pt: "ligado" },
  "Echoes of Sound": { en: "Echoes of Sound", pt: "Ecos do Som" },
  "Master Volume: {volume}%": { en: "Master Volume: {volume}%", pt: "Volume Principal: {volume}%" },
  "Master volume": { en: "Master volume", pt: "Volume principal" },
  "Unmute All Sounds": { en: "Unmute All Sounds", pt: "Reativar Todos os Sons" },
  "Mute All Sounds": { en: "Mute All Sounds", pt: "Silenciar Todos os Sons" },
  "Return to Weaving": { en: "Return to Weaving", pt: "Retornar à Trama" },

  // LoreJournal
  "Tome of Echoes & Lore": { en: "Tome of Echoes & Lore", pt: "Tomo de Ecos e Sabedoria" },
  "Close Tome": { en: "Close Tome", pt: "Fechar Tomo" },
  "Compiled Knowledge": { en: "Compiled Knowledge", pt: "Conhecimento Compilado" },
  "The pages of compiled knowledge are yet blank.": { en: "The pages of compiled knowledge are yet blank.", pt: "As páginas de conhecimento compilado ainda estão em branco." },
  "Scattered Fragments": { en: "Scattered Fragments", pt: "Fragmentos Dispersos" },
  "Synthesize Selected Fragments ({count})": { en: "Synthesize Selected Fragments ({count})", pt: "Sintetizar Fragmentos Selecionados ({count})" },
  "Select 2 or more related fragments to attempt synthesis.": { en: "Select 2 or more related fragments to attempt synthesis.", pt: "Selecione 2 ou mais fragmentos relacionados para tentar a síntese." },
  "No fragments of forgotten lore discovered yet.": { en: "No fragments of forgotten lore discovered yet.", pt: "Nenhum fragmento de sabedoria esquecida descoberto ainda." },
  "(Synthesized)": { en: "(Synthesized)", pt: "(Sintetizado)" },
  "(Originally understood as: \"{title}\")": { en: "(Originally understood as: \"{title}\")", pt: "(Originalmente entendido como: \"{title}\")" },
  "Context:": { en: "Context:", pt: "Contexto:" },
  "Method:": { en: "Method:", pt: "Método:" },
  "Trigger:": { en: "Trigger:", pt: "Gatilho:" },
  "Origin:": { en: "Origin:", pt: "Origem:" },
  "Hint:": { en: "Hint:", pt: "Dica:" },
  "Connects to {loreIdHint}": { en: "Connects to {loreIdHint}", pt: "Conecta-se a {loreIdHint}" },

  // HistoryLog
  "The Path Taken": { en: "The Path Taken", pt: "O Caminho Percorrido" },
  "Close Scroll": { en: "Close Scroll", pt: "Fechar Pergaminho" },
  "Your Choice: {choice}": { en: "Your Choice: {choice}", pt: "Sua Escolha: {choice}" },
  "Personal Reflection:": { en: "Personal Reflection:", pt: "Reflexão Pessoal:" },
  "Insight Named": { en: "Insight Named", pt: "Intuição Nomeada" },
  "Lore Synthesized": { en: "Lore Synthesized", pt: "Sabedoria Sintetizada" },
  "Artifact Attuned": { en: "Artifact Attuned", pt: "Artefato Sintonizado" },
  "Echo Weaving Toll": { en: "Echo Weaving Toll", pt: "Preço da Tecelagem de Ecos" },
  "Dissonance Encountered": { en: "Dissonance Encountered", pt: "Dissonância Encontrada" },
  "Character Milestone": { en: "Character Milestone", pt: "Marco do Personagem" },
  "Path Unfolds...": { en: "Path Unfolds...", pt: "O Caminho se Desdobra..." },
  "Full context...": { en: "Full context...", pt: "Contexto completo..." },
  "The scroll of your journey is yet to be written.": { en: "The scroll of your journey is yet to be written.", pt: "O pergaminho de sua jornada ainda está por ser escrito." },

  // PlayerNotesModal
  "My Personal Journal": { en: "My Personal Journal", pt: "Meu Diário Pessoal" },
  "Close Journal": { en: "Close Journal", pt: "Fechar Diário" },
  "Edit Entry": { en: "Edit Entry", pt: "Editar Entrada" },
  "New Entry": { en: "New Entry", pt: "Nova Entrada" },
  "Title (Optional):": { en: "Title (Optional):", pt: "Título (Opcional):" },
  "E.g., 'Theron's Warning', 'Echoes in the Old Mill'": { en: "E.g., 'Theron's Warning', 'Echoes in the Old Mill'", pt: "Ex: 'Aviso de Theron', 'Ecos no Velho Moinho'" },
  "Content:": { en: "Content:", pt: "Conteúdo:" },
  "Record your thoughts, theories, or reminders here...": { en: "Record your thoughts, theories, or reminders here...", pt: "Registre seus pensamentos, teorias ou lembretes aqui..." },
  "Save Changes": { en: "Save Changes", pt: "Salvar Alterações" },
  "Add Note": { en: "Add Note", pt: "Adicionar Anotação" },
  "Cancel Edit": { en: "Cancel Edit", pt: "Cancelar Edição" },
  "Your journal is empty. Time to scribe your thoughts!": { en: "Your journal is empty. Time to scribe your thoughts!", pt: "Seu diário está vazio. Hora de registrar seus pensamentos!" },
  "Edit": { en: "Edit", pt: "Editar" },
  "Delete": { en: "Delete", pt: "Excluir" },
  "Confirm Deletion": { en: "Confirm Deletion", pt: "Confirmar Exclusão" },
  "Are you sure you want to delete this journal entry? This action cannot be undone.": { en: "Are you sure you want to delete this journal entry? This action cannot be undone.", pt: "Tem certeza que deseja excluir esta entrada do diário? Esta ação não pode ser desfeita." },
  "Delete Entry": { en: "Delete Entry", pt: "Excluir Entrada" },
  "Tags (comma-separated):": { en: "Tags (comma-separated):", pt: "Tags (separadas por vírgula):" },
  "E.g., #Theron, #ArchitectMystery, #Heartstone": { en: "E.g., #Theron, #ArchitectMystery, #Heartstone", pt: "Ex: #Theron, #MisterioArquiteto, #PedraCerne" },
  "Linked Lore IDs (comma-separated):": { en: "Linked Lore IDs (comma-separated):", pt: "IDs de Lore Vinculados (separados por vírgula):" },
  "E.g., lore_ancient_ritual, lore_theron_warning_1": { en: "E.g., lore_ancient_ritual, lore_theron_warning_1", pt: "Ex: lore_ritual_antigo, lore_aviso_theron_1" },
  "Tags:": { en: "Tags:", pt: "Tags:" },
  "Linked Lore:": { en: "Linked Lore:", pt: "Lore Vinculado:" },
  "Note content cannot be empty.": { en: "Note content cannot be empty.", pt: "O conteúdo da nota não pode estar vazio." },


  // LoreInterpretationModal
  "Interpret the Ancient Lore": { en: "Interpret the Ancient Lore", pt: "Interprete a Sabedoria Antiga" },
  "The meaning of \"{title}\" is veiled. How do you understand its truth?": { en: "The meaning of \"{title}\" is veiled. How do you understand its truth?", pt: "O significado de \"{title}\" está velado. Como você entende sua verdade?" },
  "Ponder Later": { en: "Ponder Later", pt: "Ponderar Mais Tarde" },
  "This is My Understanding": { en: "This is My Understanding", pt: "Este é o Meu Entendimento" },

  // GameStatusDisplay
  "Inventory:": { en: "Inventory:", pt: "Inventário:" },
  "Attune to Echoes": { en: "Attune to Echoes", pt: "Sintonizar Ecos" },
  "The Weave is calm, your satchel light.": { en: "The Weave is calm, your satchel light.", pt: "A Trama está calma, sua bolsa leve." },

  // WhisperingEchoesDisplay
  "Whispering Echoes": { en: "Whispering Echoes", pt: "Ecos Sussurrantes" },
  "The Weave is quiet for now...": { en: "The Weave is quiet for now...", pt: "A Trama está quieta por enquanto..." },
  "Intensity:": { en: "Intensity:", pt: "Intensidade:" },
  "Type:": { en: "Type:", pt: "Tipo:" },
  "Emotion:": { en: "Emotion:", pt: "Emoção:" },
  "Sensation:": { en: "Sensation:", pt: "Sensação:" },
  "Duration:": { en: "Duration:", pt: "Duração:" },
  "Clarity:": { en: "Clarity:", pt: "Clareza:" },

  // DreamRumorDisplay
  "A Fleeting Vision...": { en: "A Fleeting Vision...", pt: "Uma Visão Fugaz..." },
  "Dismiss": { en: "Dismiss", pt: "Dispensar" },
  "Whispers in the Weave:": { en: "Whispers in the Weave:", pt: "Sussurros na Trama:" },

  // ImageDisplay
  "Awaiting a vision...": { en: "Awaiting a vision...", pt: "Aguardando uma visão..." },
  "A Vision Coalesces...": { en: "A Vision Coalesces...", pt: "Uma Visão Coalesce..." }, // Used by ImageDisplay and LoadingIndicator

  // LoadingIndicator & App.tsx loading messages
  "The Weave shifts...": { en: "The Weave shifts...", pt: "A Trama se Agita..." },
  "Awaiting Weaver's Permission (API Key)...": { en: "Awaiting Weaver's Permission (API Key)...", pt: "Aguardando Permissão do Tecelão (Chave API)..." },
  "The Atheneum Materializes...": { en: "The Atheneum Materializes...", pt: "O Ateneu se Materializa..." },
  "The Threads of Fate are Weaving...": { en: "The Threads of Fate are Weaving...", pt: "Os Fios do Destino Estão Tecendo..." },
  "The Weave Shimmers...": { en: "The Weave Shimmers...", pt: "A Trama Cintila..." },
  "Solidifying understanding...": { en: "Solidifying understanding...", pt: "Solidificando entendimento..." },
  "Delving into arcane interpretations...": { en: "Delving into arcane interpretations...", pt: "Mergulhando em interpretações arcanas..." },
  "Awakening the echoes...": { en: "Awakening the echoes...", pt: "Despertando os ecos..." },

  // constants.ts messages (will be objects there)
  [GENERIC_API_ERROR_MESSAGE_KEY]: {
    en: "A Dissonant chord struck the Weave! An unexpected error occurred. Try a different path or restart if whispers persist.",
    pt: "Uma corda dissonante atingiu a Trama! Um erro inesperado ocorreu. Tente um caminho diferente ou reinicie se os sussurros persistirem."
  },
  [API_KEY_ERROR_MESSAGE_KEY]: {
    en: "The Aetherium is silent... (Google API Key is missing or invalid. Please configure it to begin your journey.)",
    pt: "O Aetherium está silencioso... (Chave API do Google ausente ou inválida. Configure-a para iniciar sua jornada.)"
  },
};


type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_API_KEY_MISSING'; payload: boolean }
  | { type: 'INITIALIZE_GAME_STATE'; payload: Partial<GameState> }
  | { type: 'START_GAME_FLOW_SUCCESS'; payload: Partial<GameState> }
  | { type: 'UPDATE_CHARACTER_CREATION_STEP'; payload: { scene: string; choices: string[]; imagePrompt: string | null; selectedId?: string; data?: any } }
  | { type: 'SET_PLAYER_NAME'; payload: { name: string, profile: CharacterProfile } }
  | { type: 'PROCESS_AI_RESPONSE'; payload: {responseData: GeminiResponseData, isSurgeEffect?: boolean} }
  | { type: 'CHARACTER_PROFILE_CONFIRMED'; payload: { profile: CharacterProfile, responseData: GeminiResponseData } }
  | { type: 'ADD_HISTORY_ENTRY'; payload: HistoryEntry }
  | { type: 'SET_LAST_CHOSEN_INDEX'; payload: number | null }
  | { type: 'SET_CURRENT_SCENE_AND_CHOICES_EMPTY' }
  | { type: 'SET_INSIGHT_TO_NAME'; payload: string | null }
  | { type: 'SET_AWAITING_LORE_INTERPRETATION'; payload: { loreId: string; title: string; interpretations: string[] } | undefined }
  | { type: 'SET_HOME_SCREEN_IMAGE'; payload: { url: string | null, loading: boolean, attempted?: boolean } }
  | { type: 'TOGGLE_SETTINGS_PANEL' }
  | { type: 'TOGGLE_LORE_JOURNAL' }
  | { type: 'TOGGLE_HISTORY_LOG' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_COLOR_BLIND_ASSIST' }
  | { type: 'SET_CURRENT_IMAGE'; payload: { url: string | null; prompt: string | null } }
  | { type: 'DISMISS_DREAM_OR_VISION' }
  | { type: 'SET_NEWEST_LORE_ID'; payload: string | null }
  // Player Notes Actions
  | { type: 'TOGGLE_PLAYER_NOTES_MODAL' }
  | { type: 'ADD_PLAYER_NOTE'; payload: { title: string; content: string; tags?: string[]; linkedLoreIds?: string[] } }
  | { type: 'UPDATE_PLAYER_NOTE'; payload: PlayerNote }
  | { type: 'DELETE_PLAYER_NOTE'; payload: { id: string } }
  // Resonance Surge Actions
  | { type: 'RESONANCE_SURGE_INITIATED' }
  | { type: 'RESONANCE_SURGE_COMPLETED'; payload: { responseData: GeminiResponseData } }
  | { type: 'DECREMENT_COOLDOWNS' }
  // Language Actions
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'pt' }
  // Echo Hotspot Action
  | { type: 'ADD_INTERACTED_HOTSPOT'; payload: string };


const initialGameState: GameState = {
    currentScene: '', currentImagePrompt: null, currentImageUrl: null, choices: [],
    isLoading: false, error: null, loreJournal: [], loreFragments: [], historyLog: [],
    whisperingEchoes: [], currentSoundscape: '',
    playerEchoicSignature: 'A nascent sensitivity to the Weave.',
    factionReputationNotes: {}, apiKeyMissing: !process.env.API_KEY,
    gameStarted: false, renown: 0, lastRenownNarrative: null,
    firstName: null, selectedArchetypeId: null, selectedOriginId: null, selectedBackgroundId: null, characterProfile: null,
    insightToName: null, homeScreenImageUrl: null, isHomeScreenImageLoading: false,
    homeScreenImageFetchAttempted: false, showSettingsPanel: false, showLoreJournalModal: false,
    newestLoreEntryId: null, showHistoryLogModal: false, currentVolume: 70, isMuted: false,
    isColorBlindAssistActive: false, currentTimeOfDay: undefined, currentWeather: undefined,
    playerInventory: {}, lastChosenChoiceIndex: null, currentRumors: [], dreamOrVisionToDisplay: null,
    awaitingLoreInterpretation: false, loreToInterpret: undefined, activeDissonanceEffect: null,
    playerConditions: [], echoicBlightInScene: null, activeMemoryPhantoms: [], devouringSilenceZoneInScene: null,
    activeEchoHotspots: [], // Initialize activeEchoHotspots
    playerNotes: [], showPlayerNotesModal: false,
    isResonanceSurgeAvailable: true, resonanceSurgeCooldown: 0,
    currentLanguage: 'en',
};

// Helper function for gameReducer
const updatePlayerConditions = (currentConditions: PlayerTemporaryCondition[], isSurgeEffect?: boolean): PlayerTemporaryCondition[] => {
    if (isSurgeEffect) return currentConditions; // Don't decrement if surge just happened

    return currentConditions.map(cond => ({
        ...cond,
        durationTurns: cond.durationTurns ? cond.durationTurns - 1 : undefined,
    })).filter(cond => cond.durationTurns === undefined || cond.durationTurns > 0);
};


const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_API_KEY_MISSING':
      return { ...state, apiKeyMissing: action.payload };
    case 'INITIALIZE_GAME_STATE':
        const defaultInitialState = {
            ...initialGameState,
            apiKeyMissing: !process.env.API_KEY,
            homeScreenImageUrl: state.homeScreenImageUrl,
            currentVolume: state.currentVolume,
            isMuted: state.isMuted,
            isColorBlindAssistActive: state.isColorBlindAssistActive,
            currentLanguage: action.payload.currentLanguage || state.currentLanguage,
            playerNotes: [], // Reset player notes
            activeEchoHotspots: [], // Reset hotspots
        };
      return { ...defaultInitialState, ...action.payload };
    case 'START_GAME_FLOW_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null,
        currentImagePrompt: null,
        currentImageUrl: null,
        activeEchoHotspots: [],
      };
    case 'UPDATE_CHARACTER_CREATION_STEP':
      return {
        ...state,
        isLoading: false,
        currentScene: action.payload.scene,
        choices: action.payload.choices,
        currentImagePrompt: action.payload.imagePrompt,
        selectedArchetypeId: action.payload.data?.selectedArchetypeId ?? state.selectedArchetypeId,
        selectedOriginId: action.payload.data?.selectedOriginId ?? state.selectedOriginId,
        selectedBackgroundId: action.payload.data?.selectedBackgroundId ?? state.selectedBackgroundId,
      };
    case 'SET_PLAYER_NAME':
      return {
        ...state,
        firstName: action.payload.name,
        characterProfile: action.payload.profile,
      };
    case 'CHARACTER_PROFILE_CONFIRMED':
      const { profile: confirmedProfile, responseData: R1 } = action.payload;
      return {
        ...state,
        characterProfile: confirmedProfile,
        playerEchoicSignature: R1.initialPlayerEchoicSignature || "A unique resonance within the Weave.",
        currentScene: R1.scene,
        choices: R1.choices,
        currentImagePrompt: R1.imagePrompt || null,
        whisperingEchoes: R1.whisperingEchoes || [],
        loreJournal: [...(state.loreJournal || []), ...(R1.newLore || [])],
        newestLoreEntryId: R1.newLore && R1.newLore.length > 0 ? R1.newLore[R1.newLore.length - 1].id : null,
        playerInventory: { ...(state.playerInventory || {}), ...(R1.newItemsGranted || {}) },
        lastRenownNarrative: R1.renownChangeNarrative || null,
        currentSoundscape: R1.soundscape || state.currentSoundscape,
        isLoading: false,
        gameStarted: true,
        currentTimeOfDay: R1.currentTimeOfDay || "Dawn",
        currentWeather: R1.currentWeather || "Clear",
        activeEchoHotspots: R1.activeEchoHotspots || [],
      };
    case 'PROCESS_AI_RESPONSE':
      const { responseData: R, isSurgeEffect } = action.payload;
      let newWhisperingEchoes = state.whisperingEchoes;
      if (R.clearActiveEchoesOnSuccess) { newWhisperingEchoes = []; soundService.playSound('ECHOES_CLEARED'); }
      if (R.whisperingEchoes && R.whisperingEchoes.length > 0) {
        const combinedEchoes = [...newWhisperingEchoes, ...R.whisperingEchoes];
        newWhisperingEchoes = combinedEchoes.filter((echo, index, self) => index === self.findIndex(e => e.id === echo.id)).slice(-5);
        if (R.whisperingEchoes.length > 0) soundService.playSound('NEW_ECHO_PERCEIVED');
      }

      let updatedInventory = { ...state.playerInventory };
      if (R.newItemsGranted) {
        for (const [itemName, itemData] of Object.entries(R.newItemsGranted)) {
          const existingItem = updatedInventory[itemName] || { count: 0, knownArtifactEchoes: [], artifactEchoes: [] };
          updatedInventory[itemName] = {
            ...existingItem,
            count: existingItem.count + itemData.count,
            description: itemData.description || existingItem.description,
            artifactEchoes: [...(existingItem.artifactEchoes || []), ...(itemData.artifactEchoes || [])].filter((echo, index, self) => index === self.findIndex(e => e.id === echo.id)),
            knownArtifactEchoes: [...(existingItem.knownArtifactEchoes || []), ...(itemData.knownArtifactEchoes || [])].filter((echo, index, self) => index === self.findIndex(e => e.id === echo.id)),
            isEchoicHeirloom: itemData.isEchoicHeirloom || existingItem.isEchoicHeirloom,
            heirloomLoreId: itemData.heirloomLoreId || existingItem.heirloomLoreId,
          };
          soundService.playSound('ITEM_GRANTED');
        }
      }

      let currentConditions = state.playerConditions;
      if (R.playerConditionUpdate) {
        currentConditions = [...currentConditions.filter(c => c.type !== R.playerConditionUpdate!.type), R.playerConditionUpdate];
        soundService.playSound('PLAYER_CONDITION_UPDATE');
      }
      currentConditions = updatePlayerConditions(currentConditions, isSurgeEffect);


      let newCooldown = state.resonanceSurgeCooldown;
      let surgeAvailable = state.isResonanceSurgeAvailable;

      if (!isSurgeEffect && state.resonanceSurgeCooldown > 0) {
        newCooldown = state.resonanceSurgeCooldown - 1;
      }
      if (newCooldown <= 0) {
        newCooldown = 0;
        if (!state.isResonanceSurgeAvailable) {
             surgeAvailable = true;
             soundService.playSound('SURGE_READY');
        }
      }

      return {
        ...state,
        isLoading: false,
        currentScene: R.scene,
        choices: R.choices,
        currentImagePrompt: R.imagePrompt !== undefined ? R.imagePrompt : state.currentImagePrompt,
        whisperingEchoes: newWhisperingEchoes,
        currentSoundscape: R.soundscape || state.currentSoundscape,
        playerEchoicSignature: R.playerEchoicSignatureUpdate || state.playerEchoicSignature,
        factionReputationNotes: R.factionUpdates ? { ...state.factionReputationNotes, ...R.factionUpdates } : state.factionReputationNotes,
        renown: R.renownChangeAmount !== null && R.renownChangeAmount !== undefined ? state.renown + R.renownChangeAmount : state.renown,
        lastRenownNarrative: R.renownChangeNarrative !== null && R.renownChangeNarrative !== undefined ? R.renownChangeNarrative : state.lastRenownNarrative,
        loreJournal: R.newLore ? [...state.loreJournal, ...R.newLore] : state.loreJournal,
        newestLoreEntryId: R.newLore && R.newLore.length > 0 ? R.newLore[R.newLore.length -1].id : state.newestLoreEntryId,
        loreFragments: R.loreFragments ? [...state.loreFragments, ...R.loreFragments] : state.loreFragments,
        currentTimeOfDay: R.currentTimeOfDay || state.currentTimeOfDay,
        currentWeather: R.currentWeather || state.currentWeather,
        playerInventory: updatedInventory,
        dreamOrVisionToDisplay: R.playerDreamOrVision || null,
        currentRumors: R.rumorMillUpdate ? [...state.currentRumors, R.rumorMillUpdate].slice(-5) : state.currentRumors,
        activeDissonanceEffect: R.dissonanceEffectInScene !== undefined ? R.dissonanceEffectInScene : state.activeDissonanceEffect,
        playerConditions: currentConditions,
        activeEchoHotspots: R.activeEchoHotspots || [], // Update active hotspots
        insightToName: R.namedInsightContext ? R.namedInsightContext : null,
        awaitingLoreInterpretation: !!R.interpretiveChoicesForLore,
        loreToInterpret: R.interpretiveChoicesForLore || undefined,
        isResonanceSurgeAvailable: isSurgeEffect ? false : surgeAvailable,
        resonanceSurgeCooldown: isSurgeEffect ? (R.suggestedResonanceSurgeCooldown || 5) : newCooldown,
      };
    case 'ADD_HISTORY_ENTRY':
      // Check if this history entry corresponds to a hotspot interaction
      let newPreviouslyInteracted = state.historyLog.filter(h => h.type === 'hotspot_interaction').map(h => h.choiceMade?.split(':')[0].trim() || ''); // Rebuild or add based on type
      if (action.payload.type === 'hotspot_interaction' && action.payload.choiceMade) {
        const hotspotId = action.payload.choiceMade.split(':')[0].trim(); // Assuming choiceMade is "hotspotId: Actual choice text"
        if (hotspotId && !newPreviouslyInteracted.includes(hotspotId)) {
          newPreviouslyInteracted = [...newPreviouslyInteracted, hotspotId];
        }
      }
      return { ...state, historyLog: [...state.historyLog, action.payload] };
    case 'ADD_INTERACTED_HOTSPOT': // Deprecated this direct action, handled via ADD_HISTORY_ENTRY with type 'hotspot_interaction'
        return state; // No direct change, ID tracking managed via history entry
    case 'SET_LAST_CHOSEN_INDEX':
      return { ...state, lastChosenChoiceIndex: action.payload };
    case 'SET_CURRENT_SCENE_AND_CHOICES_EMPTY':
      return { ...state, currentScene: '', choices: [] };
    case 'SET_INSIGHT_TO_NAME':
      return { ...state, insightToName: action.payload };
    case 'SET_AWAITING_LORE_INTERPRETATION':
      return { ...state, awaitingLoreInterpretation: !!action.payload, loreToInterpret: action.payload };
    case 'SET_HOME_SCREEN_IMAGE':
      return { ...state, homeScreenImageUrl: action.payload.url, isHomeScreenImageLoading: action.payload.loading, homeScreenImageFetchAttempted: action.payload.attempted ?? state.homeScreenImageFetchAttempted };
    case 'TOGGLE_SETTINGS_PANEL':
      return { ...state, showSettingsPanel: !state.showSettingsPanel };
    case 'TOGGLE_LORE_JOURNAL':
      return { ...state, showLoreJournalModal: !state.showLoreJournalModal };
    case 'TOGGLE_HISTORY_LOG':
      return { ...state, showHistoryLogModal: !state.showHistoryLogModal };
    case 'SET_VOLUME':
      return { ...state, currentVolume: action.payload, isMuted: action.payload === 0 ? true : state.isMuted };
    case 'TOGGLE_MUTE':
      const newMutedState = !state.isMuted;
      return { ...state, isMuted: newMutedState, currentVolume: newMutedState ? state.currentVolume : (state.currentVolume === 0 ? 70 : state.currentVolume) };
    case 'TOGGLE_COLOR_BLIND_ASSIST':
      return { ...state, isColorBlindAssistActive: !state.isColorBlindAssistActive };
    case 'SET_CURRENT_IMAGE':
      return { ...state, currentImageUrl: action.payload.url, currentImagePrompt: action.payload.prompt };
    case 'DISMISS_DREAM_OR_VISION':
      return { ...state, dreamOrVisionToDisplay: null };
    case 'SET_NEWEST_LORE_ID':
      return { ...state, newestLoreEntryId: action.payload };
    case 'TOGGLE_PLAYER_NOTES_MODAL':
      return { ...state, showPlayerNotesModal: !state.showPlayerNotesModal };
    case 'ADD_PLAYER_NOTE':
      const newNote: PlayerNote = {
        id: `note_${Date.now()}`,
        title: action.payload.title,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        tags: action.payload.tags || [],
        linkedLoreIds: action.payload.linkedLoreIds || [],
      };
      return { ...state, playerNotes: [newNote, ...state.playerNotes] };
    case 'UPDATE_PLAYER_NOTE':
      return {
        ...state,
        playerNotes: state.playerNotes.map(note =>
          note.id === action.payload.id ? { ...action.payload, timestamp: new Date().toISOString() } : note
        ),
      };
    case 'DELETE_PLAYER_NOTE':
      return {
        ...state,
        playerNotes: state.playerNotes.filter(note => note.id !== action.payload.id),
      };
    case 'RESONANCE_SURGE_INITIATED':
      return { ...state, isLoading: true };
    case 'RESONANCE_SURGE_COMPLETED': // This action itself doesn't change state; PROCESS_AI_RESPONSE does.
      return state;
    case 'DECREMENT_COOLDOWNS': // This was unused, repurposed for Process AI Response
      return state;
    case 'SET_LANGUAGE':
      return {
        ...initialGameState,
        apiKeyMissing: state.apiKeyMissing,
        homeScreenImageUrl: state.homeScreenImageUrl,
        currentVolume: state.currentVolume,
        isMuted: state.isMuted,
        isColorBlindAssistActive: state.isColorBlindAssistActive,
        currentLanguage: action.payload,
        gameStarted: false,
        playerNotes: [], // Reset notes on language change
        activeEchoHotspots: [], // Reset hotspots
      };
    default:
      return state;
  }
};

type FetchGameDataFn = (
  promptContents: string,
  isProfileSetupStage?: boolean,
  isFinalProfileSubmission?: boolean,
  isSurgeEffect?: boolean
) => Promise<void>;


const App: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>(GamePhase.HomeScreen);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [newLoreForGlow, setNewLoreForGlow] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const [showIntroVideo, setShowIntroVideo] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hasPlayedIntro');
    }
    return true;
  });

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const lang = gameState.currentLanguage;
    if (key === GENERIC_API_ERROR_MESSAGE_KEY || key === API_KEY_ERROR_MESSAGE_KEY) {
        const messageSet = translations[key as keyof typeof translations] as unknown as { en: string; pt: string; };
         if (!messageSet) {
            console.warn(`Translation key "${key}" not found in special error handling.`);
            return key;
        }
        let translatedMsg = messageSet[lang] || messageSet['en'] || key;
        return translatedMsg;
    }

    const translationSet = translations[key as keyof typeof translations] as { en: string; pt: string; };
    if (!translationSet) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    let translatedString = translationSet[lang] || translationSet['en'] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translatedString = translatedString.replace(`{${paramKey}}`, String(value));
      });
    }
    return translatedString;
  }, [gameState.currentLanguage]);


  const prevLoreJournalLength = useRef(gameState.loreJournal.length);
  useEffect(() => {
    if (gameState.loreJournal.length > prevLoreJournalLength.current && !gameState.showLoreJournalModal) {
      setNewLoreForGlow(true);
    }
    prevLoreJournalLength.current = gameState.loreJournal.length;
  }, [gameState.loreJournal.length, gameState.showLoreJournalModal]);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', currentTheme === 'dark');
    document.documentElement.classList.toggle('cb-assist-active', gameState.isColorBlindAssistActive);
    document.body.style.backgroundColor = `var(--background-primary)`;
    document.body.style.color = `var(--text-main)`;
  }, [currentTheme, gameState.isColorBlindAssistActive]);

  const toggleTheme = () => setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleColorBlindAssist = () => dispatch({ type: 'TOGGLE_COLOR_BLIND_ASSIST' });
  const handleVolumeChange = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
    soundService.setMasterVolume(volume / 100);
    if (volume > 0 && gameState.isMuted) soundService.toggleMute(false);
    if (volume === 0 && !gameState.isMuted) soundService.toggleMute(true);
  };
  const handleMuteToggle = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
    soundService.toggleMute(!gameState.isMuted);
  };

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "MISSING_KEY_FOR_AI_INIT" });

  const parseAndCleanJSON = (jsonString: string): any => {
    let cleanString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanString.match(fenceRegex);
    if (match && match[2]) {
      cleanString = match[2].trim();
    }
    try {
      return JSON.parse(cleanString);
    } catch (e) {
      console.error("Failed to parse JSON:", cleanString, e);
      const objectMatch = cleanString.match(/\{.*\}/s);
      if (objectMatch) {
        try { return JSON.parse(objectMatch[0]); } catch (e2) { console.error("Failed to parse extracted JSON object:", e2); }
      }
      const arrayMatch = cleanString.match(/\[.*\]/s);
      if (arrayMatch) {
        try { return JSON.parse(arrayMatch[0]); } catch (e3) { console.error("Failed to parse extracted JSON array:", e3); }
      }
      throw new Error(t(GENERIC_API_ERROR_MESSAGE_KEY) + " (JSON parsing failed)");
    }
  };

  const fetchImage = useCallback(async (prompt: string) => {
    if (!prompt) return;
    if (prompt === gameState.currentImagePrompt && gameState.currentImageUrl && !gameState.currentImageUrl.startsWith('https://picsum.photos')) return;

    console.log("Fetching image for prompt:", prompt);
    dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: null, prompt } });

    try {
      const contextualPrompt = `Epic fantasy art, ${prompt}. Style influenced by: ${gameState.currentWeather}, ${gameState.currentTimeOfDay}. Player signature: ${gameState.playerEchoicSignature}. Current scene context: ${gameState.currentScene.substring(0, 100)}. ${gameState.activeDissonanceEffect ? "Dissonance effect: " + gameState.activeDissonanceEffect.description : ""}`;
      const response = await ai.models.generateImages({
        model: IMAGEN_IMAGE_MODEL,
        prompt: contextualPrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });
      soundService.playSound('IMAGE_GENERATED');

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: imageUrl, prompt } });
      } else {
        console.warn("No image generated, using placeholder.");
        dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: PLACEHOLDER_IMAGE_URL, prompt } });
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: PLACEHOLDER_IMAGE_URL, prompt } });
      dispatch({ type: 'SET_ERROR', payload: "Failed to generate scene image." });
    }
  }, [ai.models, gameState.currentImagePrompt, gameState.currentImageUrl, gameState.currentTimeOfDay, gameState.currentWeather, gameState.playerEchoicSignature, gameState.currentScene, gameState.activeDissonanceEffect]);

  const fetchHomeScreenImage = useCallback(async () => {
    if (gameState.homeScreenImageUrl || gameState.isHomeScreenImageLoading || gameState.homeScreenImageFetchAttempted) return;
    dispatch({ type: 'SET_HOME_SCREEN_IMAGE', payload: { url: null, loading: true, attempted: true } });
    try {
      const response = await ai.models.generateImages({
        model: IMAGEN_IMAGE_MODEL,
        prompt: HOME_SCREEN_IMAGE_PROMPT,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });
      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        dispatch({ type: 'SET_HOME_SCREEN_IMAGE', payload: { url: imageUrl, loading: false } });
      } else {
        dispatch({ type: 'SET_HOME_SCREEN_IMAGE', payload: { url: PLACEHOLDER_HOME_SCREEN_IMAGE_URL, loading: false } });
      }
    } catch (error) {
      // The 'error' variable might be a string or an object.
      // The UI will show "Failed to load title screen image."
      // This console log is for developer detail.
      console.error(`Detailed error fetching home screen image: ${error}. Fallback: Using placeholder image. UI Message: "Failed to load title screen image."`);
      dispatch({ type: 'SET_HOME_SCREEN_IMAGE', payload: { url: PLACEHOLDER_HOME_SCREEN_IMAGE_URL, loading: false } });
      dispatch({ type: 'SET_ERROR', payload: "Failed to load title screen image." });
    }
  }, [ai.models, gameState.homeScreenImageUrl, gameState.isHomeScreenImageLoading, gameState.homeScreenImageFetchAttempted]);

  const buildGameContextForAI = useCallback((): GameContextForAI => {
    const playerInventoryForAI: GameContextForAI['playerInventory'] = {};
    if (gameState.playerInventory) {
      for (const [key, value] of Object.entries(gameState.playerInventory)) {
        const allItemEchoes = value.artifactEchoes || [];
        const knownItemEchoes = value.knownArtifactEchoes || [];
        const untappedEchoes = allItemEchoes.filter(ae => !knownItemEchoes.some(ke => ke.id === ae.id));

        playerInventoryForAI[key] = {
          count: value.count,
          description: value.description,
          isEchoicHeirloom: value.isEchoicHeirloom,
          heirloomLoreId: value.heirloomLoreId,
          hasUndiscoveredEchoes: untappedEchoes.length > 0,
          knownArtifactEchoesSummary: knownItemEchoes.map(e => e.text.substring(0, 50) + "..."),
          untappedArtifactEchoesCount: untappedEchoes.length,
        };
      }
    }
    
    const previouslyInteractedHotspotIds = Array.from(new Set(
        gameState.historyLog
          .filter(h => h.type === 'hotspot_interaction' && h.choiceMade)
          .map(h => h.choiceMade!.split(':')[0].trim()) // Assumes format "hotspotId: Choice Text"
      ));

    return {
      characterProfile: gameState.characterProfile ? {
        archetypeTitle: gameState.characterProfile.archetype.title,
        originName: gameState.characterProfile.origin.name,
        backgroundTitle: gameState.characterProfile.background.title,
        firstName: gameState.characterProfile.firstName,
        startingBenefitDescription: gameState.characterProfile.background.benefit.description,
      } : null,
      lastPlayerChoice: gameState.historyLog.length > 0 ? gameState.historyLog[gameState.historyLog.length - 1].choiceMade : undefined,
      recentHistorySummary: gameState.historyLog.slice(-3).map(h => `${h.sceneSummary.substring(0, 50)}... -> ${h.choiceMade || h.type}`).join(' | '),
      knownLoreTitles: gameState.loreJournal.map(l => l.title),
      knownLoreFragmentTitles: gameState.loreFragments.map(f => f.titleHint),
      activeEchoesTexts: gameState.whisperingEchoes.map(e => e.text),
      playerEchoicSignature: gameState.playerEchoicSignature,
      factionReputationNotes: gameState.factionReputationNotes,
      currentRenown: gameState.renown,
      currentTimeOfDay: gameState.currentTimeOfDay,
      currentWeather: gameState.currentWeather,
      playerInventory: playerInventoryForAI,
      currentRumors: gameState.currentRumors,
      currentActiveDissonanceEffect: gameState.activeDissonanceEffect?.description || null,
      currentPlayerConditions: gameState.playerConditions.map(c => c.description),
      activeEchoHotspotsSummary: gameState.activeEchoHotspots?.map(h => ({ id: h.id, name: h.name })),
      previouslyInteractedHotspotIds: previouslyInteractedHotspotIds,
      isResonanceSurgeAvailable: gameState.isResonanceSurgeAvailable,
      resonanceSurgeCooldownTurnsLeft: gameState.resonanceSurgeCooldown,
      language: gameState.currentLanguage,
    };
  }, [
    gameState.characterProfile, gameState.historyLog, gameState.loreJournal, gameState.loreFragments,
    gameState.whisperingEchoes, gameState.playerEchoicSignature, gameState.factionReputationNotes,
    gameState.renown, gameState.currentTimeOfDay, gameState.currentWeather, gameState.playerInventory,
    gameState.currentRumors, gameState.activeDissonanceEffect, gameState.playerConditions,
    gameState.activeEchoHotspots, gameState.isResonanceSurgeAvailable, gameState.resonanceSurgeCooldown, gameState.currentLanguage
  ]);

  const fetchGameData: FetchGameDataFn = useCallback(async (
    promptContents: string,
    isProfileSetupStage: boolean = false,
    isFinalProfileSubmission: boolean = false,
    isSurgeEffect: boolean = false
  ) => {
    if (!isSurgeEffect) dispatch({ type: 'SET_LOADING', payload: true });
    else dispatch({ type: 'RESONANCE_SURGE_INITIATED' });

    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LAST_CHOSEN_INDEX', payload: null });
    dispatch({ type: 'DISMISS_DREAM_OR_VISION' });

    if (isFinalProfileSubmission) soundService.playMusic('GAME_AMBIENCE_AETHELGARD', { volume: gameState.currentVolume / 100 * 0.5, loop: true });

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_NARRATIVE_MODEL,
        contents: promptContents,
        config: { systemInstruction: CORE_SYSTEM_INSTRUCTION, responseMimeType: "application/json" }
      });
      const responseData = parseAndCleanJSON(response.text) as GeminiResponseData;
      soundService.playSound('AI_RESPONSE_RECEIVED');
      if (isSurgeEffect) soundService.playSound('SURGE_EFFECT_APPLIED');


      const newImagePromptFromAI = responseData.imagePrompt;

      if (isProfileSetupStage) {
        dispatch({
          type: 'UPDATE_CHARACTER_CREATION_STEP',
          payload: {
            scene: responseData.scene,
            choices: responseData.choices,
            imagePrompt: newImagePromptFromAI || null,
          }
        });
        if (newImagePromptFromAI) fetchImage(newImagePromptFromAI);
        else if (!gameState.currentImageUrl) dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: PLACEHOLDER_IMAGE_URL, prompt: null } });
        return;
      }

      if (isFinalProfileSubmission) {
        const archetype = ARCHETYPES_DATA.find(a => a.id === gameState.selectedArchetypeId);
        const origin = ORIGINS_DATA.find(o => o.id === gameState.selectedOriginId);
        const background = BACKGROUNDS_DATA.find(b => b.id === gameState.selectedBackgroundId);

        if (!archetype || !origin || !background || !gameState.firstName) {
          throw new Error("Character profile data is incomplete for final submission.");
        }
        const confirmedProfile: CharacterProfile = { archetype, origin, background, firstName: gameState.firstName };
        dispatch({ type: 'CHARACTER_PROFILE_CONFIRMED', payload: { profile: confirmedProfile, responseData } });
        if (newImagePromptFromAI) fetchImage(newImagePromptFromAI);
        else dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: PLACEHOLDER_IMAGE_URL, prompt: null } });
        setCurrentPhase(GamePhase.Playing);
        return;
      }

      dispatch({ type: 'PROCESS_AI_RESPONSE', payload: {responseData, isSurgeEffect} });

      if (newImagePromptFromAI !== undefined) {
         if (newImagePromptFromAI) {
            fetchImage(newImagePromptFromAI);
         } else {
            // Only set placeholder if no image prompt was given AND there's no current image from previous turn.
            // This prevents replacing a good image with a placeholder on minor turns.
            if (!gameState.currentImageUrl) {
              dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: PLACEHOLDER_IMAGE_URL, prompt: null } });
            }
         }
      } else {
        // If imagePrompt is undefined (meaning AI wants to keep current image), but we have no current image, set placeholder.
        if (!gameState.currentImageUrl && currentPhase === GamePhase.Playing) {
             dispatch({ type: 'SET_CURRENT_IMAGE', payload: { url: PLACEHOLDER_IMAGE_URL, prompt: gameState.currentImagePrompt } });
        }
      }

      if (responseData.renownChangeAmount && responseData.renownChangeAmount !== 0) soundService.playSound('RENOWN_CHANGED');
      if (responseData.newLore && responseData.newLore.length > 0) soundService.playSound('LORE_UNLOCKED');
      if (responseData.loreFragments && responseData.loreFragments.length > 0) soundService.playSound('LORE_FRAGMENT_FOUND');
      if (responseData.playerReflection) {
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { id: `reflect_${Date.now()}`, sceneSummary: responseData.playerReflection!, timestamp: new Date().toISOString(), fullSceneText: responseData.playerReflection!, type: 'reflection' } });
        soundService.playSound('PLAYER_REFLECTION_ADDED');
      }

      if (responseData.expectsPlayerInputForName && responseData.offerToNameInsight && responseData.namedInsightContext) {
        setCurrentPhase(GamePhase.AwaitingNameInput);
      } else if (responseData.interpretiveChoicesForLore) {
        setCurrentPhase(GamePhase.AwaitingLoreInterpretation);
      } else {
        setCurrentPhase(GamePhase.Playing);
      }

    } catch (error) {
      console.error("Error in fetchGameData:", error);
      const errorMessage = error instanceof Error ? error.message : t(GENERIC_API_ERROR_MESSAGE_KEY);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      setCurrentPhase(GamePhase.Error);
    }
  }, [ai.models, fetchImage, gameState.currentImagePrompt, gameState.currentImageUrl, gameState.loreJournal, gameState.loreFragments, gameState.renown, gameState.currentSoundscape, gameState.playerEchoicSignature, gameState.factionReputationNotes, gameState.whisperingEchoes, gameState.currentTimeOfDay, gameState.currentWeather, gameState.playerInventory, gameState.historyLog, gameState.currentVolume, gameState.currentRumors, gameState.activeDissonanceEffect, gameState.playerConditions, gameState.selectedArchetypeId, gameState.selectedOriginId, gameState.selectedBackgroundId, gameState.firstName, currentPhase, buildGameContextForAI, t]);


  useEffect(() => {
    // This effect manages the initial phase setting based on API key and intro status.
    if (gameState.apiKeyMissing) {
      if (currentPhase !== GamePhase.Error) {
          setShowIntroVideo(false); // Don't show intro if API key is missing
          setCurrentPhase(GamePhase.Error);
          if (!gameState.error) {
            dispatch({ type: 'SET_ERROR', payload: t(API_KEY_ERROR_MESSAGE_KEY) });
          }
      }
    } else if (showIntroVideo) {
      // If API key is present and intro should be shown, currentPhase remains (or becomes) HomeScreen
      // The IntroVideoPlayer will be rendered.
      // Set currentPhase to HomeScreen so the app structure prepares for it.
      if (currentPhase !== GamePhase.HomeScreen && currentPhase !== GamePhase.Error) {
          setCurrentPhase(GamePhase.HomeScreen);
      }
    } else {
      // API key is fine, intro is done/skipped.
      // Ensure we are in HomeScreen phase if not already in an active game phase.
      if (currentPhase === GamePhase.HomeScreen && !gameState.homeScreenImageFetchAttempted && !gameState.homeScreenImageUrl && !gameState.isHomeScreenImageLoading) {
        fetchHomeScreenImage();
      } else if (currentPhase !== GamePhase.Playing && currentPhase !== GamePhase.ArchetypeSelection && currentPhase !== GamePhase.OriginSelection && currentPhase !== GamePhase.BackgroundSelection && currentPhase !== GamePhase.NameInput && currentPhase !== GamePhase.ConfirmationAndTransition && currentPhase !== GamePhase.AwaitingNameInput && currentPhase !== GamePhase.AwaitingLoreInterpretation && currentPhase !== GamePhase.Error) {
        // If not in any specific game phase and intro is done, default to HomeScreen
        setCurrentPhase(GamePhase.HomeScreen);
      }
    }
  }, [gameState.apiKeyMissing, showIntroVideo, currentPhase, gameState.error, t, fetchHomeScreenImage, gameState.homeScreenImageFetchAttempted, gameState.homeScreenImageUrl, gameState.isHomeScreenImageLoading]);

  const handleIntroFinished = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasPlayedIntro', 'true');
    }
    setShowIntroVideo(false);
    // After intro finishes, we should be going to the HomeScreen.
    // The useEffect above will handle fetching home screen image once currentPhase is HomeScreen.
    setCurrentPhase(GamePhase.HomeScreen);
  };

  const startGameFlow = useCallback(() => {
    if (gameState.apiKeyMissing) {
      dispatch({ type: 'SET_ERROR', payload: t(API_KEY_ERROR_MESSAGE_KEY) });
      setCurrentPhase(GamePhase.Error);
      return;
    }
    soundService.playSound('GAME_START');
    dispatch({
        type: 'INITIALIZE_GAME_STATE',
        payload: {
            currentLanguage: gameState.currentLanguage,
            currentImagePrompt: null,
            currentImageUrl: null,
            characterProfile: null,
            gameStarted: false,
        }
    });
    setCurrentPhase(GamePhase.ArchetypeSelection);
    fetchGameData(CHARACTER_CREATION_INTRO_PROMPT, true);
  }, [fetchGameData, gameState.apiKeyMissing, gameState.currentLanguage, t]);

  const handlePlayerChoice = useCallback((choiceIdOrText: string, index: number) => {
    soundService.playSound('CHOICE_SELECTED');
    dispatch({ type: 'SET_LAST_CHOSEN_INDEX', payload: index });
    dispatch({ type: 'SET_CURRENT_SCENE_AND_CHOICES_EMPTY' });

    let historyEntryType: HistoryEntry['type'] = 'choice';
    // Check if the choice is a hotspot interaction based on its format (e.g., "hotspotId:Choice Text")
    // This is a convention that the AI needs to follow if it wants a choice to be recorded as a hotspot interaction.
    const hotspotChoiceMatch = choiceIdOrText.match(/^([a-zA-Z0-9_]+):(.*)$/);
    let actualChoiceText = choiceIdOrText;
    let hotspotIdInteracted: string | undefined = undefined;

    if (hotspotChoiceMatch) {
        hotspotIdInteracted = hotspotChoiceMatch[1];
        actualChoiceText = hotspotChoiceMatch[2].trim();
        historyEntryType = 'hotspot_interaction';
    }


    const addCreationHistory = (stage: string, selection: string) => {
      const entry: HistoryEntry = { id: `hist_creation_${stage}_${Date.now()}`, sceneSummary: `Character Creation - ${stage}: ${selection}`, choiceMade: selection, timestamp: new Date().toISOString(), fullSceneText: `Player selected '${selection}' for ${stage}.`, type: 'character_creation' };
      dispatch({ type: 'ADD_HISTORY_ENTRY', payload: entry });
    };

    if (currentPhase === GamePhase.ArchetypeSelection) {
      const chosenArchetype = ARCHETYPES_DATA.find(a => a.id === actualChoiceText); // Use actualChoiceText
      if (chosenArchetype) {
        addCreationHistory("Archetype", chosenArchetype.title);
        dispatch({ type: 'UPDATE_CHARACTER_CREATION_STEP', payload: { scene: '', choices: [], imagePrompt: null, data: { selectedArchetypeId: chosenArchetype.id } } });
        setCurrentPhase(GamePhase.OriginSelection);
        fetchGameData(ARCHETYPE_SELECTED_PROMPT_TEMPLATE(chosenArchetype), true);
      }
    } else if (currentPhase === GamePhase.OriginSelection) {
      const chosenOrigin = ORIGINS_DATA.find(o => o.id === actualChoiceText); // Use actualChoiceText
      const currentArchetype = ARCHETYPES_DATA.find(a => a.id === gameState.selectedArchetypeId);
      if (chosenOrigin && currentArchetype) {
        addCreationHistory("Origin", chosenOrigin.name);
        dispatch({ type: 'UPDATE_CHARACTER_CREATION_STEP', payload: { scene: '', choices: [], imagePrompt: null, data: { selectedOriginId: chosenOrigin.id } } });
        setCurrentPhase(GamePhase.BackgroundSelection);
        fetchGameData(ORIGIN_SELECTED_PROMPT_TEMPLATE(currentArchetype, chosenOrigin), true);
      }
    } else if (currentPhase === GamePhase.BackgroundSelection) {
      const chosenBackground = BACKGROUNDS_DATA.find(b => b.id === actualChoiceText); // Use actualChoiceText
      const currentArchetype = ARCHETYPES_DATA.find(a => a.id === gameState.selectedArchetypeId);
      const currentOrigin = ORIGINS_DATA.find(o => o.id === gameState.selectedOriginId);
      if (chosenBackground && currentArchetype && currentOrigin) {
        addCreationHistory("Background", chosenBackground.title);
        dispatch({ type: 'UPDATE_CHARACTER_CREATION_STEP', payload: { scene: '', choices: [], imagePrompt: null, data: { selectedBackgroundId: chosenBackground.id } } });
        setCurrentPhase(GamePhase.NameInput);
        fetchGameData(BACKGROUND_SELECTED_PROMPT_TEMPLATE(currentArchetype, currentOrigin, chosenBackground), true);
      }
    } else if (currentPhase === GamePhase.Playing || currentPhase === GamePhase.Error) {
      const currentSceneText = gameState.currentScene;
      const newHistoryEntry: HistoryEntry = {
        id: `hist_${Date.now()}`,
        sceneSummary: currentSceneText.substring(0, 150),
        choiceMade: choiceIdOrText, // Use original choiceIdOrText for history (includes hotspotId if present)
        timestamp: new Date().toISOString(),
        fullSceneText: currentSceneText,
        type: historyEntryType
      };
      dispatch({ type: 'ADD_HISTORY_ENTRY', payload: newHistoryEntry });

      const baseAIContext = buildGameContextForAI();
      const finalContextForAI: GameContextForAI = {
        ...baseAIContext,
        lastPlayerChoice: actualChoiceText, // Send the AI only the actual choice text
        recentHistorySummary: [...gameState.historyLog, newHistoryEntry].slice(-3).map(h => `${h.sceneSummary.substring(0, 50)}... -> ${h.choiceMade || h.type}`).join(' | ')
      };

      let promptToSend: string;
      if (actualChoiceText.startsWith("Attempt to Synthesize Echoes")) { // Use actualChoiceText
        promptToSend = SYNTHESIZE_ECHOES_PROMPT_TEMPLATE(finalContextForAI);
      } else if (actualChoiceText.startsWith("Attempt to Synthesize Lore Fragments:")) { // Use actualChoiceText
        const fragmentTitles = actualChoiceText.replace("Attempt to Synthesize Lore Fragments: ", "").split(" & ");
        promptToSend = SYNTHESIZE_LORE_FRAGMENTS_PROMPT_TEMPLATE(finalContextForAI, fragmentTitles);
      } else if (actualChoiceText.startsWith("Attempt to Attune to ")) { // Use actualChoiceText
        const itemName = actualChoiceText.replace("Attempt to Attune to ", "");
        promptToSend = ATTUNE_TO_ARTIFACT_PROMPT_TEMPLATE(finalContextForAI, itemName);
      } else {
        promptToSend = CONTINUE_GAME_PROMPT_TEMPLATE(finalContextForAI);
      }
      fetchGameData(promptToSend);
    }
  }, [currentPhase, gameState.selectedArchetypeId, gameState.selectedOriginId, gameState.currentScene, gameState.historyLog, fetchGameData, buildGameContextForAI]);

  const handleNameSubmit = (submittedName: string) => {
    if (currentPhase !== GamePhase.NameInput || !submittedName.trim()) return;
    soundService.playSound('UI_CONFIRM');

    const archetype = ARCHETYPES_DATA.find(a => a.id === gameState.selectedArchetypeId);
    const origin = ORIGINS_DATA.find(o => o.id === gameState.selectedOriginId);
    const background = BACKGROUNDS_DATA.find(b => b.id === gameState.selectedBackgroundId);

    if (!archetype || !origin || !background) {
      dispatch({ type: 'SET_ERROR', payload: "Character profile data missing during name submission." });
      setCurrentPhase(GamePhase.Error);
      return;
    }

    const profile: CharacterProfile = { archetype, origin, background, firstName: submittedName.trim() };
    dispatch({ type: 'SET_PLAYER_NAME', payload: { name: submittedName.trim(), profile } });

    const creationHistory: HistoryEntry = { id: `hist_creation_name_${Date.now()}`, sceneSummary: `Character Name Set: ${submittedName.trim()}`, choiceMade: submittedName.trim(), timestamp: new Date().toISOString(), fullSceneText: `Player named their character '${submittedName.trim()}'.`, type: 'character_creation' };
    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: creationHistory });

    setCurrentPhase(GamePhase.ConfirmationAndTransition);
    fetchGameData(NAME_SUBMITTED_PROMPT_TEMPLATE(profile), false, true);
  };

  const handleSynthesizeEchoes = useCallback(() => {
    if (gameState.whisperingEchoes.length === 0 || gameState.isLoading) return;
    soundService.playSound('SYNTHESIZE_ATTEMPT');
    const context = buildGameContextForAI();
    dispatch({ type: 'SET_LAST_CHOSEN_INDEX', payload: null });
    dispatch({ type: 'SET_CURRENT_SCENE_AND_CHOICES_EMPTY' });
    const newHistoryEntry: HistoryEntry = {
        id: `hist_synthesize_${Date.now()}`,
        sceneSummary: "Attempting to synthesize active echoes.",
        choiceMade: "Synthesize Echoes",
        timestamp: new Date().toISOString(),
        fullSceneText: "Player chose to synthesize the currently perceived whispering echoes.",
        type: 'lore_synthesis'
      };
    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: newHistoryEntry });
    fetchGameData(SYNTHESIZE_ECHOES_PROMPT_TEMPLATE(context));
  }, [gameState.whisperingEchoes, gameState.isLoading, fetchGameData, buildGameContextForAI]);

  const handleFocusSenses = useCallback(() => {
    if (gameState.isLoading || isReflecting) return;
    soundService.playSound('FOCUS_SENSES_ATTEMPT');
    const context = buildGameContextForAI();
    dispatch({ type: 'SET_LAST_CHOSEN_INDEX', payload: null });
    dispatch({ type: 'SET_CURRENT_SCENE_AND_CHOICES_EMPTY' });
     const newHistoryEntry: HistoryEntry = {
        id: `hist_focus_${Date.now()}`,
        sceneSummary: "Focusing senses to perceive subtle echoes.",
        choiceMade: "Focus Senses",
        timestamp: new Date().toISOString(),
        fullSceneText: "Player chose to focus their senses on the environment.",
        type: 'focused_perception'
      };
    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: newHistoryEntry });
    fetchGameData(FOCUS_SENSES_PROMPT_TEMPLATE(context));
  }, [gameState.isLoading, isReflecting, fetchGameData, buildGameContextForAI]);

  const handleResonanceSurge = useCallback(() => {
    if (!gameState.isResonanceSurgeAvailable || gameState.isLoading || isReflecting) return;
    soundService.playSound('RESONANCE_SURGE_ACTIVATE');
    const context = buildGameContextForAI();
    dispatch({ type: 'SET_LAST_CHOSEN_INDEX', payload: null });
    dispatch({ type: 'SET_CURRENT_SCENE_AND_CHOICES_EMPTY' });
    const newHistoryEntry: HistoryEntry = {
      id: `hist_surge_${Date.now()}`,
      sceneSummary: "Unleashed a Resonance Surge!",
      choiceMade: "Resonance Surge",
      timestamp: new Date().toISOString(),
      fullSceneText: "Player activated their Resonance Surge ability.",
      type: 'resonance_surge'
    };
    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: newHistoryEntry });
    fetchGameData(RESONANCE_SURGE_PROMPT_TEMPLATE(context), false, false, true);
  }, [gameState.isResonanceSurgeAvailable, gameState.isLoading, isReflecting, fetchGameData, buildGameContextForAI]);


  const handleNameInsightSubmit = useCallback((submittedName: string) => {
    if (!gameState.insightToName || !submittedName.trim()) return;
    soundService.playSound('UI_CONFIRM');
    const insightHistoryEntry: HistoryEntry = { id: `hist_insight_${Date.now()}`, sceneSummary: `Named Insight: "${submittedName}" for "${gameState.insightToName}"`, choiceMade: submittedName, timestamp: new Date().toISOString(), fullSceneText: gameState.currentScene, type: 'named_insight' };
    const insightContextForAI = gameState.insightToName!;

    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: insightHistoryEntry });
    dispatch({ type: 'SET_INSIGHT_TO_NAME', payload: null });

    const baseAIContext = buildGameContextForAI();
    const augmentedContext: GameContextForAI = {
      ...baseAIContext,
      lastPlayerChoice: `Named insight: "${submittedName.trim()}"`,
      recentHistorySummary: [...gameState.historyLog, insightHistoryEntry].slice(-3).map(h => `${h.sceneSummary.substring(0,50)}... -> ${h.choiceMade || h.type}`).join(' | '),
      playerNamedInsight: { originalInsight: insightContextForAI, chosenName: submittedName.trim() },
    };

    fetchGameData(CONTINUE_GAME_PROMPT_TEMPLATE(augmentedContext));
    setCurrentPhase(GamePhase.Playing);
  }, [gameState.insightToName, gameState.currentScene, gameState.historyLog, fetchGameData, buildGameContextForAI]);

  const handleCancelNaming = useCallback(() => {
    soundService.playSound('UI_CANCEL');
    dispatch({ type: 'SET_INSIGHT_TO_NAME', payload: null });

    const baseAIContext = buildGameContextForAI();
    const augmentedContext: GameContextForAI = {
      ...baseAIContext,
      lastPlayerChoice: "Chose not to name the insight at this time."
    };
    fetchGameData(CONTINUE_GAME_PROMPT_TEMPLATE(augmentedContext));
    setCurrentPhase(GamePhase.Playing);
  }, [fetchGameData, buildGameContextForAI]);

  const handleLoreInterpretationSubmit = useCallback((interpretation: string) => {
    if (!gameState.loreToInterpret) return;
    soundService.playSound('UI_CONFIRM');
    const loreInterpretationHistoryEntry: HistoryEntry = { id: `hist_loreinterpret_${Date.now()}`, sceneSummary: `Interpreted "${gameState.loreToInterpret.title}" as: "${interpretation}"`, choiceMade: interpretation, timestamp: new Date().toISOString(), fullSceneText: gameState.currentScene, type: 'lore_synthesis' };
    const loreToInterpretForAI = gameState.loreToInterpret!;

    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: loreInterpretationHistoryEntry });
    dispatch({ type: 'SET_AWAITING_LORE_INTERPRETATION', payload: undefined });

    const baseAIContext = buildGameContextForAI();
    const augmentedContext: GameContextForAI = {
      ...baseAIContext,
      lastPlayerChoice: `Interpreted lore: "${interpretation}"`,
      recentHistorySummary: [...gameState.historyLog, loreInterpretationHistoryEntry].slice(-3).map(h => `${h.sceneSummary.substring(0,50)}... -> ${h.choiceMade || h.type}`).join(' | '),
      playerInterpretedLore: { loreTitle: loreToInterpretForAI.title, chosenInterpretation: interpretation },
    };

    fetchGameData(CONTINUE_GAME_PROMPT_TEMPLATE(augmentedContext));
    setCurrentPhase(GamePhase.Playing);
  }, [gameState.loreToInterpret, gameState.currentScene, gameState.historyLog, fetchGameData, buildGameContextForAI]);

  const handleCancelLoreInterpretation = useCallback(() => {
    soundService.playSound('UI_CANCEL');
    dispatch({ type: 'SET_AWAITING_LORE_INTERPRETATION', payload: undefined });

    const baseAIContext = buildGameContextForAI();
    const augmentedContext: GameContextForAI = {
      ...baseAIContext,
      lastPlayerChoice: "Chose not to interpret the lore at this time."
    };
    fetchGameData(CONTINUE_GAME_PROMPT_TEMPLATE(augmentedContext));
    setCurrentPhase(GamePhase.Playing);
  }, [fetchGameData, buildGameContextForAI]);

  const handleRequestReflection = useCallback(async () => {
    if (!gameState.currentScene || isReflecting || gameState.isLoading) return;
    setIsReflecting(true);
    soundService.playSound('UI_CLICK_SUBTLE');
    try {
      const reflectionPrompt = REQUEST_PLAYER_REFLECTION_PROMPT_TEMPLATE(gameState.currentScene, gameState.historyLog.slice(-3).map(h => `${h.sceneSummary.substring(0, 50)}... -> ${h.choiceMade || h.type}`).join(' | '), gameState.playerEchoicSignature, gameState.characterProfile, gameState.currentLanguage);
      const response: GenerateContentResponse = await ai.models.generateContent({ model: GEMINI_NARRATIVE_MODEL, contents: reflectionPrompt, config: { systemInstruction: CORE_SYSTEM_INSTRUCTION } });
      const reflectionText = response.text.trim();

      if (reflectionText) {
        const reflectionEntry: HistoryEntry = { id: `reflect_${Date.now()}`, sceneSummary: reflectionText, timestamp: new Date().toISOString(), fullSceneText: reflectionText, type: 'reflection' };
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: reflectionEntry });
        soundService.playSound('PLAYER_REFLECTION_ADDED');
      }
    } catch (error) {
      console.error("Error requesting reflection:", error);
      dispatch({ type: 'SET_ERROR', payload: "The weave of thoughts became tangled. Reflection unclear." });
    } finally {
      setIsReflecting(false);
    }
  }, [ai.models, gameState.currentScene, gameState.historyLog, gameState.playerEchoicSignature, gameState.characterProfile, isReflecting, gameState.isLoading, gameState.currentLanguage]);

  const dismissError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    if (gameState.apiKeyMissing) {
      setCurrentPhase(GamePhase.HomeScreen); // Stay on HomeScreen if API key is missing, intro won't play
    } else if (!gameState.gameStarted) {
      setCurrentPhase(GamePhase.HomeScreen);
    } else {
      setCurrentPhase(GamePhase.Playing);
    }
  };

  const handleLanguageChangeAndReset = useCallback((lang: 'en' | 'pt') => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    setShowIntroVideo(true); // Reset to show intro on language change
    if (typeof window !== 'undefined') {
        localStorage.removeItem('hasPlayedIntro'); // Clear intro played status
    }
    setCurrentPhase(GamePhase.HomeScreen);
  }, []);


  const handleOpenSettings = () => dispatch({ type: 'TOGGLE_SETTINGS_PANEL' });
  const handleCloseSettings = () => dispatch({ type: 'TOGGLE_SETTINGS_PANEL' });
  const handleToggleLore = () => {
    dispatch({ type: 'TOGGLE_LORE_JOURNAL' });
    if (!gameState.showLoreJournalModal) setNewLoreForGlow(false);
  };
  const handleToggleHistory = () => dispatch({ type: 'TOGGLE_HISTORY_LOG' });
  const handleTogglePlayerNotes = () => dispatch({ type: 'TOGGLE_PLAYER_NOTES_MODAL' });


  const appContainerClasses = `min-h-screen flex flex-col transition-all duration-300 ease-in-out ${currentPhase !== GamePhase.HomeScreen && currentPhase !== GamePhase.ArchetypeSelection && currentPhase !== GamePhase.OriginSelection && currentPhase !== GamePhase.BackgroundSelection && currentPhase !== GamePhase.NameInput && currentPhase !== GamePhase.ConfirmationAndTransition && !showIntroVideo ? 'fantasy-parchment' : ''} ${currentPhase === GamePhase.Playing ? 'subtle-breathing-panel' : ''}`;

  if (showIntroVideo && !gameState.apiKeyMissing) {
    return <IntroVideoPlayer src="/assets/intro.mp4" onVideoEnd={handleIntroFinished} t={t} />;
  }

  const mainContent = () => {
    switch (currentPhase) {
      case GamePhase.HomeScreen:
        return <HomeScreen t={t} onStartNewGame={startGameFlow} onOpenSettings={handleOpenSettings} homeScreenImageUrl={gameState.homeScreenImageUrl} isLoading={gameState.isHomeScreenImageLoading || (gameState.isLoading && !gameState.gameStarted)} error={gameState.error} />;
      case GamePhase.ArchetypeSelection:
      case GamePhase.OriginSelection:
      case GamePhase.BackgroundSelection:
        const choicesForPhase = () => {
          if (currentPhase === GamePhase.ArchetypeSelection) return ARCHETYPES_DATA.map(a => ({ id: a.id, text: a.title }));
          if (currentPhase === GamePhase.OriginSelection && gameState.selectedArchetypeId) {
            const archetype = ARCHETYPES_DATA.find(a => a.id === gameState.selectedArchetypeId);
            return archetype ? ORIGINS_DATA.filter(o => archetype.availableOrigins.includes(o.id)).map(o => ({ id: o.id, text: o.name })) : [];
          }
          if (currentPhase === GamePhase.BackgroundSelection && gameState.selectedOriginId) {
            const origin = ORIGINS_DATA.find(o => o.id === gameState.selectedOriginId);
            return origin ? BACKGROUNDS_DATA.filter(b => origin.availableBackgrounds.includes(b.id)).map(b => ({ id: b.id, text: b.title })) : [];
          }
          return [];
        };
        return (
          <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center animate-fadeIn">
            <ImageDisplay imageUrl={gameState.currentImageUrl} altText={gameState.currentImagePrompt || "Character creation choice"} isLoading={gameState.isLoading && !gameState.currentImageUrl && !!gameState.currentImagePrompt} t={t} />
            <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-lg border border-divider-color mt-6">
              <InteractiveText text={gameState.currentScene} className="text-lg text-main-color mb-6" enableTypingEffect={true} />
              <ChoicesDisplay choices={choicesForPhase().map(c => c.text)} onChoiceSelected={(choiceText, index) => handlePlayerChoice(choicesForPhase()[index].id, index)} isLoading={gameState.isLoading} />
            </div>
          </div>
        );
      case GamePhase.NameInput:
        return (
          <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center animate-fadeIn">
            <ImageDisplay imageUrl={gameState.currentImageUrl} altText={gameState.currentImagePrompt || "Name your character"} isLoading={gameState.isLoading && !gameState.currentImageUrl && !!gameState.currentImagePrompt} t={t}/>
            <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-lg border border-divider-color mt-6">
              <InteractiveText text={gameState.currentScene} className="text-lg text-main-color mb-6" enableTypingEffect={true} />
              <form onSubmit={(e) => { e.preventDefault(); if (nameInputRef.current) handleNameSubmit(nameInputRef.current.value); }} className="space-y-4">
                <label htmlFor="characterName" className="font-heading text-lg block text-heading-color">{t("Enter Your Name:")}</label>
                <input
                  ref={nameInputRef} type="text" id="characterName" name="characterName"
                  className="w-full p-2 border border-divider-color rounded bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary text-main-color"
                  minLength={2} maxLength={30} required autoFocus
                />
                <button type="submit" className="fantasy-button fantasy-button-primary w-full" disabled={gameState.isLoading}>
                  {t("Claim Your Name")}
                </button>
              </form>
            </div>
          </div>
        );
      case GamePhase.ConfirmationAndTransition:
        return <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center animate-fadeIn">
          <ImageDisplay imageUrl={gameState.currentImageUrl} altText={gameState.currentImagePrompt || "Profile confirmation"} isLoading={gameState.isLoading && !gameState.currentImageUrl && !!gameState.currentImagePrompt} t={t}/>
          <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-lg border border-divider-color mt-6">
            <InteractiveText text={gameState.currentScene} className="text-lg text-main-color mb-6" enableTypingEffect={true} />
            <ChoicesDisplay choices={gameState.choices} onChoiceSelected={handlePlayerChoice} isLoading={gameState.isLoading} />
          </div>
        </div>;
      case GamePhase.Playing:
        if (gameState.isLoading && !gameState.currentScene && gameState.gameStarted) return <LoadingIndicator isLoading={true} message={t("The Weave shifts...")} t={t} />;
        return (<StoryDisplayContainer t={t} gameState={gameState} handlePlayerChoice={handlePlayerChoice} handleSynthesizeEchoes={handleSynthesizeEchoes} handleFocusSenses={handleFocusSenses} handleResonanceSurge={handleResonanceSurge} handleRequestReflection={handleRequestReflection} isReflecting={isReflecting} handleTogglePlayerNotes={handleTogglePlayerNotes} />);
      case GamePhase.Error:
        return <ErrorDisplay t={t} error={gameState.error || t(GENERIC_API_ERROR_MESSAGE_KEY)} onDismiss={dismissError} startGameFlow={startGameFlow} currentLanguage={gameState.currentLanguage} />;
      case GamePhase.AwaitingNameInput:
        if (gameState.isLoading && !gameState.insightToName) return <LoadingIndicator isLoading={true} message={t("Solidifying understanding...")} t={t} />;
        return <NameInsightForm t={t} onSubmit={handleNameInsightSubmit} onCancel={handleCancelNaming} insightText={gameState.insightToName || "A significant understanding..."} isLoading={gameState.isLoading} />;
      case GamePhase.AwaitingLoreInterpretation:
        if (!gameState.loreToInterpret) return <LoadingIndicator isLoading={true} message={t("Delving into arcane interpretations...")} t={t} />;
        return <LoreInterpretationModal t={t} loreTitle={gameState.loreToInterpret.title} interpretations={gameState.loreToInterpret.interpretations} onSubmit={handleLoreInterpretationSubmit} onCancel={handleCancelLoreInterpretation} />;
      default:
        // This case should ideally not be reached if API key is missing and intro is handled.
        // If it is, it's likely API key is missing, or intro video is somehow stuck.
        if (gameState.apiKeyMissing) {
             return <ErrorDisplay t={t} error={t(API_KEY_ERROR_MESSAGE_KEY)} onDismiss={dismissError} startGameFlow={startGameFlow} currentLanguage={gameState.currentLanguage} />;
        }
        return <LoadingIndicator isLoading={true} message={t("Awakening the echoes...")} t={t} />;
    }
  };

  const NameInsightForm: React.FC<{ t: Function, onSubmit: (name: string) => void, onCancel: () => void, insightText: string, isLoading?: boolean }> = ({ t, onSubmit, onCancel, insightText, isLoading }) => {
    const insightNameRef = useRef<HTMLInputElement>(null);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <form onSubmit={(e) => { e.preventDefault(); if (insightNameRef.current) onSubmit(insightNameRef.current.value); }} className="bg-secondary p-6 rounded-lg shadow-xl text-main-color w-full max-w-md">
          <h3 className="font-heading text-2xl text-heading-color mb-4 echoic-unveil-title">{t("Name Your Understanding")}</h3>
          <div className="font-body mb-4 p-3 bg-primary rounded border border-divider-color text-sm max-h-40 overflow-y-auto custom-scrollbar"><InteractiveText text={insightText} /></div>
          <label htmlFor="insightName" className="font-heading text-lg block mb-2 text-heading-color">{t("Give it a name (3-50 chars):")}</label>
          <input ref={insightNameRef} type="text" id="insightName" name="insightName" className="w-full p-2 border border-divider-color rounded bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary text-main-color" minLength={3} maxLength={50} required autoFocus />
          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onCancel} className="fantasy-button fantasy-button-secondary flex-1" disabled={isLoading}>{t("Cancel")}</button>
            <button type="submit" className="fantasy-button fantasy-button-primary flex-1" disabled={isLoading}>{isLoading ? t("Solidifying...") : t("Solidify")}</button>
          </div>
        </form>
      </div>
    );
  };

  const StoryDisplayContainer: React.FC<{
    t: (key: string, params?: Record<string, string | number>) => string,
    gameState: GameState,
    handlePlayerChoice: (choice: string, index: number) => void,
    handleSynthesizeEchoes: () => void,
    handleFocusSenses: () => void,
    handleResonanceSurge: () => void,
    handleRequestReflection: () => void,
    isReflecting: boolean,
    handleTogglePlayerNotes: () => void
  }> = ({ t, gameState, handlePlayerChoice, handleSynthesizeEchoes, handleFocusSenses, handleResonanceSurge, handleRequestReflection, isReflecting, handleTogglePlayerNotes }) => (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
      <header className="text-center mb-6 md:mb-10">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 echoic-unveil-title">{t("Resonant Echoes")}</h1>
        {gameState.characterProfile && <p className="font-body text-lg text-muted-color">{t("The Journey of {name}, the {archetype}", { name: gameState.characterProfile.firstName, archetype: gameState.characterProfile.archetype.title })}</p>}
      </header>
      <DreamRumorDisplay t={t} dreamOrVision={gameState.dreamOrVisionToDisplay} rumors={gameState.currentRumors} onDismissDream={() => dispatch({ type: 'DISMISS_DREAM_OR_VISION' })} />
      {gameState.activeDissonanceEffect && (<div className="mb-4 p-3 bg-red-900 bg-opacity-20 rounded border border-magical-dissonance-border text-sm"><strong className="text-magical-dissonance-text font-semibold">{t("Dissonance Active:")} </strong><InteractiveText text={gameState.activeDissonanceEffect.description} className="text-magical-dissonance-text" /> {gameState.activeDissonanceEffect.mechanicalEffect && <span className="block text-xs italic text-red-400">({gameState.activeDissonanceEffect.mechanicalEffect})</span>}</div>)}
      {gameState.playerConditions.length > 0 && (<div className="mb-4 p-3 bg-yellow-500 bg-opacity-20 rounded border border-accent-primary-border text-sm"><strong className="text-accent-primary font-semibold">{t("Conditions:")} </strong> {gameState.playerConditions.map(c => `${c.type}: ${c.description}`).join('; ')}</div>)}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-8"> <ImageDisplay t={t} imageUrl={gameState.currentImageUrl} altText={gameState.currentImagePrompt || "Scene"} isLoading={gameState.isLoading && !gameState.currentImageUrl && !!gameState.currentImagePrompt} /> </div>
        <div className="md:col-span-4 space-y-4"> <GameStatusDisplay t={t} timeOfDay={gameState.currentTimeOfDay} weather={gameState.currentWeather} inventory={gameState.playerInventory} onAttune={(itemName) => handlePlayerChoice(`Attempt to Attune to ${itemName}`, -1)} characterProfile={gameState.characterProfile} /> <RenownDisplay renown={gameState.renown} lastChangeNarrative={gameState.lastRenownNarrative} animateOnUpdate={!!(gameState.lastRenownNarrative || gameState.renown !== 0)} /> </div>
      </div>
      {gameState.error && currentPhase === GamePhase.Playing && (<div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-300 shadow flex justify-between items-center">{gameState.error} <button onClick={dismissError} className="text-sm p-1 hover:bg-red-200 rounded">X</button></div>)}
      <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-lg border border-divider-color mb-6">
        <h2 className="font-heading text-3xl text-heading-color mb-4 border-b border-divider-color pb-2">{t("The Unfolding Path")}</h2>
        <StoryDisplay storyText={gameState.currentScene} enableTypingEffect={true} className="text-lg text-main-color" />
        <ChoicesDisplay choices={gameState.choices} onChoiceSelected={handlePlayerChoice} isLoading={gameState.isLoading || isReflecting} lastChosenIndex={gameState.lastChosenChoiceIndex} activeHotspots={gameState.activeEchoHotspots} />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <button onClick={handleSynthesizeEchoes} className={`fantasy-button fantasy-button-secondary ${(gameState.whisperingEchoes.length > 0 && !gameState.isLoading && !isReflecting) ? 'synthesis-button-ready-pulse' : ''}`} disabled={gameState.isLoading || isReflecting || gameState.whisperingEchoes.length === 0}> {t("Synthesize ({count})", { count: gameState.whisperingEchoes.length })} </button>
          <button onClick={handleFocusSenses} className="fantasy-button fantasy-button-secondary" disabled={gameState.isLoading || isReflecting || !gameState.currentScene}>{t("Focus Senses")}</button>
          <button
            onClick={handleResonanceSurge}
            className={`fantasy-button fantasy-button-primary ${gameState.isResonanceSurgeAvailable ? 'resonance-surge-ready-pulse' : ''}`}
            disabled={!gameState.isResonanceSurgeAvailable || gameState.isLoading || isReflecting}
          >
            {gameState.isResonanceSurgeAvailable ? t("Resonance Surge") : t("Surge (CD: {cooldown})", { cooldown: gameState.resonanceSurgeCooldown })}
          </button>
          <button onClick={handleRequestReflection} className="fantasy-button fantasy-button-secondary" disabled={gameState.isLoading || isReflecting || !gameState.currentScene}> {isReflecting ? t("Pondering...") : t("Ponder Moment")} </button>
        </div>
      </div>
      <WhisperingEchoesDisplay t={t} echoes={gameState.whisperingEchoes} isSynthesizing={false} />
      <div className="flex gap-4 mt-6 justify-center">
        <button onClick={handleToggleLore} className={`fantasy-button fantasy-button-primary ${newLoreForGlow ? 'new-entry-glow-button' : ''}`}> {t("Tome ({count})", { count: gameState.loreJournal.length + gameState.loreFragments.length })} </button>
        <button onClick={handleToggleHistory} className="fantasy-button fantasy-button-primary"> {t("Path Taken ({count})", { count: gameState.historyLog.length })} </button>
        <button onClick={handleTogglePlayerNotes} className="fantasy-button fantasy-button-primary">{t("My Journal ({count})", { count: gameState.playerNotes.length })}</button>
        <button onClick={handleOpenSettings} className="fantasy-button fantasy-button-primary">{t("Settings")}</button>
      </div>
    </div>
  );
  const ErrorDisplay: React.FC<{ t: Function, error: string, onDismiss: () => void, startGameFlow: () => void, currentLanguage: 'en' | 'pt' }> = ({ t, error, onDismiss, startGameFlow, currentLanguage }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fadeIn bg-primary">
      <h2 className="font-heading text-4xl text-magical-error-text mb-4">{t("A Dissonant Chord!")}</h2>
      <InteractiveText text={error || t(GENERIC_API_ERROR_MESSAGE_KEY)} className="text-lg text-main-color mb-6 max-w-md" />
      <button onClick={onDismiss} className="fantasy-button fantasy-button-primary">{t("Return to Safety")}</button>
      <RestartButton onRestart={() => { dispatch({ type: 'INITIALIZE_GAME_STATE', payload: { currentLanguage } }); setCurrentPhase(GamePhase.HomeScreen); startGameFlow(); }} text={t("Restart Chronicle")} />
    </div>
  );

  return (
    <div className={appContainerClasses}>
      <LoadingIndicator
        isLoading={
          (gameState.isLoading && (currentPhase !== GamePhase.Playing || (currentPhase === GamePhase.Playing && !gameState.currentImageUrl && !!gameState.currentImagePrompt))) ||
          (currentPhase === GamePhase.HomeScreen && !showIntroVideo && gameState.isHomeScreenImageLoading && !gameState.homeScreenImageUrl)
        }
        message={
          gameState.apiKeyMissing ? t("Awaiting Weaver's Permission (API Key)...") :
            (currentPhase === GamePhase.HomeScreen && !showIntroVideo && gameState.isHomeScreenImageLoading) ? t("The Atheneum Materializes...") :
              (currentPhase !== GamePhase.Playing && gameState.isLoading) ? t("The Threads of Fate are Weaving...") :
                (currentPhase === GamePhase.Playing && gameState.isLoading && !gameState.currentImageUrl && !!gameState.currentImagePrompt) ? t("A Vision Coalesces...") :
                  t("The Weave Shimmers...")
        }
        t={t}
      />
      {mainContent()}
      <SettingsPanel
        t={t}
        isOpen={gameState.showSettingsPanel}
        onClose={handleCloseSettings}
        currentTheme={currentTheme}
        onToggleTheme={toggleTheme}
        volume={gameState.currentVolume}
        onVolumeChange={handleVolumeChange}
        isMuted={gameState.isMuted}
        onMuteToggle={handleMuteToggle}
        isColorBlindAssistActive={gameState.isColorBlindAssistActive}
        onToggleColorBlindAssist={toggleColorBlindAssist}
        currentLanguage={gameState.currentLanguage}
        onLanguageChangeAndReset={handleLanguageChangeAndReset}
      />
      {gameState.showLoreJournalModal && <LoreJournal t={t} loreEntries={gameState.loreJournal} loreFragments={gameState.loreFragments} isOpen={gameState.showLoreJournalModal} onToggle={handleToggleLore} showGlow={newLoreForGlow} newestEntryId={gameState.newestLoreEntryId} onSynthesizeFragments={(fragmentIdsToSynthesize: string[]) => { const titles = fragmentIdsToSynthesize.map(id => gameState.loreFragments.find(f => f.id === id)?.titleHint || 'Unknown Fragment'); handlePlayerChoice(`Attempt to Synthesize Lore Fragments: ${titles.join(' & ')}`, -1); }} />}
      {gameState.showHistoryLogModal && <HistoryLog t={t} historyLog={gameState.historyLog} isOpen={gameState.showHistoryLogModal} onToggle={handleToggleHistory} />}
      {gameState.showPlayerNotesModal && (
        <PlayerNotesModal
          t={t}
          isOpen={gameState.showPlayerNotesModal}
          onClose={handleTogglePlayerNotes}
          notes={gameState.playerNotes}
          onAddNote={(noteData) => dispatch({ type: 'ADD_PLAYER_NOTE', payload: noteData })}
          onUpdateNote={(note) => dispatch({ type: 'UPDATE_PLAYER_NOTE', payload: note })}
          onDeleteNote={(id) => dispatch({ type: 'DELETE_PLAYER_NOTE', payload: { id } })}
        />
      )}
      <footer className={`text-center py-5 border-t text-xs ${currentPhase === GamePhase.HomeScreen && !showIntroVideo ? 'absolute bottom-0 w-full bg-black bg-opacity-30 text-gray-400 border-transparent' : 'mt-auto border-divider-color text-muted-color'}`}>
        <p> {t(currentPhase === GamePhase.HomeScreen && !showIntroVideo ? "A tale woven by Gemini & React." : "Resonant Echoes. Created with Gemini & React.")} </p>
        <p> {t("Fonts: MedievalSharp & EB Garamond by Google Fonts.")} </p>
      </footer>
    </div>
  );
};

export default App;
