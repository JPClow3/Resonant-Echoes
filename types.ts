
export interface WhisperingEchoDetail {
  id: string;
  text: string;
  intensityHint: 'Faint' | 'Clear' | 'Strong' | 'Overwhelming' | 'Chaotic';
  typeHint: string; // e.g., Emotion, Past Event, Warning, Primordial, Architect, FloraEcho, FaunaEcho, EchoicBlightSource, MemoryPhantomFragment, DevouringSilenceEcho, LithicMemoryShard, ArchitectKeyResonance, CorruptedHistory, DissonantProphecy
  originHint?: string | null;
  emotionalUndercurrent?: string | null;
  durationHint?: 'Fleeting' | 'Brief' | 'Lingering' | 'Persistent' | 'ancient' | 'cyclical' | null;
  dominantSensation?: 'sight' | 'sound' | 'smell' | 'touch' | 'emotion' | 'prescience' | 'other' | null;
  clarity?: 'vivid' | 'muddled' | 'fragmented' | 'cryptic' | null;
  taste?: string;
  dissonanceFlavor?: 'Volatile' | 'Fragmented' | 'Illusory' | 'Consuming' | 'Warping' | null;
  weavingCost?: {
    type: 'SensoryDulling' | 'Headache' | 'EchoicFeedback' | 'SignatureInstability' | 'SanityStrain';
    narrativeDescription: string;
  } | null;
}

export interface LoreEntryData {
  id: string;
  title: string;
  content: string;
  context: string;
  discoveryMethod?: string;
  triggeringChoice?: string;
  playerGivenName?: string;
  timestamp: string;
  isEchoicHeirloom?: boolean;
  relatedFaction?: string;
}

export interface LoreFragmentData {
  id: string;
  titleHint: string;
  contentFragment: string;
  originHint?: string;
  relatedLoreIdHint?: string;
  timestamp: string;
  linkedToFullLoreId?: string;
}

export interface PlayerInventoryItem {
  count: number;
  description?: string;
  artifactEchoes?: WhisperingEchoDetail[]; // All potential echoes in the artifact
  knownArtifactEchoes?: WhisperingEchoDetail[]; // Echoes specifically discovered by the player
  isEchoicHeirloom?: boolean;
  heirloomLoreId?: string;
  // New specific item types could be conceptualized here if needed
  // e.g. itemType: 'ResonanceLens' | 'HeartstoneShard' | 'DissonantCrystal' | 'WovenCharm' | 'DowsingRod';
}

export interface HistoryEntry {
  id: string;
  sceneSummary: string;
  choiceMade?: string;
  timestamp: string;
  fullSceneText: string;
  type: 'story' | 'choice' | 'named_insight' | 'reflection' | 'lore_synthesis' | 'artifact_attunement' | 'echo_weaving_cost' | 'dissonance_encounter' | 'character_creation' | 'focused_perception' | 'resonance_surge' | 'hotspot_interaction';
}

export interface FactionUpdate {
  [factionName: string]: string; // Narrative description of reputation change
}

export interface EchoicBlight {
  id: string;
  name: string;
  blightFlavor: 'TimeFragmentation' | 'EmotionalCorruption' | 'SensoryWarp' | 'SilenceSpread';
  sensoryImpact: string; // e.g., "Air crackles with temporal distortions", "Overwhelming despair hangs heavy"
  effectOnWeaving: string; // e.g., "Echoes here are unstable and prone to backlash", "Weaving the Silence is amplified but dangerous"
}

export interface MemoryPhantom {
  id: string;
  name: string; // e.g., "The Sorrowful Guardian," "The Enraged Warrior Echo"
  phantomNature: 'Sorrowful' | 'Aggressive' | 'Confused' | 'Protective' | 'Whispering';
  echoicCoreText: string; // The core echo/memory it embodies
  appearanceDescription: string;
}

export interface DevouringSilenceZone {
  id: string;
  name: string;
  silenceIntensity: 'FaintWhisper' | 'MufflingAura' | 'EchoVoid';
  effectOnResonance: string; // e.g., "Echoes are muted and difficult to perceive", "Resonance Weaving abilities are nullified"
  sensoryDeprivationDetails: string;
}

export interface ResonanceFloraFauna {
  id: string;
  name: string;
  type: 'ResonanceBloom' | 'EchoMimicFauna' | 'StoneSongLichen';
  description: string;
  echoicProperty: string; // e.g., "Emits a calming, harmonic echo", "Mimics the strongest nearby emotional echo"
}

export interface ArchitecturalEchoDetail {
  structureName: string;
  alienGeometry?: boolean;
  materialComposition?: string; // e.g., "Obsidian and Living Crystal"
  primordialResonance?: string; // e.g., "Hums with the First Song's power"
}

