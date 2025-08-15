
import React, { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

import {
  WhisperingEchoDetail, LoreEntryData, LoreFragmentData, HistoryEntry,
  GeminiResponseData, GameState, GameContextForAI, GamePhase,
  PlayerInventoryItem, DissonanceEffect, PlayerTemporaryCondition,
  ArchetypeProfile, OriginProfile, BackgroundProfile, CharacterProfile, PlayerNote,
  EchoHotspot, LocationData
} from './types';

import {
  GEMINI_NARRATIVE_MODEL, IMAGEN_IMAGE_MODEL, VEO_VIDEO_MODEL, PLACEHOLDER_IMAGE_URL,
  PLACEHOLDER_HOME_SCREEN_IMAGE_URL, CORE_SYSTEM_INSTRUCTION,
  CONTINUE_GAME_PROMPT_TEMPLATE, SYNTHESIZE_ECHOES_PROMPT_TEMPLATE,
  SYNTHESIZE_LORE_FRAGMENTS_PROMPT_TEMPLATE, ATTUNE_TO_ARTIFACT_PROMPT_TEMPLATE,
  REQUEST_PLAYER_REFLECTION_PROMPT_TEMPLATE, API_KEY_ERROR_MESSAGE_KEY,
  GENERIC_API_ERROR_MESSAGE_KEY,
  HOME_SCREEN_IMAGE_PROMPT, INTRO_VIDEO_PROMPT,
  ARCHETYPES_DATA, ORIGINS_DATA, BACKGROUNDS_DATA,
  CHARACTER_CREATION_INTRO_PROMPT, ARCHETYPE_SELECTED_PROMPT_TEMPLATE,
  ORIGIN_SELECTED_PROMPT_TEMPLATE, BACKGROUND_SELECTED_PROMPT_TEMPLATE,
  NAME_SUBMITTED_PROMPT_TEMPLATE, INITIAL_GAME_PROMPT, FOCUS_SENSES_PROMPT_TEMPLATE,
  CUSTOM_ACTION_PROMPT_TEMPLATE
} from './constants';
import { AudioService } from './services/audioService';

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
import MapModal from './components/MapModal';
import EchoWeavingModal from './components/EchoWeavingModal';
import ErrorDisplay from './components/ErrorDisplay';
import IntroVideoPlayer from './components/IntroVideoPlayer';


// Translation Data Store
const translations = {
  // General
  "Resonant Echoes": { en: "Resonant Echoes", pt: "Ecos Ressonantes" },
  "Settings": { en: "Settings", pt: "Opções" },
  "Cancel": { en: "Cancel", pt: "Cancelar" },


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
  "Map": { en: "Map", pt: "Mapa" },

  // App.tsx - ErrorDisplay
  "A Dissonant Chord!": { en: "A Dissonant Chord!", pt: "Uma Corda Dissonante!" },
  "Return to Safety": { en: "Return to Safety", pt: "Retornar à Segurança" },
  "Restart Chronicle": { en: "Restart Chronicle", pt: "Reiniciar Crônica" },

  // App.tsx - NameInsightForm
  "Name Your Understanding": { en: "Name Your Understanding", pt: "Nomeie Seu Entendimento" },
  "Give it a name (3-50 chars):": { en: "Give it a name (3-50 chars):", pt: "Dê um nome (3-50 caracteres):" },
  "Solidify": { en: "Solidify", pt: "Solidificar" },
  "Solidifying...": { en: "Solidifying...", pt: "Solidificando..." },

  // App.tsx - CustomActionInputForm
  "Unleash Your Power": { en: "Unleash Your Power", pt: "Liberte Seu Poder" },
  "The world shimmers with resonant energy! What do you try to do with this surge of power?": { en: "The world shimmers with resonant energy! What do you try to do with this surge of power?", pt: "O mundo cintila com energia ressonante! O que você tenta fazer com este surto de poder?" },
  "Describe your action... (e.g., 'I mend the crack in the Heartstone with pure light', 'I command the phantom to reveal its true name')": { en: "Describe your action... (e.g., 'I mend the crack in the Heartstone with pure light', 'I command the phantom to reveal its true name')", pt: "Descreva sua ação... (ex: 'Eu conserto a rachadura na PedraCerne com pura luz', 'Eu ordeno ao fantasma que revele seu verdadeiro nome')" },
  "Act": { en: "Act", pt: "Agir" },
  "Acting...": { en: "Acting...", pt: "Agindo..." },

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
  "Originally understood as: \"{title}\"": { en: "Originally understood as: \"{title}\"", pt: "Originalmente entendido como: \"{title}\"" },
  "Context:": { en: "Context:", pt: "Contexto:" },
  "Method:": { en: "Method:", pt: "Método:" },
  "Trigger:": { en: "Trigger:", pt: "Gatilho:" },
  "Scattered Fragments": { en: "Scattered Fragments", pt: "Fragmentos Dispersos" },
  "Select fragment": { en: "Select fragment", pt: "Selecionar fragmento" },
  "(Synthesized)": { en: "(Synthesized)", pt: "(Sintetizado)" },
  "Origin:": { en: "Origin:", pt: "Origem:" },
  "Hint:": { en: "Hint:", pt: "Dica:" },
  "Connects to {loreIdHint}": { en: "Connects to {loreIdHint}", pt: "Conecta-se a {loreIdHint}" },
  "Synthesize Selected Fragments ({count})": { en: "Synthesize Selected Fragments ({count})", pt: "Sintetizar Fragmentos Selecionados ({count})" },
  "Select 2 or more related fragments to attempt synthesis.": { en: "Select 2 or more related fragments to attempt synthesis.", pt: "Selecione 2 ou mais fragmentos relacionados para tentar a síntese." },
  "No fragments of forgotten lore discovered yet.": { en: "No fragments of forgotten lore discovered yet.", pt: "Nenhum fragmento de sabedoria esquecida foi descoberto ainda." },

  // HistoryLog
  "The Path Taken": { en: "The Path Taken", pt: "O Caminho Percorrido" },
  "Close Scroll": { en: "Close Scroll", pt: "Fechar Pergaminho" },
  "Your Choice: {choice}": { en: "Your Choice: {choice}", pt: "Sua Escolha: {choice}" },
  "Personal Reflection:": { en: "Personal Reflection:", pt: "Reflexão Pessoal:" },
  "Insight Named": { en: "Insight Named", pt: "Entendimento Nomeado" },
  "Lore Synthesized": { en: "Lore Synthesized", pt: "Sabedoria Sintetizada" },
  "Artifact Attuned": { en: "Artifact Attuned", pt: "Artefato Sintonizado" },
  "Echo Weaving Toll": { en: "Echo Weaving Toll", pt: "Preço da Tecelagem de Ecos" },
  "Dissonance Encountered": { en: "Dissonance Encountered", pt: "Dissonância Encontrada" },
  "Character Milestone": { en: "Character Milestone", pt: "Marco de Personagem" },
  "Path Unfolds...": { en: "Path Unfolds...", pt: "O Caminho Se Desdobra..." },
  "Full context...": { en: "Full context...", pt: "Contexto completo..." },
  "The scroll of your journey is yet to be written.": { en: "The scroll of your journey is yet to be written.", pt: "O pergaminho de sua jornada ainda está para ser escrito." },

  // GameStatusDisplay
  "Player Status": { en: "Player Status", pt: "Status do Jogador" },
  "Renown:": { en: "Renown:", pt: "Renome:" },
  "Inventory:": { en: "Inventory:", pt: "Inventário:" },
  "Attune to Echoes": { en: "Attune to Echoes", pt: "Sintonizar com Ecos" },
  "The Weave is calm, your satchel light.": { en: "The Weave is calm, your satchel light.", pt: "A Trama está calma, sua bolsa está leve." },

  // WhisperingEchoesDisplay
  "Whispering Echoes": { en: "Whispering Echoes", pt: "Ecos Sussurrantes" },
  "The Weave is quiet for now...": { en: "The Weave is quiet for now...", pt: "A Trama está quieta por enquanto..." },
  "Intensity:": { en: "Intensity:", pt: "Intensidade:" },
  "Type:": { en: "Type:", pt: "Tipo:" },
  "Emotion:": { en: "Emotion:", pt: "Emoção:" },
  "Sensation:": { en: "Sensation:", pt: "Sensação:" },
  "Duration:": { en: "Duration:", pt: "Duração:" },
  "Clarity:": { en: "Clarity:", pt: "Clareza:" },
  
  // ImageDisplay
  "A Vision Coalesces...": { en: "A Vision Coalesces...", pt: "Uma Visão Se Forma..." },
  "Awaiting a vision...": { en: "Awaiting a vision...", pt: "Aguardando uma visão..." },

  // PlayerNotesModal
  "My Personal Journal": { en: "My Personal Journal", pt: "Meu Diário Pessoal" },
  "Close Journal": { en: "Close Journal", pt: "Fechar Diário" },
  "Edit Entry": { en: "Edit Entry", pt: "Editar Entrada" },
  "New Entry": { en: "New Entry", pt: "Nova Entrada" },
  "Title (Optional):": { en: "Title (Optional):", pt: "Título (Opcional):" },
  "E.g., 'Theron's Warning', 'Echoes in the Old Mill'": { en: "E.g., 'Theron's Warning', 'Echoes in the Old Mill'", pt: "Ex: 'Aviso de Theron', 'Ecos no Velho Moinho'" },
  "Content:": { en: "Content:", pt: "Conteúdo:" },
  "Record your thoughts, theories, or reminders here...": { en: "Record your thoughts, theories, or reminders here...", pt: "Anote seus pensamentos, teorias ou lembretes aqui..." },
  "Note content cannot be empty.": { en: "Note content cannot be empty.", pt: "O conteúdo da nota não pode estar vazio." },
  "Tags (comma-separated):": { en: "Tags (comma-separated):", pt: "Etiquetas (separadas por vírgula):" },
  "E.g., #Theron, #ArchitectMystery, #Heartstone": { en: "E.g., #Theron, #ArchitectMystery, #Heartstone", pt: "Ex: #Theron, #MisterioDosArquitetos, #PedraCerne" },
  "Linked Lore IDs (comma-separated):": { en: "Linked Lore IDs (comma-separated):", pt: "IDs de Sabedoria Vinculados (separados por vírgula):" },
  "E.g., lore_ancient_ritual, lore_theron_warning_1": { en: "E.g., lore_ancient_ritual, lore_theron_warning_1", pt: "Ex: sabedoria_ritual_antigo, sabedoria_aviso_theron_1" },
  "Save Changes": { en: "Save Changes", pt: "Salvar Alterações" },
  "Add Note": { en: "Add Note", pt: "Adicionar Nota" },
  "Cancel Edit": { en: "Cancel Edit", pt: "Cancelar Edição" },
  "Tags:": { en: "Tags:", pt: "Etiquetas:" },
  "Linked Lore:": { en: "Linked Lore:", pt: "Sabedoria Vinculada:" },
  "Edit": { en: "Edit", pt: "Editar" },
  "Delete": { en: "Delete", pt: "Excluir" },
  "Your journal is empty. Time to scribe your thoughts!": { en: "Your journal is empty. Time to scribe your thoughts!", pt: "Seu diário está vazio. Hora de registrar seus pensamentos!" },
  "Confirm Deletion": { en: "Confirm Deletion", pt: "Confirmar Exclusão" },
  "Are you sure you want to delete this journal entry? This action cannot be undone.": { en: "Are you sure you want to delete this journal entry? This action cannot be undone.", pt: "Tem certeza de que deseja excluir esta entrada do diário? Esta ação não pode ser desfeita." },
  "Delete Entry": { en: "Delete Entry", pt: "Excluir Entrada" },

  // MapModal
  "Chronicle Map": { en: "Chronicle Map", pt: "Mapa da Crônica" },
  "Close Map": { en: "Close Map", pt: "Fechar Mapa" },
  "The world of Aerthos is yet to be explored.": { en: "The world of Aerthos is yet to be explored.", pt: "O mundo de Aerthos ainda não foi explorado." },

  // EchoWeavingModal
  "The Weaver's Loom": { en: "The Weaver's Loom", pt: "O Tear do Tecelão" },
  "Close Loom": { en: "Close Loom", pt: "Fechar Tear" },
  "Perceived Echoes": { en: "Perceived Echoes", pt: "Ecos Percebidos" },
  "All echoes are in the nexus.": { en: "All echoes are in the nexus.", pt: "Todos os ecos estão no nexo." },
  "Drag echo orbs to the nexus to feel their connection.": { en: "Drag echo orbs to the nexus to feel their connection.", pt: "Arraste os orbes de eco para o nexo para sentir sua conexão." },
  "Weave Echoes": { en: "Weave Echoes", pt: "Tecer Ecos" },

  // IntroVideoPlayer
  'Conjuring a vision...': { en: 'Conjuring a vision...', pt: 'Conjurando uma visão...' },
  'Weaving threads of light...': { en: 'Weaving threads of light...', pt: 'Tecendo fios de luz...' },
  'Gathering distant memories...': { en: 'Gathering distant memories...', pt: 'Reunindo memórias distantes...' },
  'The vision nears completion...': { en: 'The vision nears completion...', pt: 'A visão se aproxima da conclusão...' },
  'Just a few moments more...': { en: 'Just a few moments more...', pt: 'Só mais alguns momentos...' },
  'Skip Intro': { en: 'Skip Intro', pt: 'Pular Introdução' },
  
  // API KEY Error
  [API_KEY_ERROR_MESSAGE_KEY]: { en: 'API Key is missing. Please ensure it is configured correctly to begin your journey.', pt: 'A Chave de API está faltando. Por favor, garanta que ela esteja configurada corretamente para começar sua jornada.' },
  [GENERIC_API_ERROR_MESSAGE_KEY]: { en: 'A dissonant hum from the Weave prevents a clear connection. Please check your connection or try again shortly.', pt: 'Um zumbido dissonante da Trama impede uma conexão clara. Por favor, verifique sua conexão ou tente novamente em breve.' },

  // LoadingIndicator
  "The Weave Shimmers...": { en: "The Weave Shimmers...", pt: "A Trama Cintila..." },

  // LoreInterpretationModal
  "Interpret the Ancient Lore": { en: "Interpret the Ancient Lore", pt: "Interprete a Sabedoria Antiga" },
  "The meaning of \"{title}\" is veiled. How do you understand its truth?": { en: "The meaning of \"{title}\" is veiled. How do you understand its truth?", pt: "O significado de \"{title}\" está velado. Como você entende sua verdade?" },
  "Ponder Later": { en: "Ponder Later", pt: "Ponderar Mais Tarde" },
  "This is My Understanding": { en: "This is My Understanding", pt: "Este é o Meu Entendimento" },

  // DreamRumorDisplay
  "A Fleeting Vision...": { en: "A Fleeting Vision...", pt: "Uma Visão Fugaz..." },
  "Dismiss": { en: "Dismiss", pt: "Dispensar" },
  "Whispers in the Weave:": { en: "Whispers in the Weave:", pt: "Sussurros na Trama:" },
};


type Action =
  | { type: 'START_GAME' }
  | { type: 'API_CALL_START' }
  | { type: 'API_CALL_SUCCESS'; payload: GeminiResponseData }
  | { type: 'API_CALL_FAILURE'; payload: string }
  | { type: 'SET_IMAGE_URL'; payload: string }
  | { type: 'IMAGE_GENERATION_START' }
  | { type: 'RESET_GAME' }
  | { type: 'INITIALIZE_GAME_STATE', payload: GameState }
  | { type: 'CHOOSE_ARCHETYPE', payload: string }
  | { type: 'CHOOSE_ORIGIN', payload: string }
  | { type: 'CHOOSE_BACKGROUND', payload: string }
  | { type: 'SUBMIT_NAME', payload: string }
  | { type: 'START_GAMEPLAY_TRANSITION' }
  | { type: 'SET_HOME_SCREEN_IMAGE_LOADING', payload: boolean }
  | { type: 'SET_HOME_SCREEN_IMAGE_URL', payload: { url: string | null, error?: string } }
  | { type: 'TOGGLE_SETTINGS_PANEL' }
  | { type: 'UPDATE_VOLUME', payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_COLOR_BLIND_ASSIST' }
  | { type: 'LORE_JOURNAL_TOGGLE' }
  | { type: 'HISTORY_LOG_TOGGLE' }
  | { type: 'ADD_HISTORY_ENTRY', payload: HistoryEntry }
  | { type: 'SET_LAST_CHOICE', payload: number }
  | { type: 'ADD_PLAYER_REFLECTION', payload: string }
  | { type: 'DISMISS_DREAM_VISION' }
  | { type: 'SUBMIT_LORE_INTERPRETATION', payload: string }
  | { type: 'CANCEL_LORE_INTERPRETATION' }
  | { type: 'CLEAR_INSIGHT_TO_NAME' }
  | { type: 'PLAYER_NOTES_TOGGLE' }
  | { type: 'ADD_PLAYER_NOTE', payload: { title: string, content: string, tags?: string[], linkedLoreIds?: string[] } }
  | { type: 'UPDATE_PLAYER_NOTE', payload: PlayerNote }
  | { type: 'DELETE_PLAYER_NOTE', payload: string }
  | { type: 'RESONANCE_SURGE_TOGGLE' }
  | { type: 'MAP_TOGGLE' }
  | { type: 'ECHO_WEAVING_TOGGLE' }
  | { type: 'SET_LANGUAGE', payload: 'en' | 'pt' }
  | { type: 'INTRO_VIDEO_START', payload: { message: string } }
  | { type: 'INTRO_VIDEO_LOADING_UPDATE', payload: { message: string } }
  | { type: 'INTRO_VIDEO_SUCCESS', payload: { url: string } }
  | { type: 'INTRO_VIDEO_FAILURE', payload: { error: string } };

const initialState: GameState = {
  currentScene: '',
  currentImagePrompt: null,
  currentImageUrl: null,
  choices: [],
  isLoading: false,
  error: null,
  loreJournal: [],
  loreFragments: [],
  historyLog: [],
  whisperingEchoes: [],
  currentSoundscape: '',
  playerEchoicSignature: '',
  factionReputationNotes: {},
  apiKeyMissing: false,
  gameStarted: false,
  renown: 0,
  lastRenownNarrative: null,
  firstName: null,
  selectedArchetypeId: null,
  selectedOriginId: null,
  selectedBackgroundId: null,
  characterProfile: null,
  insightToName: null,
  homeScreenImageUrl: null,
  isHomeScreenImageLoading: false,
  homeScreenImageFetchAttempted: false,
  showSettingsPanel: false,
  newestLoreEntryId: null,
  currentVolume: 70,
  isMuted: false,
  isColorBlindAssistActive: false,
  playerInventory: {},
  lastChosenChoiceIndex: null,
  currentRumors: [],
  dreamOrVisionToDisplay: null,
  awaitingLoreInterpretation: false,
  playerConditions: [],
  activeMemoryPhantoms: [],
  playerNotes: [],
  showPlayerNotesModal: false,
  isResonanceSurgeAvailable: true,
  resonanceSurgeCooldown: 0,
  currentLanguage: 'en',
  showLoreJournalModal: false,
  showHistoryLogModal: false,
  showMapModal: false,
  showEchoWeavingModal: false,
  discoveredLocations: [],
  currentLocationId: null,
  introVideoUrl: null,
  isIntroVideoLoading: false,
  introVideoLoadingMessage: '',
  isTransitioning: false,
};


// Main Reducer
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, isLoading: true, error: null, gameStarted: true, introVideoUrl: null, isIntroVideoLoading: true, introVideoLoadingMessage: '' };
    case 'API_CALL_START':
      return { ...state, isLoading: true, isTransitioning: true, error: null };
    case 'API_CALL_SUCCESS':
      const data = action.payload;
      const newHistoryEntry: HistoryEntry = {
        id: `hist_${new Date().toISOString()}`,
        sceneSummary: data.scene.substring(0, 150) + (data.scene.length > 150 ? "..." : ""),
        fullSceneText: data.scene,
        choiceMade: state.historyLog.find(h => h.type === 'choice')?.choiceMade,
        timestamp: new Date().toISOString(),
        type: 'story'
      };

      const updatedFragments = data.loreFragments
        ? state.loreFragments.filter(f => !data.loreFragments?.some(df => df.id === f.id)).concat(data.loreFragments)
        : state.loreFragments;

      const updatedInventory = { ...state.playerInventory };
      if (data.newItemsGranted) {
        Object.entries(data.newItemsGranted).forEach(([itemName, itemData]) => {
          if (updatedInventory[itemName]) {
            updatedInventory[itemName].count += itemData.count;
          } else {
            updatedInventory[itemName] = itemData;
          }
        });
      }

      const updatedConditions = data.playerConditionUpdate
        ? [...state.playerConditions.filter(c => c.type !== data.playerConditionUpdate!.type), data.playerConditionUpdate]
        : state.playerConditions;

      return {
        ...state,
        isLoading: false,
        isTransitioning: false,
        currentScene: data.scene,
        choices: data.choices || [],
        currentImagePrompt: data.imagePrompt || state.currentImagePrompt,
        whisperingEchoes: data.whisperingEchoes || [],
        loreJournal: data.newLore ? [...state.loreJournal, ...data.newLore] : state.loreJournal,
        newestLoreEntryId: data.newLore && data.newLore.length > 0 ? data.newLore[data.newLore.length - 1].id : null,
        loreFragments: updatedFragments,
        currentSoundscape: data.soundscape || state.currentSoundscape,
        playerEchoicSignature: data.initialPlayerEchoicSignature || data.playerEchoicSignatureUpdate || state.playerEchoicSignature,
        factionReputationNotes: data.factionUpdates ? { ...state.factionReputationNotes, ...data.factionUpdates } : state.factionReputationNotes,
        renown: data.renownChangeAmount !== undefined ? state.renown + data.renownChangeAmount : state.renown,
        lastRenownNarrative: data.renownChangeNarrative || state.lastRenownNarrative,
        historyLog: [...state.historyLog, newHistoryEntry],
        selectedArchetypeId: data.profileChoices?.origins ? state.selectedArchetypeId : null,
        selectedOriginId: data.profileChoices?.backgrounds ? state.selectedOriginId : null,
        insightToName: data.offerToNameInsight ? data.namedInsightContext || state.insightToName : null,
        currentTimeOfDay: data.currentTimeOfDay || state.currentTimeOfDay,
        currentWeather: data.currentWeather || state.currentWeather,
        playerInventory: updatedInventory,
        lastChosenChoiceIndex: null, // Reset after processing
        currentRumors: data.rumorMillUpdate ? [...state.currentRumors, data.rumorMillUpdate] : state.currentRumors,
        dreamOrVisionToDisplay: data.playerDreamOrVision || state.dreamOrVisionToDisplay,
        awaitingLoreInterpretation: !!data.interpretiveChoicesForLore,
        loreToInterpret: data.interpretiveChoicesForLore || state.loreToInterpret,
        activeDissonanceEffect: data.dissonanceEffectInScene || null,
        playerConditions: updatedConditions,
        echoicBlightInScene: data.echoicBlightInScene || null,
        activeMemoryPhantoms: data.memoryPhantomsInScene || [],
        devouringSilenceZoneInScene: data.devouringSilenceZoneInScene || null,
        characterProfile: data.confirmedProfileSummary && state.characterProfile ? { ...state.characterProfile } : state.characterProfile,
        activeEchoHotspots: data.activeEchoHotspots || [],
        resonanceSurgeCooldown: data.suggestedResonanceSurgeCooldown !== undefined ? data.suggestedResonanceSurgeCooldown : state.resonanceSurgeCooldown,
        isResonanceSurgeAvailable: data.suggestedResonanceSurgeCooldown !== undefined ? false : state.isResonanceSurgeAvailable,
        discoveredLocations: data.newLocationDiscovered ? [...state.discoveredLocations.filter(l => l.id !== data.newLocationDiscovered!.id), data.newLocationDiscovered] : state.discoveredLocations,
        currentLocationId: data.newLocationDiscovered ? data.newLocationDiscovered.id : state.currentLocationId,
      };
    case 'API_CALL_FAILURE':
      return { ...state, isLoading: false, isTransitioning: false, error: action.payload };
    case 'SET_IMAGE_URL':
      return { ...state, currentImageUrl: action.payload, isHomeScreenImageLoading: false };
    case 'IMAGE_GENERATION_START':
      return { ...state, isHomeScreenImageLoading: true };
    case 'RESET_GAME':
      return { ...initialState, apiKeyMissing: state.apiKeyMissing, homeScreenImageUrl: state.homeScreenImageUrl };

    case 'INITIALIZE_GAME_STATE': {
      return { ...action.payload, activeEchoHotspots: action.payload.activeEchoHotspots || [] };
    }
    case 'CHOOSE_ARCHETYPE':
      return { ...state, selectedArchetypeId: action.payload };
    case 'CHOOSE_ORIGIN':
      return { ...state, selectedOriginId: action.payload };
    case 'CHOOSE_BACKGROUND':
      return { ...state, selectedBackgroundId: action.payload };
    case 'SUBMIT_NAME':
      const archetype = ARCHETYPES_DATA.find(a => a.id === state.selectedArchetypeId)!;
      const origin = ORIGINS_DATA.find(o => o.id === state.selectedOriginId)!;
      const background = BACKGROUNDS_DATA.find(b => b.id === state.selectedBackgroundId)!;
      const profile: CharacterProfile = { archetype, origin, background, firstName: action.payload };
      return { ...state, firstName: action.payload, characterProfile: profile };

    case 'START_GAMEPLAY_TRANSITION':
      return { ...state, gameStarted: true };

    case 'SET_HOME_SCREEN_IMAGE_LOADING':
      return { ...state, isHomeScreenImageLoading: action.payload, homeScreenImageFetchAttempted: true };
    case 'SET_HOME_SCREEN_IMAGE_URL':
      return { ...state, homeScreenImageUrl: action.payload.url, isHomeScreenImageLoading: false, error: action.payload.error || null };

    case 'TOGGLE_SETTINGS_PANEL':
      return { ...state, showSettingsPanel: !state.showSettingsPanel };
    case 'UPDATE_VOLUME':
      return { ...state, currentVolume: action.payload, isMuted: action.payload === 0 };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'TOGGLE_COLOR_BLIND_ASSIST':
      return { ...state, isColorBlindAssistActive: !state.isColorBlindAssistActive };
    case 'LORE_JOURNAL_TOGGLE':
      return { ...state, showLoreJournalModal: !state.showLoreJournalModal, newestLoreEntryId: null };
    case 'HISTORY_LOG_TOGGLE':
      return { ...state, showHistoryLogModal: !state.showHistoryLogModal };
    case 'ADD_HISTORY_ENTRY':
      return { ...state, historyLog: [...state.historyLog, action.payload] };
    case 'SET_LAST_CHOICE':
      return { ...state, lastChosenChoiceIndex: action.payload };
    case 'ADD_PLAYER_REFLECTION':
      return {
        ...state,
        historyLog: [...state.historyLog, {
          id: `hist_reflect_${new Date().toISOString()}`,
          sceneSummary: action.payload,
          fullSceneText: action.payload,
          timestamp: new Date().toISOString(),
          type: 'reflection'
        }]
      };
    case 'DISMISS_DREAM_VISION':
      return { ...state, dreamOrVisionToDisplay: null };
    case 'SUBMIT_LORE_INTERPRETATION':
      return { ...state, awaitingLoreInterpretation: false, loreToInterpret: undefined };
    case 'CANCEL_LORE_INTERPRETATION':
      return { ...state, awaitingLoreInterpretation: false, loreToInterpret: undefined };
    case 'CLEAR_INSIGHT_TO_NAME':
      return { ...state, insightToName: null };

    case 'PLAYER_NOTES_TOGGLE':
      return { ...state, showPlayerNotesModal: !state.showPlayerNotesModal };
    case 'ADD_PLAYER_NOTE':
      const newNote: PlayerNote = {
        id: `note_${new Date().toISOString()}`,
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      return { ...state, playerNotes: [...state.playerNotes, newNote] };
    case 'UPDATE_PLAYER_NOTE':
      return { ...state, playerNotes: state.playerNotes.map(n => n.id === action.payload.id ? action.payload : n) };
    case 'DELETE_PLAYER_NOTE':
      return { ...state, playerNotes: state.playerNotes.filter(n => n.id !== action.payload) };

    case 'MAP_TOGGLE':
      return { ...state, showMapModal: !state.showMapModal };
    case 'ECHO_WEAVING_TOGGLE':
        return { ...state, showEchoWeavingModal: !state.showEchoWeavingModal };
    case 'SET_LANGUAGE':
        return {
            ...initialState, // Start from a clean slate
            currentLanguage: action.payload,
            characterProfile: null,
            gameStarted: false,
            activeEchoHotspots: [],
        };

    case 'INTRO_VIDEO_START':
        return { ...state, isIntroVideoLoading: true, introVideoLoadingMessage: action.payload.message };
    case 'INTRO_VIDEO_LOADING_UPDATE':
        return { ...state, introVideoLoadingMessage: action.payload.message };
    case 'INTRO_VIDEO_SUCCESS':
        return { ...state, isIntroVideoLoading: false, introVideoUrl: action.payload.url };
    case 'INTRO_VIDEO_FAILURE':
        // If video fails, we want to immediately move to the next phase
        return { ...state, isIntroVideoLoading: false, introVideoUrl: null, gameStarted: true, error: null }; // Clear the error to not show error screen

    default:
      return state;
  }
};


