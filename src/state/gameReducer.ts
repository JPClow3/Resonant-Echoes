import { GameState, HistoryEntry, CharacterProfile, PlayerNote } from '../types';
import { Action } from './actions';
import { ARCHETYPES_DATA, ORIGINS_DATA, BACKGROUNDS_DATA } from '../data/characterCreation';

export const HISTORY_LOG_CAP = 50;

export const initialState: GameState = {
  currentScene: '',
  streamingSceneText: null,
  storySummary: null,
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
  newestLoreEntryId: null,
  currentVolume: 70,
  isMuted: false,
  isColorBlindAssistActive: false,
  playerInventory: {},
  lastChosenChoiceIndex: null,
  currentRumors: [],
  dreamOrVisionToDisplay: null,
  awaitingLoreInterpretation: false,
  loreToInterpret: undefined,
  activeDissonanceEffect: null,
  playerConditions: [],
  echoicBlightInScene: null,
  activeMemoryPhantoms: [],
  activeDissonantAberrations: [],
  devouringSilenceZoneInScene: null,
  activeEchoHotspots: [],
  playerNotes: [],
  mindMapLayout: { positions: {}, links: [] },
  isResonanceSurgeAvailable: true,
  resonanceSurgeCooldown: 0,
  currentLanguage: 'en',
  activeModal: null,
  discoveredLocations: [],
  currentLocationId: null,
  introVideoUrl: null,
  isIntroVideoLoading: false,
  introVideoLoadingMessage: '',
  isTransitioning: false,
};

export const saveGameStateToLocalStorage = (state: GameState) => {
    try {
        const stateToSave: Partial<GameState> = {
            characterProfile: state.characterProfile,
            choices: state.choices,
            currentImagePrompt: state.currentImagePrompt,
            currentImageUrl: state.currentImageUrl,
            currentLanguage: state.currentLanguage,
            currentLocationId: state.currentLocationId,
            currentRumors: state.currentRumors,
            currentScene: state.currentScene,
            currentSoundscape: state.currentSoundscape,
            currentTimeOfDay: state.currentTimeOfDay,
            currentVolume: state.currentVolume,
            currentWeather: state.currentWeather,
            discoveredLocations: state.discoveredLocations,
            factionReputationNotes: state.factionReputationNotes,
            firstName: state.firstName,
            gameStarted: state.gameStarted,
            historyLog: state.historyLog,
            isColorBlindAssistActive: state.isColorBlindAssistActive,
            isMuted: state.isMuted,
            isResonanceSurgeAvailable: state.isResonanceSurgeAvailable,
            loreFragments: state.loreFragments,
            loreJournal: state.loreJournal,
            playerConditions: state.playerConditions,
            playerEchoicSignature: state.playerEchoicSignature,
            playerInventory: state.playerInventory,
            playerNotes: state.playerNotes,
            renown: state.renown,
            resonanceSurgeCooldown: state.resonanceSurgeCooldown,
            selectedArchetypeId: state.selectedArchetypeId,
            selectedBackgroundId: state.selectedBackgroundId,
            selectedOriginId: state.selectedOriginId,
            storySummary: state.storySummary,
            whisperingEchoes: state.whisperingEchoes,
            mindMapLayout: state.mindMapLayout,
        };
        const serializedState = JSON.stringify(stateToSave);
        localStorage.setItem('resonantEchoes_gameState', serializedState);
    } catch (error) {
        console.error("Could not save game state to localStorage:", error);
    }
};


