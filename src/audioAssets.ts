/**
 * @fileoverview Central repository for audio assets.
 * All URLs point to free, non-copyrighted sound effects and music tracks
 * from Pixabay, under their content license which allows for free
 * commercial and non-commercial use.
 */

export const audioAssets = {
  sfx: {
    UI_CLICK: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2491f422c1.mp3', // A simple, clean click
    UI_CLICK_SUBTLE: 'https://cdn.pixabay.com/audio/2021/08/04/audio_dea515de5b.mp3', // Softer click
    CHOICE_HOVER: 'https://cdn.pixabay.com/audio/2022/01/21/audio_eb27b1a7a4.mp3', // A very light whoosh/hover
    CHOICE_SELECTED: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c841e97453.mp3', // Confirming, slightly magical
    UI_CONFIRM: 'https://cdn.pixabay.com/audio/2022/11/17/audio_88c72a6429.mp3', // Positive chime
    UI_CANCEL: 'https://cdn.pixabay.com/audio/2022/03/10/audio_31b16c6d37.mp3', // Negative/cancel sound
    GAME_START: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884877995d.mp3', // Mystical reveal
    VIDEO_READY: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884877995d.mp3', // Mystical reveal
    AI_RESPONSE_RECEIVED: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d70a74c30a.mp3', // Page turn
    IMAGE_GENERATED: 'https://cdn.pixabay.com/audio/2022/05/26/audio_f5427d1421.mp3', // Subtle magical shimmer
    RENOWN_CHANGED: 'https://cdn.pixabay.com/audio/2023/05/28/audio_8f4f9f7a70.mp3', // Short fanfare/success
    LORE_UNLOCKED: 'https://cdn.pixabay.com/audio/2022/02/07/audio_2f0a89a054.mp3', // Magical chime/unlock
    LORE_FRAGMENT_FOUND: 'https://cdn.pixabay.com/audio/2022/09/20/audio_55061a72a1.mp3', // A single magical note
    PLAYER_REFLECTION_ADDED: 'https://cdn.pixabay.com/audio/2022/11/20/audio_16c84c1773.mp3', // Writing sound
    LOCATION_DISCOVERED: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884877995d.mp3', // Mystical reveal again, good for discovery
    SYNTHESIZE_ATTEMPT: 'https://cdn.pixabay.com/audio/2023/10/06/audio_a124031b46.mp3', // Swirling magic
    FOCUS_SENSES_ATTEMPT: 'https://cdn.pixabay.com/audio/2024/02/24/audio_3da7137f81.mp3', // Deep hum/focus sound
    RESONANCE_SURGE_ACTIVATE: 'https://cdn.pixabay.com/audio/2023/09/24/audio_3342b5889e.mp3', // Power up sound
    SURGE_EFFECT_APPLIED: 'https://cdn.pixabay.com/audio/2022/10/24/audio_39d91f5358.mp3', // Big magical impact
    SURGE_READY: 'https://cdn.pixabay.com/audio/2022/10/24/audio_f0a89b09b5.mp3', // A gentle "ready" chime
    ECHOES_CLEARED: 'https://cdn.pixabay.com/audio/2022/08/03/audio_51cf530e0a.mp3', // Gentle dissipation
    NEW_ECHO_PERCEIVED: 'https://cdn.pixabay.com/audio/2022/03/13/audio_29b3c43339.mp3', // Whisper sound
    ITEM_GRANTED: 'https://cdn.pixabay.com/audio/2022/04/07/audio_474431a473.mp3', // "Item get" sound
    PLAYER_CONDITION_UPDATE: 'https://cdn.pixabay.com/audio/2023/05/23/audio_4378435d28.mp3', // Muffled heartbeat / negative effect
  },
  music: {
    // Calm, serene, for shrines, peaceful moments
    CALM: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde648d99.mp3',
    // Default ambient, neutral exploration
    AMBIENT: 'https://cdn.pixabay.com/audio/2023/11/23/audio_85d18b3b42.mp3',
    // Tense, danger, dissonance
    TENSE: 'https://cdn.pixabay.com/audio/2022/11/22/audio_2c8a834114.mp3',
    // Mystery, lore discovery, contemplation
    MYSTERY: 'https://cdn.pixabay.com/audio/2022/05/27/audio_14cd3d6a4a.mp3',
  }
};

export type MusicTheme = keyof typeof audioAssets.music;