const initializeState = (initialState: GameState): GameState => {
  try {
    const storedStateJSON = localStorage.getItem('resonantEchoes_gameState');
    const storedLang = localStorage.getItem('resonantEchoes_language') as 'en' | 'pt' | null;
    
    let storedState: Partial<GameState> = {};
    if (storedStateJSON) {
      storedState = JSON.parse(storedStateJSON);
    }

    const mergedState = { ...initialState, ...storedState };

    if (storedLang) {
      mergedState.currentLanguage = storedLang;
    }

    return mergedState;

  } catch (error) {
    console.error("Could not initialize game state from localStorage:", error);
    localStorage.removeItem('resonantEchoes_gameState');
    return initialState;
  }
};


const App: React.FC = () => {

  const [state, dispatch] = useReducer(gameReducer, initialState, initializeState);
  const audioService = useRef(new AudioService());
  const hasSentApiCall = useRef(false);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const lang = state.currentLanguage || 'en';
    let translation = translations[key as keyof typeof translations]?.[lang] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }
    return translation;
  }, [state.currentLanguage]);


  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    const cb = localStorage.getItem('colorBlindAssist') === 'true';
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.classList.toggle('cb-assist-active', cb);
    if(cb) dispatch({ type: 'TOGGLE_COLOR_BLIND_ASSIST' });
    audioService.current.setVolume(state.currentVolume / 100);
    audioService.current.toggleMute(state.isMuted);
  }, []); // Run only once on mount

  useEffect(() => {
    if (state.gameStarted) {
      try {
        const stateToSave = { ...state, error: null, isLoading: false, isTransitioning: false };
        const serializedState = JSON.stringify(stateToSave);
        localStorage.setItem('resonantEchoes_gameState', serializedState);
      } catch (error) {
        console.error("Could not save game state to localStorage:", error);
      }
    }
  }, [state]);

  const handleFullReset = useCallback(() => {
    localStorage.removeItem('resonantEchoes_gameState');
    window.location.reload();
  }, []);
  
  const handleLanguageChangeAndReset = (lang: 'en' | 'pt') => {
    localStorage.setItem('resonantEchoes_language', lang);
    localStorage.removeItem('resonantEchoes_gameState');
    localStorage.removeItem('resonantEchoes_introVideo');
    window.location.reload();
  };

  const callGeminiAPI = useCallback(async (prompt: string, isRetry = false) => {
    if (!process.env.API_KEY) {
      dispatch({ type: 'API_CALL_FAILURE', payload: t(API_KEY_ERROR_MESSAGE_KEY) });
      return;
    }
    dispatch({ type: 'API_CALL_START' });
    hasSentApiCall.current = true;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: GEMINI_NARRATIVE_MODEL,
        contents: prompt,
        config: {
          systemInstruction: CORE_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json'
        },
      });

      const responseText = response.text.trim();
      const responseData: GeminiResponseData = JSON.parse(responseText);
      dispatch({ type: 'API_CALL_SUCCESS', payload: responseData });
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      if (!isRetry) {
        console.log("Retrying API call once...");
        callGeminiAPI(prompt, true);
      } else {
        dispatch({ type: 'API_CALL_FAILURE', payload: t(GENERIC_API_ERROR_MESSAGE_KEY) });
      }
    }
  }, [t]);

  const fetchImage = useCallback(async (prompt: string) => {
    if (!process.env.API_KEY) return;
    dispatch({ type: 'IMAGE_GENERATION_START' });
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: IMAGEN_IMAGE_MODEL,
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg'
        }
      });
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      dispatch({ type: 'SET_IMAGE_URL', payload: imageUrl });
      audioService.current.playSound('IMAGE_GENERATED');
    } catch (error) {
      console.error("Error generating image:", error);
      dispatch({ type: 'SET_IMAGE_URL', payload: PLACEHOLDER_IMAGE_URL });
    }
  }, []);

  const fetchHomeScreenImage = useCallback(async () => {
    dispatch({ type: 'SET_HOME_SCREEN_IMAGE_LOADING', payload: true });
    if (!process.env.API_KEY) {
      dispatch({ type: 'SET_HOME_SCREEN_IMAGE_URL', payload: { url: PLACEHOLDER_HOME_SCREEN_IMAGE_URL, error: t(API_KEY_ERROR_MESSAGE_KEY) } });
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: IMAGEN_IMAGE_MODEL,
        prompt: HOME_SCREEN_IMAGE_PROMPT,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg'
        }
      });
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      dispatch({ type: 'SET_HOME_SCREEN_IMAGE_URL', payload: { url: imageUrl } });
    } catch (error) {
      console.error("Error generating home screen image:", error);
      dispatch({ type: 'SET_HOME_SCREEN_IMAGE_URL', payload: { url: PLACEHOLDER_HOME_SCREEN_IMAGE_URL, error: t(GENERIC_API_ERROR_MESSAGE_KEY) } });
    }
  }, [t]);


  const fetchIntroVideo = async () => {
    dispatch({ type: 'INTRO_VIDEO_START', payload: { message: t('Conjuring a vision...') } });
    
    // Check local storage for cached video URL
    const cachedVideoData = localStorage.getItem('resonantEchoes_introVideo');
    if (cachedVideoData) {
        try {
            const { url, timestamp } = JSON.parse(cachedVideoData);
            // Cache is valid for 1 day
            const oneDay = 24 * 60 * 60 * 1000; 
            if (url && Date.now() - timestamp < oneDay) {
                console.log("Using cached intro video URL.");
                audioService.current.playSound('VIDEO_READY');
                dispatch({ type: 'INTRO_VIDEO_SUCCESS', payload: { url } });
                return;
            }
        } catch (e) {
            console.error("Failed to parse cached video data, fetching new video.", e);
            localStorage.removeItem('resonantEchoes_introVideo'); // Clear corrupted cache
        }
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        let operation = await ai.models.generateVideos({
            model: VEO_VIDEO_MODEL,
            prompt: INTRO_VIDEO_PROMPT,
            config: {
                numberOfVideos: 1
            }
        });
        
        const loadingMessages = [
            t('Weaving threads of light...'),
            t('Gathering distant memories...'),
            t('The vision nears completion...'),
            t('Just a few moments more...'),
        ];
        let messageIndex = 0;

        while (!operation.done) {
            dispatch({ type: 'INTRO_VIDEO_LOADING_UPDATE', payload: { message: loadingMessages[messageIndex % loadingMessages.length] } });
            messageIndex++;
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (operation.response?.generatedVideos?.[0]?.video?.uri) {
            const downloadLink = operation.response.generatedVideos[0].video.uri;
            const videoUrl = `${downloadLink}&key=${process.env.API_KEY}`;
            
            const videoDataToCache = JSON.stringify({ url: videoUrl, timestamp: Date.now() });
            localStorage.setItem('resonantEchoes_introVideo', videoDataToCache);

            audioService.current.playSound('VIDEO_READY');
            dispatch({ type: 'INTRO_VIDEO_SUCCESS', payload: { url: videoUrl } });
        } else {
            throw new Error("Video generation completed but no video URI was found.");
        }

    } catch (e: any) {
        console.error("Error generating intro video:", e);
        dispatch({ type: 'INTRO_VIDEO_FAILURE', payload: { error: e.message || String(e) } });
    }
  };


  const buildGameContext = useCallback((): GameContextForAI => {
    const recentHistory = state.historyLog.slice(-5).map(h => h.sceneSummary).join(' | ');
    const knownLoreTitles = state.loreJournal.map(l => l.playerGivenName || l.title);
    const knownLoreFragmentTitles = state.loreFragments.map(f => f.titleHint);
    const activeEchoesTexts = state.whisperingEchoes.map(e => e.text);
    const currentInventory = state.playerInventory ? Object.entries(state.playerInventory).reduce((acc, [name, data]) => {
      acc[name] = {
        count: data.count,
        description: data.description,
        hasUndiscoveredEchoes: !!(data.artifactEchoes && data.artifactEchoes.length > (data.knownArtifactEchoes?.length || 0)),
        isEchoicHeirloom: data.isEchoicHeirloom,
        heirloomLoreId: data.heirloomLoreId,
        knownArtifactEchoesSummary: data.knownArtifactEchoes?.map(e => e.text.substring(0,50)+'...'),
        untappedArtifactEchoesCount: (data.artifactEchoes?.length || 0) - (data.knownArtifactEchoes?.length || 0)
      };
      return acc;
    }, {} as GameContextForAI['playerInventory']) : {};

    return {
      characterProfile: state.characterProfile ? {
        archetypeTitle: state.characterProfile.archetype.title,
        originName: state.characterProfile.origin.name,
        backgroundTitle: state.characterProfile.background.title,
        firstName: state.characterProfile.firstName,
        startingBenefitDescription: state.characterProfile.background.benefit.description
      } : null,
      lastPlayerChoice: state.historyLog.filter(h => h.type === 'choice').slice(-1)[0]?.choiceMade,
      recentHistorySummary: recentHistory,
      knownLoreTitles,
      knownLoreFragmentTitles,
      activeEchoesTexts,
      playerEchoicSignature: state.playerEchoicSignature,
      factionReputationNotes: state.factionReputationNotes,
      currentRenown: state.renown,
      currentTimeOfDay: state.currentTimeOfDay,
      currentWeather: state.currentWeather,
      playerInventory: currentInventory,
      currentRumors: state.currentRumors,
      currentActiveDissonanceEffect: state.activeDissonanceEffect?.description,
      currentPlayerConditions: state.playerConditions.map(c => c.description),
      activeEchoHotspotsSummary: state.activeEchoHotspots?.map(h => ({id: h.id, name: h.name})),
      isResonanceSurgeAvailable: state.isResonanceSurgeAvailable,
      resonanceSurgeCooldownTurnsLeft: state.resonanceSurgeCooldown,
      discoveredLocationsSummary: state.discoveredLocations.map(l => ({ name: l.name })),
      currentLocationName: state.discoveredLocations.find(l => l.id === state.currentLocationId)?.name,
      language: state.currentLanguage,
    };
  }, [state]);

  useEffect(() => {
    if (state.gameStarted && !state.characterProfile && !hasSentApiCall.current && state.currentScene === '') {
      callGeminiAPI(INITIAL_GAME_PROMPT);
    }
  }, [state.gameStarted, state.characterProfile, state.currentScene, callGeminiAPI]);


  useEffect(() => {
    if (state.currentImagePrompt && state.currentImagePrompt !== '') {
      fetchImage(state.currentImagePrompt);
    }
  }, [state.currentImagePrompt, fetchImage]);

  useEffect(() => {
    if (state.currentSoundscape) {
      audioService.current.playMusic(state.currentSoundscape);
    }
  }, [state.currentSoundscape]);

  const handleChoice = useCallback((choice: string, index: number) => {
    dispatch({ type: 'SET_LAST_CHOICE', payload: index });
    const context = buildGameContext();
    context.lastPlayerChoice = choice;
    const prompt = CONTINUE_GAME_PROMPT_TEMPLATE(context);
    callGeminiAPI(prompt);
    const newHistoryEntry: HistoryEntry = {
      id: `hist_choice_${new Date().toISOString()}`,
      sceneSummary: `Made choice: "${choice}"`,
      fullSceneText: state.currentScene,
      choiceMade: choice,
      timestamp: new Date().toISOString(),
      type: 'choice'
    };
    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: newHistoryEntry });
  }, [buildGameContext, callGeminiAPI, state.currentScene]);

  const handleSynthesizeEchoes = () => {
    const context = buildGameContext();
    const prompt = SYNTHESIZE_ECHOES_PROMPT_TEMPLATE(context);
    callGeminiAPI(prompt);
    // ... update history log
  };

  const handleFocusSenses = () => {
      const context = buildGameContext();
      const prompt = FOCUS_SENSES_PROMPT_TEMPLATE(context);
      callGeminiAPI(prompt);
  };
  
  const handleCustomAction = (actionText: string) => {
      const context = buildGameContext();
      const prompt = CUSTOM_ACTION_PROMPT_TEMPLATE(context, actionText);
      callGeminiAPI(prompt);
  };

  const handleSynthesizeFragments = (fragmentIds: string[]) => {
    const fragmentsToSynthesize = state.loreFragments.filter(f => fragmentIds.includes(f.id));
    if (fragmentsToSynthesize.length < 2) return;
    const context = buildGameContext();
    const prompt = SYNTHESIZE_LORE_FRAGMENTS_PROMPT_TEMPLATE(context, fragmentsToSynthesize.map(f => f.titleHint));
    callGeminiAPI(prompt);
    // ... update history log
  };
  
  const handleAttuneToArtifact = (itemName: string) => {
    const context = buildGameContext();
    const prompt = ATTUNE_TO_ARTIFACT_PROMPT_TEMPLATE(context, itemName);
    callGeminiAPI(prompt);
    //... update history log
  };

  const handleRequestReflection = () => {
    const context = buildGameContext();
    const prompt = REQUEST_PLAYER_REFLECTION_PROMPT_TEMPLATE(context.recentHistorySummary, state.currentScene, state.playerEchoicSignature, state.characterProfile, state.currentLanguage);
    // This is a special case, we're not asking the AI to advance the game
    // We'd need a separate API call for this, or a specific mode in the backend.
    // For now, let's fake it client side or make a special Gemini call.
    // Let's assume the Core System Prompt handles this request type.
    // The AI response should just contain the `playerReflection` field.
    callGeminiAPI(prompt); // The prompt asks AI to provide reflection
  };

  const handleNameInsight = (name: string) => {
    const context = buildGameContext();
    context.playerNamedInsight = {
      originalInsight: state.insightToName!,
      chosenName: name
    };
    const prompt = CONTINUE_GAME_PROMPT_TEMPLATE(context);
    callGeminiAPI(prompt);
    dispatch({ type: 'CLEAR_INSIGHT_TO_NAME' });
  };
  
  const handleInterpretLore = (interpretation: string) => {
      dispatch({ type: 'SUBMIT_LORE_INTERPRETATION', payload: interpretation });
      const context = buildGameContext();
      context.playerInterpretedLore = {
          loreTitle: state.loreToInterpret!.title,
          chosenInterpretation: interpretation,
      };
      const prompt = CONTINUE_GAME_PROMPT_TEMPLATE(context);
      callGeminiAPI(prompt);
  };

  const handleArchetypeChoice = (archetypeId: string) => {
    dispatch({ type: 'CHOOSE_ARCHETYPE', payload: archetypeId });
    const chosenArchetype = ARCHETYPES_DATA.find(a => a.id === archetypeId)!;
    const prompt = ARCHETYPE_SELECTED_PROMPT_TEMPLATE(chosenArchetype);
    callGeminiAPI(prompt);
  };

  const handleOriginChoice = (originId: string) => {
    dispatch({ type: 'CHOOSE_ORIGIN', payload: originId });
    const chosenArchetype = ARCHETYPES_DATA.find(a => a.id === state.selectedArchetypeId)!;
    const chosenOrigin = ORIGINS_DATA.find(o => o.id === originId)!;
    const prompt = ORIGIN_SELECTED_PROMPT_TEMPLATE(chosenArchetype, chosenOrigin);
    callGeminiAPI(prompt);
  };
  
  const handleBackgroundChoice = (backgroundId: string) => {
    dispatch({ type: 'CHOOSE_BACKGROUND', payload: backgroundId });
    const chosenArchetype = ARCHETYPES_DATA.find(a => a.id === state.selectedArchetypeId)!;
    const chosenOrigin = ORIGINS_DATA.find(o => o.id === state.selectedOriginId)!;
    const chosenBackground = BACKGROUNDS_DATA.find(b => b.id === backgroundId)!;
    const prompt = BACKGROUND_SELECTED_PROMPT_TEMPLATE(chosenArchetype, chosenOrigin, chosenBackground);
    callGeminiAPI(prompt);
  };

  const handleNameSubmission = (name: string) => {
    dispatch({ type: 'SUBMIT_NAME', payload: name });
    const tempProfile: CharacterProfile = {
        archetype: ARCHETYPES_DATA.find(a => a.id === state.selectedArchetypeId)!,
        origin: ORIGINS_DATA.find(o => o.id === state.selectedOriginId)!,
        background: BACKGROUNDS_DATA.find(b => b.id === state.selectedBackgroundId)!,
        firstName: name
    };
    const prompt = NAME_SUBMITTED_PROMPT_TEMPLATE(tempProfile);
    callGeminiAPI(prompt);
  };


  useEffect(() => {
    if (!state.homeScreenImageFetchAttempted) {
      fetchHomeScreenImage();
    }
  }, [state.homeScreenImageFetchAttempted, fetchHomeScreenImage]);

  const startGameFlow = useCallback(async () => {
    dispatch({ type: 'START_GAME' });
    try {
      if (!process.env.API_KEY) {
        throw new Error(t(API_KEY_ERROR_MESSAGE_KEY));
      }
      await fetchIntroVideo();
    } catch (e: any) {
      console.error("Error starting game flow:", e);
      dispatch({ type: 'INTRO_VIDEO_FAILURE', payload: { error: e.message || String(e) } });
    }
  }, [t]);

  const renderGamePhase = () => {
      let gamePhase: GamePhase;
      if (!state.gameStarted) gamePhase = GamePhase.HomeScreen;
      else if (state.isIntroVideoLoading || state.introVideoUrl) gamePhase = GamePhase.IntroVideo;
      else if (!state.characterProfile) {
          if (!state.selectedArchetypeId) gamePhase = GamePhase.ArchetypeSelection;
          else if (!state.selectedOriginId) gamePhase = GamePhase.OriginSelection;
          else if (!state.selectedBackgroundId) gamePhase = GamePhase.BackgroundSelection;
          else if (!state.firstName) gamePhase = GamePhase.NameInput;
          else gamePhase = GamePhase.ConfirmationAndTransition;
      } else if (state.error) gamePhase = GamePhase.Error;
      else if (state.insightToName) gamePhase = GamePhase.AwaitingNameInput;
      else if (state.awaitingLoreInterpretation) gamePhase = GamePhase.AwaitingLoreInterpretation;
      else gamePhase = GamePhase.Playing;


    switch (gamePhase) {
      case GamePhase.HomeScreen:
        return (
          <>
            <HomeScreen
              t={t}
              onStartNewGame={startGameFlow}
              onOpenSettings={() => dispatch({ type: 'TOGGLE_SETTINGS_PANEL' })}
              homeScreenImageUrl={state.homeScreenImageUrl}
              isLoading={state.isHomeScreenImageLoading}
              error={state.error}
            />
            {state.showSettingsPanel && <SettingsPanel t={t} isOpen={state.showSettingsPanel} onClose={() => dispatch({ type: 'TOGGLE_SETTINGS_PANEL' })} currentTheme={document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'} onToggleTheme={() => { document.documentElement.classList.toggle('theme-dark'); localStorage.setItem('theme', document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'); }} volume={state.currentVolume} onVolumeChange={(v) => dispatch({ type: 'UPDATE_VOLUME', payload: v })} isMuted={state.isMuted} onMuteToggle={() => dispatch({ type: 'TOGGLE_MUTE' })} isColorBlindAssistActive={state.isColorBlindAssistActive} onToggleColorBlindAssist={() => { document.documentElement.classList.toggle('cb-assist-active'); localStorage.setItem('colorBlindAssist', document.documentElement.classList.contains('cb-assist-active') ? 'true' : 'false'); dispatch({ type: 'TOGGLE_COLOR_BLIND_ASSIST' }); }} currentLanguage={state.currentLanguage} onLanguageChangeAndReset={handleLanguageChangeAndReset} />}
          </>
        );
      
      case GamePhase.IntroVideo:
        return <IntroVideoPlayer
                  t={t}
                  isOpen={true}
                  videoUrl={state.introVideoUrl}
                  isLoading={state.isIntroVideoLoading}
                  loadingMessage={state.introVideoLoadingMessage}
                  onVideoEnd={() => dispatch({ type: 'INTRO_VIDEO_FAILURE', payload: { error: '' } })} // Fail to game start
                  onSkip={() => dispatch({ type: 'INTRO_VIDEO_FAILURE', payload: { error: '' } })}
                />
      
      case GamePhase.Error:
          return <ErrorDisplay t={t} error={state.error!} onDismiss={handleFullReset} startGameFlow={startGameFlow} currentLanguage={state.currentLanguage} />;

      default:
          const characterCreationPhase = [GamePhase.ArchetypeSelection, GamePhase.OriginSelection, GamePhase.BackgroundSelection, GamePhase.NameInput].includes(gamePhase);
          
          let title;
          if (characterCreationPhase) {
              title = t("Forge Your Resonance");
          } else if (state.characterProfile) {
              title = t("The Journey of {name}, the {archetype}", { name: state.characterProfile.firstName, archetype: state.characterProfile.archetype.title });
          } else {
              title = t("Resonant Echoes");
          }

          return (
            <div className="bg-primary min-h-screen text-main-color">
              <main className="container mx-auto p-4 max-w-7xl">
                <header className="text-center my-4">
                    <h1 className="font-heading text-4xl md:text-5xl text-heading-color echoic-unveil-title">{title}</h1>
                    <div className="mt-2 text-xs text-muted-color">
                        {t("A tale woven by Gemini & React.")}
                    </div>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel */}
                    <aside className="lg:col-span-1 space-y-4">
                        <RenownDisplay renown={state.renown} lastChangeNarrative={state.lastRenownNarrative} animateOnUpdate={state.lastChosenChoiceIndex !== null} />
                        <GameStatusDisplay t={t} timeOfDay={state.currentTimeOfDay} weather={state.currentWeather} inventory={state.playerInventory} onAttune={handleAttuneToArtifact} characterProfile={state.characterProfile} />
                        {state.activeDissonanceEffect && (
                            <div className="p-3 bg-secondary rounded-lg shadow border-2 border-magical-dissonance-border">
                                <h3 className="font-heading text-lg text-magical-dissonance-color mb-1">{t("Dissonance Active:")}</h3>
                                <p className="font-body text-sm text-main-color">{state.activeDissonanceEffect.description}</p>
                            </div>
                        )}
                        {state.playerConditions.length > 0 && (
                            <div className="p-3 bg-secondary rounded-lg shadow border border-divider-color">
                                <h3 className="font-heading text-lg text-accent-primary mb-1">{t("Conditions:")}</h3>
                                <ul className="list-disc list-inside text-sm text-main-color">
                                {state.playerConditions.map(c => <li key={c.type}>{c.description}</li>)}
                                </ul>
                            </div>
                        )}
                    </aside>

                    {/* Center Panel (Story & Choices) */}
                    <div className="lg:col-span-2 space-y-4">
                        <ImageDisplay t={t} imageUrl={state.currentImageUrl} altText={state.currentImagePrompt || "Game Scene"} isLoading={state.isLoading && !state.currentImageUrl} />
                         <div className="p-4 bg-secondary rounded-lg shadow-lg border border-divider-color min-h-[10rem]">
                            <h2 className="font-heading text-3xl text-heading-color border-b-2 border-divider-color pb-2 mb-3">{t("The Unfolding Path")}</h2>
                            
                            {state.isLoading && state.currentScene === "" ? (
                                <p className="text-muted-color italic">{t("The Weave Shimmers...")}</p>
                            ) : (
                              <>
                                <StoryDisplay storyText={state.currentScene} />
                                <div className="mt-6">
                                  <ChoicesDisplay 
                                      choices={state.choices} 
                                      onChoiceSelected={(choice, index) => {
                                          if (gamePhase === GamePhase.ArchetypeSelection) handleArchetypeChoice(choice);
                                          else if (gamePhase === GamePhase.OriginSelection) handleOriginChoice(choice);
                                          else if (gamePhase === GamePhase.BackgroundSelection) handleBackgroundChoice(choice);
                                          else handleChoice(choice, index);
                                      }}
                                      isLoading={state.isLoading}
                                      isTransitioning={state.isTransitioning}
                                      lastChosenIndex={state.lastChosenChoiceIndex}
                                      activeHotspots={state.activeEchoHotspots}
                                      playSound={(sound) => audioService.current.playSound(sound)}
                                  />
                                </div>
                              </>
                            )}
                         </div>
                    </div>

                    {/* Right Panel */}
                    <aside className="lg:col-span-1 space-y-4">
                        <WhisperingEchoesDisplay t={t} echoes={state.whisperingEchoes} />
                        <div className="grid grid-cols-2 gap-2">
                             <button onClick={handleSynthesizeEchoes} disabled={state.whisperingEchoes.length < 2 || state.isLoading} className="fantasy-button fantasy-button-secondary text-sm">
                                {t("Synthesize ({count})", { count: state.whisperingEchoes.length })}
                            </button>
                             <button onClick={handleFocusSenses} disabled={state.isLoading} className="fantasy-button fantasy-button-secondary text-sm">
                                {t("Focus Senses")}
                            </button>
                            <button 
                                onClick={() => {}} 
                                disabled={!state.isResonanceSurgeAvailable || state.resonanceSurgeCooldown > 0 || state.isLoading} 
                                className={`fantasy-button fantasy-button-secondary text-sm ${state.isResonanceSurgeAvailable && state.resonanceSurgeCooldown === 0 ? 'resonance-surge-ready-pulse' : ''}`}
                                >
                                {state.isResonanceSurgeAvailable && state.resonanceSurgeCooldown === 0 ? t("Resonance Surge") : t("Surge (CD: {cooldown})", { cooldown: state.resonanceSurgeCooldown })}
                            </button>

                            <button onClick={handleRequestReflection} disabled={state.isLoading} className="fantasy-button fantasy-button-secondary text-sm">
                                {state.isLoading ? t("Pondering...") : t("Ponder Moment")}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => dispatch({ type: 'LORE_JOURNAL_TOGGLE' })} className="fantasy-button fantasy-button-primary text-sm">
                                {t("Tome ({count})", { count: state.loreJournal.length })}
                            </button>
                             <button onClick={() => dispatch({ type: 'HISTORY_LOG_TOGGLE' })} className="fantasy-button fantasy-button-primary text-sm">
                                {t("Path Taken ({count})", { count: state.historyLog.length })}
                            </button>
                            <button onClick={() => dispatch({ type: 'PLAYER_NOTES_TOGGLE' })} className="fantasy-button fantasy-button-primary text-sm">
                                {t("My Journal ({count})", { count: state.playerNotes.length })}
                            </button>
                            <button onClick={() => dispatch({ type: 'MAP_TOGGLE' })} className="fantasy-button fantasy-button-primary text-sm">
                                {t("Map")}
                            </button>
                        </div>
                    </aside>
                </div>
                <footer className="text-center text-xs text-muted-color mt-8 py-4 border-t border-divider-color">
                    <p>{t("Resonant Echoes. Created with Gemini & React.")}</p>
                    <p>{t("Fonts: MedievalSharp & EB Garamond by Google Fonts.")}</p>
                </footer>
              </main>
              {state.showSettingsPanel && <SettingsPanel t={t} isOpen={state.showSettingsPanel} onClose={() => dispatch({ type: 'TOGGLE_SETTINGS_PANEL' })} currentTheme={document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'} onToggleTheme={() => { document.documentElement.classList.toggle('theme-dark'); localStorage.setItem('theme', document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'); }} volume={state.currentVolume} onVolumeChange={(v) => dispatch({ type: 'UPDATE_VOLUME', payload: v })} isMuted={state.isMuted} onMuteToggle={() => dispatch({ type: 'TOGGLE_MUTE' })} isColorBlindAssistActive={state.isColorBlindAssistActive} onToggleColorBlindAssist={() => { document.documentElement.classList.toggle('cb-assist-active'); localStorage.setItem('colorBlindAssist', document.documentElement.classList.contains('cb-assist-active') ? 'true' : 'false'); dispatch({ type: 'TOGGLE_COLOR_BLIND_ASSIST' }); }} currentLanguage={state.currentLanguage} onLanguageChangeAndReset={handleLanguageChangeAndReset} />}
              <LoreJournal t={t} loreEntries={state.loreJournal} loreFragments={state.loreFragments} isOpen={state.showLoreJournalModal} onToggle={() => dispatch({ type: 'LORE_JOURNAL_TOGGLE' })} newestEntryId={state.newestLoreEntryId} onSynthesizeFragments={handleSynthesizeFragments} />
              <HistoryLog t={t} historyLog={state.historyLog} isOpen={state.showHistoryLogModal} onToggle={() => dispatch({ type: 'HISTORY_LOG_TOGGLE' })} />
              <DreamRumorDisplay t={t} dreamOrVision={state.dreamOrVisionToDisplay} rumors={state.currentRumors} onDismissDream={() => dispatch({ type: 'DISMISS_DREAM_VISION' })} />
              {state.awaitingLoreInterpretation && state.loreToInterpret && <LoreInterpretationModal t={t} loreTitle={state.loreToInterpret.title} interpretations={state.loreToInterpret.interpretations} onSubmit={handleInterpretLore} onCancel={() => dispatch({ type: 'CANCEL_LORE_INTERPRETATION' })} />}
              <PlayerNotesModal t={t} isOpen={state.showPlayerNotesModal} onClose={() => dispatch({ type: 'PLAYER_NOTES_TOGGLE' })} notes={state.playerNotes} 
                onAddNote={(note) => dispatch({ type: 'ADD_PLAYER_NOTE', payload: note })}
                onUpdateNote={(note) => dispatch({ type: 'UPDATE_PLAYER_NOTE', payload: note })}
                onDeleteNote={(id) => dispatch({ type: 'DELETE_PLAYER_NOTE', payload: id })}
              />
              <MapModal t={t} isOpen={state.showMapModal} onClose={() => dispatch({ type: 'MAP_TOGGLE' })} locations={state.discoveredLocations} currentLocationId={state.currentLocationId} />
              <EchoWeavingModal t={t} isOpen={state.showEchoWeavingModal} onClose={() => dispatch({ type: 'ECHO_WEAVING_TOGGLE' })} echoes={state.whisperingEchoes} onSynthesize={handleSynthesizeEchoes} />
              <LoadingIndicator isLoading={state.isLoading && state.gameStarted && state.characterProfile != null} t={t} />
            </div>
          );
    }
  };

  return (
    <div className={`font-body bg-primary text-main-color min-h-screen selection:bg-accent-primary selection:text-white ${state.isColorBlindAssistActive ? 'cb-assist-active' : ''}`}>
      {renderGamePhase()}
    </div>
  );
};

export default App;