export const initializeState = (initialState: GameState): GameState => {
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

export const gameReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case 'START_GAME':
            return { ...state, gameStarted: true, isLoading: true, error: null, introVideoUrl: null, isIntroVideoLoading: true, introVideoLoadingMessage: '' };
        case 'RESET_GAME':
            localStorage.removeItem('resonantEchoes_gameState');
            return { ...initialState, apiKeyMissing: state.apiKeyMissing, homeScreenImageUrl: state.homeScreenImageUrl, activeDissonantAberrations: [] };
        case 'INITIALIZE_GAME_STATE':
            return { ...action.payload, activeEchoHotspots: action.payload.activeEchoHotspots || [], activeDissonantAberrations: action.payload.activeDissonantAberrations || [] };
        
        // UI AND SETTINGS
        case 'API_CALL_START':
            return { ...state, isLoading: true, error: null, streamingSceneText: '', choices: [] };
        case 'STREAMING_TEXT_UPDATE':
            return { ...state, streamingSceneText: action.payload };
        case 'API_CALL_FAILURE':
            return { ...state, isLoading: false, isTransitioning: false, error: action.payload, streamingSceneText: null };
        case 'SET_IMAGE_URL':
            return { ...state, currentImageUrl: action.payload, isHomeScreenImageLoading: false };
        case 'IMAGE_GENERATION_START':
            return { ...state, isHomeScreenImageLoading: true };
        case 'SET_HOME_SCREEN_IMAGE_LOADING':
            return { ...state, isHomeScreenImageLoading: action.payload, homeScreenImageFetchAttempted: true };
        case 'SET_HOME_SCREEN_IMAGE_URL':
            return { ...state, homeScreenImageUrl: action.payload.url, isHomeScreenImageLoading: false, error: action.payload.error || null };
        case 'UPDATE_VOLUME':
            return { ...state, currentVolume: action.payload, isMuted: action.payload === 0 };
        case 'TOGGLE_MUTE':
            return { ...state, isMuted: !state.isMuted };
        case 'TOGGLE_COLOR_BLIND_ASSIST':
            return { ...state, isColorBlindAssistActive: !state.isColorBlindAssistActive };
        case 'SET_ACTIVE_MODAL':
            return { ...state, activeModal: action.payload, newestLoreEntryId: action.payload !== 'lore' ? state.newestLoreEntryId : null };
        case 'SET_LAST_CHOICE':
            return { ...state, lastChosenChoiceIndex: action.payload };
        case 'DISMISS_DREAM_VISION':
            return { ...state, dreamOrVisionToDisplay: null };
        case 'INTRO_VIDEO_START':
            return { ...state, isIntroVideoLoading: true, introVideoLoadingMessage: action.payload.message };
        case 'INTRO_VIDEO_LOADING_UPDATE':
            return { ...state, introVideoLoadingMessage: action.payload.message };
        case 'INTRO_VIDEO_SUCCESS':
            return { ...state, isIntroVideoLoading: false, introVideoUrl: action.payload.url };
        case 'INTRO_VIDEO_FAILURE':
            return { ...state, isIntroVideoLoading: false, introVideoUrl: null, gameStarted: true, error: null, isLoading: false };
        case 'SET_LANGUAGE':
            const settingsToPreserve = {
                currentVolume: state.currentVolume,
                isMuted: state.isMuted,
                isColorBlindAssistActive: state.isColorBlindAssistActive,
                homeScreenImageUrl: state.homeScreenImageUrl,
            };
            localStorage.removeItem('resonantEchoes_gameState');
            return { ...initialState, ...settingsToPreserve, currentLanguage: action.payload };
        
        // CHARACTER CREATION
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
        
        // PLAYER NOTES & JOURNAL
        case 'ADD_PLAYER_NOTE':
            const newNote: PlayerNote = { id: `note_${new Date().toISOString()}_${Math.random()}`, timestamp: new Date().toISOString(), ...action.payload };
            const newPositions = { ...state.mindMapLayout.positions };
            const noteNodeId = `note_${newNote.id}`;
            const existingNodesCount = Object.keys(newPositions).length;
            newPositions[noteNodeId] = { x: 50 + (existingNodesCount % 5) * 20, y: 50 + Math.floor(existingNodesCount / 5) * 120 };
            return { ...state, playerNotes: [...state.playerNotes, newNote], mindMapLayout: { ...state.mindMapLayout, positions: newPositions } };
        case 'UPDATE_PLAYER_NOTE':
            return { ...state, playerNotes: state.playerNotes.map(n => n.id === action.payload.id ? action.payload : n) };
        case 'DELETE_PLAYER_NOTE':
            const noteIdToDelete = `note_${action.payload}`;
            const updatedPositions = { ...state.mindMapLayout.positions };
            delete updatedPositions[noteIdToDelete];
            const updatedLinks = state.mindMapLayout.links.filter(link => link.from !== noteIdToDelete && link.to !== noteIdToDelete);
            return { 
                ...state, 
                playerNotes: state.playerNotes.filter(n => n.id !== action.payload),
                mindMapLayout: { positions: updatedPositions, links: updatedLinks }
            };
        case 'UPDATE_MIND_MAP_LAYOUT':
            return { ...state, mindMapLayout: action.payload };

        // WORLD & GAMEPLAY STATE
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

            const cappedHistoryLog = [...state.historyLog, newHistoryEntry].slice(-HISTORY_LOG_CAP);
            
            const nextState = {
                ...state,
                isLoading: false,
                streamingSceneText: null,
                currentScene: data.scene,
                choices: data.choices || [],
                currentImagePrompt: data.imagePrompt === null ? state.currentImagePrompt : (data.imagePrompt || state.currentImagePrompt),
                whisperingEchoes: data.whisperingEchoes || [],
                loreJournal: data.newLore ? [...state.loreJournal, ...data.newLore] : state.loreJournal,
                newestLoreEntryId: data.newLore && data.newLore.length > 0 ? data.newLore[data.newLore.length - 1].id : null,
                loreFragments: updatedFragments,
                currentSoundscape: data.soundscape || state.currentSoundscape,
                playerEchoicSignature: data.initialPlayerEchoicSignature || data.playerEchoicSignatureUpdate || state.playerEchoicSignature,
                factionReputationNotes: data.factionUpdates ? { ...state.factionReputationNotes, ...data.factionUpdates } : state.factionReputationNotes,
                renown: data.renownChangeAmount !== undefined ? state.renown + data.renownChangeAmount : state.renown,
                lastRenownNarrative: data.renownChangeNarrative || state.lastRenownNarrative,
                historyLog: cappedHistoryLog,
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
                activeDissonantAberrations: data.dissonantAberrationsInScene || [],
                characterProfile: data.confirmedProfileSummary && state.characterProfile ? { ...state.characterProfile } : state.characterProfile,
                activeEchoHotspots: data.activeEchoHotspots || [],
                resonanceSurgeCooldown: data.suggestedResonanceSurgeCooldown !== undefined ? data.suggestedResonanceSurgeCooldown : state.resonanceSurgeCooldown,
                isResonanceSurgeAvailable: data.suggestedResonanceSurgeCooldown !== undefined ? false : state.isResonanceSurgeAvailable,
                discoveredLocations: data.newLocationDiscovered ? [...state.discoveredLocations.filter(l => l.id !== data.newLocationDiscovered!.id), data.newLocationDiscovered] : state.discoveredLocations,
                currentLocationId: data.newLocationDiscovered ? data.newLocationDiscovered.id : state.currentLocationId,
            };
            saveGameStateToLocalStorage({ ...nextState });
            return nextState;
        
        case 'ADD_HISTORY_ENTRY':
            return { ...state, historyLog: [...state.historyLog, action.payload].slice(-HISTORY_LOG_CAP) };
        
        case 'SUMMARIZE_HISTORY_SUCCESS':
            const summaryHistoryEntry: HistoryEntry = {
                id: `hist_summary_${new Date().toISOString()}`,
                sceneSummary: "The chronicle was summarized for clarity.",
                fullSceneText: `New Summary: ${action.payload}`,
                timestamp: new Date().toISOString(),
                type: 'summary'
            };
            return { ...state, storySummary: action.payload, historyLog: [...state.historyLog, summaryHistoryEntry] };
        
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
        case 'SUBMIT_LORE_INTERPRETATION':
            return { ...state, awaitingLoreInterpretation: false, loreToInterpret: undefined };
        case 'CANCEL_LORE_INTERPRETATION':
            return { ...state, awaitingLoreInterpretation: false, loreToInterpret: undefined };
        case 'CLEAR_INSIGHT_TO_NAME':
            return { ...state, insightToName: null };
            
        default:
            return state;
    }
};