export interface DissonanceEffect {
  type: 'EchoicBlightPresence' | 'MemoryPhantomEncounter' | 'DevouringSilenceZoneActive' | 'DissonanceStorm';
  description: string;
  mechanicalEffect?: string;
  relatedEntityId?: string; // ID of the specific Blight, Phantom, or Zone
}

export interface PlayerTemporaryCondition {
  type: 'SensoryDulling' | 'Headache' | 'SignatureInstability' | 'SanityStrain' | 'EchoSickness' | 'ResonanceBurn' | 'SensoryOverwhelm' | 'DissonantWhispers' | 'SensoryFocusFatigue';
  description: string;
  durationTurns?: number;
}

// --- Character Creation Profile Types ---
export interface BackgroundBenefit {
  description: string; // e.g., "Enhanced perception of 'Fleeting' echoes."
  signatureEffect?: string; // Text to add to initial playerEchoicSignature
  startingLoreId?: string; // ID of a specific lore entry from constants
  startingItemId?: string; // ID of a starting item
  startingItemDescription?: string;
}

export interface BackgroundProfile {
  id: string;
  title: string;
  description: string;
  benefit: BackgroundBenefit;
  originId: string; // Added to link background to its origin
}

export interface OriginProfile {
  id: string;
  name: string;
  description: string;
  availableBackgrounds: string[]; // Array of BackgroundProfile IDs
  archetypeId: string; // Added to link origin to its archetype
}

export interface ArchetypeProfile {
  id: string;
  title: string;
  description: string;
  availableOrigins: string[]; // Array of OriginProfile IDs
}

export interface CharacterProfile {
  archetype: ArchetypeProfile;
  origin: OriginProfile;
  background: BackgroundProfile;
  firstName: string;
}
// --- End Character Creation Profile Types ---

export interface PlayerNote {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  tags?: string[];
  linkedLoreIds?: string[];
}

export interface EchoHotspot {
  id: string; // Unique ID for this hotspot instance in the scene
  name: string; // Name of the hotspot, e.g., "Ancient Shrine Carving"
  description?: string; // Optional longer description if AI provides
  visualHint?: string; // Text hint for UI if we decide to add visual cues, e.g., "faintly glows"
  interactionPrompt?: string; // Suggested text for a choice, e.g., "Examine the glowing carving"
}

export interface GeminiResponseData {
  scene: string;
  choices: string[];
  imagePrompt?: string; // Made optional
  whisperingEchoes?: WhisperingEchoDetail[];
  newLore?: LoreEntryData[];
  loreFragments?: LoreFragmentData[];
  soundscape?: string;
  playerEchoicSignatureUpdate?: string;
  factionUpdates?: FactionUpdate;
  renownChangeAmount?: number;
  renownChangeNarrative?: string;
  
  // Character Creation specific
  expectsPlayerInputForName?: boolean; // Used after background selection
  profileChoices?: { // Used by AI to present choices narratively
    archetypes?: { id: string, title: string, description: string }[];
    origins?: { id: string, name: string, description: string }[];
    backgrounds?: { id: string, title: string, description: string, benefitDescription: string }[];
  };
  confirmedProfileSummary?: string; // AI confirms the full profile before game starts
  initialPlayerEchoicSignature?: string; // AI sets this based on profile

  namedInsightContext?: string;
  clearActiveEchoesOnSuccess?: boolean;
  interpretiveChoicesForInsight?: string[];
  offerToNameInsight?: boolean;
  currentTimeOfDay?: string;
  currentWeather?: string;
  newItemsGranted?: Record<string, PlayerInventoryItem>; // Key is item name/id
  playerReflection?: string;
  rumorMillUpdate?: string;
  playerDreamOrVision?: string;
  interpretiveChoicesForLore?: { loreId: string; title: string; interpretations: string[] };
  
  dissonanceEffectInScene?: DissonanceEffect;
  playerConditionUpdate?: PlayerTemporaryCondition;

  // New detailed world elements
  echoicBlightInScene?: EchoicBlight;
  memoryPhantomsInScene?: MemoryPhantom[];
  devouringSilenceZoneInScene?: DevouringSilenceZone;
  observedFloraFauna?: ResonanceFloraFauna[];
  architecturalDetails?: ArchitecturalEchoDetail;
  activeEchoHotspots?: EchoHotspot[]; // New for Echo Hotspots

  // Resonance Surge
  suggestedResonanceSurgeCooldown?: number;
}

export interface GameState {
  currentScene: string;
  currentImagePrompt: string | null; // Can now be null if AI doesn't send one
  currentImageUrl: string | null;
  choices: string[];
  isLoading: boolean;
  error: string | null;
  loreJournal: LoreEntryData[];
  loreFragments: LoreFragmentData[];
  historyLog: HistoryEntry[];
  whisperingEchoes: WhisperingEchoDetail[];
  currentSoundscape: string;
  playerEchoicSignature: string;
  factionReputationNotes: FactionUpdate;
  apiKeyMissing: boolean;
  gameStarted: boolean; // True after character creation is complete and first story scene loaded
  renown: number;
  lastRenownNarrative: string | null;
  
  // Character Creation State
  firstName: string | null;
  selectedArchetypeId: string | null;
  selectedOriginId: string | null;
  selectedBackgroundId: string | null;
  characterProfile: CharacterProfile | null; // Stores the final confirmed profile

  insightToName: string | null; // For when player needs to name an insight
  homeScreenImageUrl: string | null; 
  isHomeScreenImageLoading?: boolean;
  homeScreenImageFetchAttempted: boolean; 
  showSettingsPanel: boolean;
  showLoreJournalModal: boolean;
  newestLoreEntryId: string | null;
  showHistoryLogModal: boolean;
  currentVolume: number; 
  isMuted: boolean;
  isColorBlindAssistActive: boolean;
  currentTimeOfDay?: string;
  currentWeather?: string;
  playerInventory: Record<string, PlayerInventoryItem>; // Key is item name/id
  lastChosenChoiceIndex: number | null;
  currentRumors: string[];
  dreamOrVisionToDisplay: string | null;
  awaitingLoreInterpretation: boolean;
  loreToInterpret?: { loreId: string; title: string; interpretations: string[] };

  activeDissonanceEffect?: DissonanceEffect | null;
  playerConditions: PlayerTemporaryCondition[];
  
  echoicBlightInScene?: EchoicBlight | null;
  activeMemoryPhantoms: MemoryPhantom[];
  devouringSilenceZoneInScene?: DevouringSilenceZone | null;
  activeEchoHotspots?: EchoHotspot[]; // New for Echo Hotspots

  // Player Notes
  playerNotes: PlayerNote[];
  showPlayerNotesModal: boolean;

  // Resonance Surge
  isResonanceSurgeAvailable: boolean;
  resonanceSurgeCooldown: number; // Number of turns until available

  // Language
  currentLanguage: 'en' | 'pt';
}

export interface GameContextForAI {
  // Character Profile (Populated after creation)
  characterProfile?: {
    archetypeTitle: string;
    originName: string;
    backgroundTitle: string;
    firstName: string;
    startingBenefitDescription: string;
  } | null;

  // Existing context
  lastPlayerChoice?: string;
  recentHistorySummary: string;
  knownLoreTitles: string[];
  knownLoreFragmentTitles?: string[];
  activeEchoesTexts: string[];
  playerEchoicSignature: string;
  factionReputationNotes: FactionUpdate;
  currentRenown: number;
  currentTimeOfDay?: string;
  currentWeather?: string;
  playerInventory?: Record<string, {
    count: number;
    description?: string;
    hasUndiscoveredEchoes: boolean;
    isEchoicHeirloom?: boolean;
    heirloomLoreId?: string;
    knownArtifactEchoesSummary?: string[]; // Summaries of known echoes for display to AI
    untappedArtifactEchoesCount?: number;  // Count of echoes not yet known
  }>;
  currentRumors?: string[];
  tutorialFlags?: {
    loreJournalFirstOpen?: boolean;
    historyLogFirstOpen?: boolean;
    whisperingEchoesFirstExplained?: boolean;
    synthesisFirstAvailable?: boolean;
    loreFragmentsFirstFound?: boolean;
    artifactAttunementFirstAvailable?: boolean;
    echoicBlightFirstEncountered?: boolean;
    memoryPhantomFirstEncountered?: boolean;
    devouringSilenceFirstEncountered?: boolean;
  };
  playerNamedInsight?: {
    originalInsight: string;
    chosenName: string;
  };
  playerInterpretedLore?: {
    loreTitle: string;
    chosenInterpretation: string;
  };
  currentActiveDissonanceEffect?: string | null;
  currentPlayerConditions?: string[]; // Array of condition descriptions
  activeEchoHotspotsSummary?: { id: string, name: string }[]; // Summary of currently known hotspots
  previouslyInteractedHotspotIds?: string[]; // IDs of hotspots already interacted with
  isResonanceSurgeAvailable?: boolean; // Let AI know if it's usable
  resonanceSurgeCooldownTurnsLeft?: number;

  // Language
  language: 'en' | 'pt';
}

export enum GamePhase {
  HomeScreen,
  // Character Creation Phases
  ArchetypeSelection,
  OriginSelection,
  BackgroundSelection,
  NameInput,
  ConfirmationAndTransition, // AI confirms profile & generates first story scene
  // Main Gameplay
  Playing,
  Error,
  AwaitingNameInput, // This is for in-game insights, not character name
  AwaitingLoreInterpretation,
}
