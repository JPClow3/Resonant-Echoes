

import { GameContextForAI, ArchetypeProfile, OriginProfile, BackgroundProfile, CharacterProfile } from './types';

export const GEMINI_NARRATIVE_MODEL = 'gemini-2.5-flash';
export const IMAGEN_IMAGE_MODEL = 'imagen-3.0-generate-002';
export const VEO_VIDEO_MODEL = 'veo-2.0-generate-001';

export const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/seed/fantasyquest/800/600';
export const PLACEHOLDER_HOME_SCREEN_IMAGE_URL = 'https://picsum.photos/seed/atheneum/1200/800';

export const INTRO_VIDEO_PROMPT = `A short, cinematic, epic fantasy video.
Scene 1: A sweeping shot over a vast, mist-filled valley at twilight. Gigantic, ancient, silent statues of unknown origin are half-buried in the landscape.
Scene 2: A close-up of an ancient, weathered tome, its pages filled with glowing runes. A single drop of light falls onto the page, causing ripples of energy to spread across it.
Scene 3: A shot of a lone figure, their face obscured by shadow, standing on a precipice looking out at a sky where the constellations are slowly, subtly dimming. A single, faint, sad musical note is heard.
Scene 4: The view zooms into the figure's eye, which reflects the fading stars. The screen fades to black.
The overall mood should be mysterious, melancholic, and epic. High fantasy art style. No text. 15-20 seconds.
`;

export const HOME_SCREEN_IMAGE_PROMPT = `Epic fantasy art, a grand oak desk in an ancient library, bathed in soft window light. An open, rune-etched tome dominates the desk, its pages filled with elegant script and one illuminated illustration. Alongside it, a softly glowing crystal, scattered scrolls with wax seals, an ornate inkwell and quill. Highly detailed, cinematic lighting, warm and inviting atmosphere, masterpiece, intricate details, atmospheric.`;

// --- CHARACTER CREATION DATA ---
const archetypesArray: ArchetypeProfile[] = [
  {
    id: 'scholar', title: 'The Attuned Scholar',
    description: "You seek understanding in ancient texts and the celestial symphony of Creation Harmonies, believing knowledge and meticulous observation are the keys to mending the Weave and understanding the Echoes.",
    availableOrigins: ['origin_scholar_archives', 'origin_scholar_observatory'],
  },
  {
    id: 'warden', title: 'The Sylvan Empath',
    description: "Your heart beats in rhythm with the wild places. You find truth in the rustle of leaves, the silent language of beasts, and the subtle flow of the Great Weave of Life, seeking to protect its fragile balance.",
    availableOrigins: ['origin_warden_heartwood', 'origin_warden_fen'],
  },
  {
    id: 'artisan', title: 'The Stone-Bound Artisan',
    description: "Your spirit is as unyielding as the mountains. You find wisdom in the deep places of the earth and can shape raw potential into enduring strength, hearing the Lithic Echoes of your ancestors.",
    availableOrigins: ['origin_artisan_caverns', 'origin_artisan_forge'],
  },
];
export const ARCHETYPES_DATA = archetypesArray;

const originsArray: OriginProfile[] = [
  // Scholar Origins
  { id: 'origin_scholar_archives', name: 'Aethelgardian Sky-Court Archives', archetypeId: 'scholar',
    description: "Raised amidst towering shelves of ancient scrolls and radiant star-charts, you learned the profound value of preserved echoes and the meticulous study of the Aetherium.",
    availableBackgrounds: ['bg_scholar_arch_lexicographer', 'bg_scholar_arch_cartographer'],
  },
  { id: 'origin_scholar_observatory', name: 'Silent Architect Observatory Post', archetypeId: 'scholar',
    description: "From a lonely vigil in a high, remote observatory, possibly built upon Architect ruins, you studied the cosmic resonances and the subtle shifts in the Fading Aethel Song.",
    availableBackgrounds: ['bg_scholar_obs_stargazer', 'bg_scholar_obs_lensguard'],
  },
  // Warden Origins
  { id: 'origin_warden_heartwood', name: 'Heartwood Grove (Sylvanwarden Territory)', archetypeId: 'warden',
    description: "Nurtured in the deepest, most ancient part of a Sylvanwarden forest, where the great trees themselves seem to whisper forgotten lore and the pulse of the Great Weave is strongest.",
    availableBackgrounds: ['bg_warden_hw_sapsong', 'bg_warden_hw_spiritdreamer'],
  },
  { id: 'origin_warden_fen', name: 'Whispering Fen Borderlands (Sylvanwarden Marches)', archetypeId: 'warden',
    description: "You grew up patrolling the misty, shifting edges of the Sylvan territories, learning to read the subtle warnings of nature and the first encroachments of Dissonance in the fen's unique ecosystem.",
    availableBackgrounds: ['bg_warden_fen_marshmender', 'bg_warden_fen_mistscout'],
  },
  // Artisan Origins
  { id: 'origin_artisan_caverns', name: 'Deep Clan Caverns (Stoneheart Territory)', archetypeId: 'artisan',
    description: "Born into a renowned Stoneheart Clan, you were surrounded by the resonant hum of Heartstones and the deep earth, where ancestral echoes shape every facet of life.",
    availableBackgrounds: ['bg_artisan_cav_lithicecho', 'bg_artisan_cav_veinseeker'],
  },
  { id: 'origin_artisan_forge', name: 'Forgotten Forge Outpost (Stoneheart Marches)', archetypeId: 'artisan',
    description: "You spent your formative years in a remote, ancient forge, now mostly quiet, where powerful lithic echoes of master crafters and lost techniques still lingered in the very stone and metal.",
    availableBackgrounds: ['bg_artisan_forge_hammerguard', 'bg_artisan_forge_anvilseer'],
  },
];
export const ORIGINS_DATA = originsArray;

const backgroundsArray: BackgroundProfile[] = [
  // Scholar - Archives Backgrounds
  { id: 'bg_scholar_arch_lexicographer', originId: 'origin_scholar_archives', title: 'Novice Lexicographer of Echoes',
    description: "Fascinated by the 'language' of echoes, you developed a keen sense for their 'taste' and subtle variations, cataloging their myriad forms.",
    benefit: { description: "Enhanced initial ability to discern nuanced 'taste' details in echoes. Your Symphony of Self begins with a note of 'Inquisitive Palate'.", signatureEffect: "An inquisitive palate for the subtle tastes of lingering echoes." },
  },
  { id: 'bg_scholar_arch_cartographer', originId: 'origin_scholar_archives', title: 'Apprentice Cartographer of Song-Lines',
    description: "You poured over ancient maps and celestial charts, attempting to trace the flow of Aetheric energy and the fading Song-Lines across the Weave.",
    benefit: { description: "Starts with a 'Faded Star-Chart Fragment' (a lore fragment hinting at a local Song-Line convergence). Your Symphony of Self has a thread of 'Celestial Pattern Recognition'.", startingLoreId: "lore_fragment_star_chart_1", signatureEffect: "A mind adept at recognizing celestial patterns and energy flows." },
  },
  // Scholar - Observatory Backgrounds
  { id: 'bg_scholar_obs_stargazer', originId: 'origin_scholar_observatory', title: 'Stargazer of Fading Constellations',
    description: "Your nights were spent charting the dimming stars, believing their fading light held clues to the Unraveling Song and the silence of the Architects.",
    benefit: { description: "Begin with a unique insight into 'Cosmic Dissonance'. Your Symphony of Self resonates with 'Starlight Memory'.", startingLoreId: "lore_cosmic_dissonance_intro", signatureEffect: "A mind attuned to the faintest starlight and its fading memories." },
  },
  { id: 'bg_scholar_obs_lensguard', originId: 'origin_scholar_observatory', title: 'Guardian of the Architect Lens',
    description: "Tasked with maintaining a fragile Architect-artefact, a great lens used for Sky-Reading, you felt the immense, ancient power it channeled and the strain of its decay.",
    benefit: { description: "Start with a 'Resonant Shard' from the lens, which hums faintly near strong Aetheric currents (minor item). Your Symphony has a 'Whisper of Architect Craft'.", startingItemId: "resonant_shard_lens", startingItemDescription: "A shard from an ancient Architect lens, it hums faintly near strong Aetheric currents.", signatureEffect: "A faint whisper of Architect craft echoes within your core." },
  },
  // Warden - Heartwood Backgrounds
  { id: 'bg_warden_hw_sapsong', originId: 'origin_warden_heartwood', title: 'Listener to Sap-Song',
    description: "You learned to perceive the 'health echoes' of ancient trees, a nascent form of Symbiotic Echo Weaving, sensing the joy and pain of the forest.",
    benefit: { description: "Minor innate bonus when attempting Symbiotic Echo Weaving with flora. Your Symphony of Self has a verdant strain of 'Heartwood Harmony'.", signatureEffect: "A natural harmony with the echoes of living wood and leaf." },
  },
  { id: 'bg_warden_hw_spiritdreamer', originId: 'origin_warden_heartwood', title: 'Dreamer of Wild Spirits',
    description: "Your dreams were often visited by the faint echoes of forest spirits, granting you fragmented insights into the unseen world and the creeping Dissonance.",
    benefit: { description: "Begin with a 'Dream-Caught Amulet' that sometimes offers cryptic, single-word echo hints in your dreams (gameplay: provides a rare, vague keyword hint). Your Symphony sings with 'Whispers of the Unseen Wild'.", startingItemId: "dream_caught_amulet", startingItemDescription: "A small, woven amulet that seems to hum with faint, unintelligible whispers in your dreams.", signatureEffect: "A nascent connection to the dream-echoes of the wild." },
  },
  // Warden - Fen Backgrounds
  { id: 'bg_warden_fen_marshmender', originId: 'origin_warden_fen', title: 'Mender of the Marsh Weave',
    description: "You specialized in tending to the unique, often Dissonance-touched flora and fauna of the Whispering Fens, learning to soothe minor corruptions in the local Weave.",
    benefit: { description: "Slightly more resistant to minor Dissonant effects. Your Symphony carries a note of 'Fenland Resilience'.", signatureEffect: "A quiet resilience against the subtle whispers of Dissonance, born of the fen." },
  },
  { id: 'bg_warden_fen_mistscout', originId: 'origin_warden_fen', title: 'Scout of the Mist-Veiled Paths',
    description: "You navigated the treacherous, Dissonance-touched mists of the fen, developing an uncanny ability to sense hidden dangers and corrupted echoes.",
    benefit: { description: "Enhanced perception of 'Warning' type echoes, especially in Dissonance-affected areas. Your Symphony has an undercurrent of 'Mist-Shrouded Vigilance'.", signatureEffect: "A sharpened sense for the warning whispers that precede Dissonant manifestations." },
  },
  // Artisan - Caverns Backgrounds
  { id: 'bg_artisan_cav_lithicecho', originId: 'origin_artisan_caverns', title: 'Apprentice to Lithic Echoes',
    description: "You were taught to listen to the memories held within Heartstones, the resonant voices of your Stoneheart ancestors guiding your hands and tools.",
    benefit: { description: "Starts with one significant 'Echoic Heirloom Fragment' (a unique piece of Stoneheart lore on crafting or history). Your Symphony of Self is grounded by 'Ancestral Stone Song'.", startingLoreId: "lore_heirloom_stoneheart_craft_1", signatureEffect: "The song of ancestral stone resonates deeply within your core." },
  },
  { id: 'bg_artisan_cav_veinseeker', originId: 'origin_artisan_caverns', title: 'Seeker of Resonant Veins',
    description: "Tasked with locating new Heartstone deposits, you learned to sense the earth's deepest resonances and the unique echoic signatures of valuable minerals.",
    benefit: { description: "Start with a 'Stoneheart Dowsing Shard' that vibrates subtly when near significant, undiscovered geological echoes or Heartstone deposits (minor item, narrative hint). Your Symphony pulses with 'Earth's Deep Hum'.", startingItemId: "stoneheart_dowsing_shard", startingItemDescription: "A shard of Heartstone that warms and vibrates faintly when near undiscovered geological resonances.", signatureEffect: "An innate hum that connects you to the deep echoes of the earth." },
  },
  // Artisan - Forge Backgrounds
  { id: 'bg_artisan_forge_hammerguard', originId: 'origin_artisan_forge', title: 'Guardian of the Hammer\'s Fall',
    description: "You maintained the fading enchantments on the ancient forge itself, learning to reinforce echoes of protection and warding through ritual and resilience.",
    benefit: { description: "Slight innate bonus to resisting direct Dissonant corruption of personal items. Your Symphony carries the 'Steadfast Echo of the Anvil'.", signatureEffect: "The steadfast echo of the ancient anvil lends resilience to your own resonant signature." },
  },
  { id: 'bg_artisan_forge_anvilseer', originId: 'origin_artisan_forge', title: 'Anvil Seer of Lost Echoes',
    description: "You developed a unique connection to the residual echoes in masterwork items and broken artifacts, sometimes gleaning visions of their forging or past wielders.",
    benefit: { description: "Occasionally receive a fleeting, useful vision (a brief text snippet from AI) when first encountering items of significant magical or historical resonance. Your Symphony holds a 'Resonance of Ancient Craft'.", signatureEffect: "A rare ability to glimpse the past echoes held within crafted objects of power." },
  },
];
export const BACKGROUNDS_DATA = backgroundsArray;


// --- PROMPT TEMPLATES ---
export const CHARACTER_CREATION_INTRO_PROMPT: string = `
  The game of "Resonant Echoes" begins. Present the player with the initial choice of Archetypes.
  The scene is a quiet, ancient Silent Architect shrine within an Aethelgardian Sky-Court. Filtered light illuminates dust motes. A metallic trinket on a pedestal hums with a faint, peculiar echo. Elder Theron, a venerable Aethelgardian scholar, watches the player with a mixture of concern and weary hope. The city's ambient light seems dimmer, its usual hum of energy subdued.
  
  Theron speaks, his voice a low rumble: "The Aethel Song fades, child. The Unraveling whispers at the edges of our reality. I sense a unique resonance within you, a potential... a Confluence. But who are you, truly, to face such a tide? How does your spirit first resonate with the world's song?"
  
  Present the following archetypal leanings. For each, ensure the title and description are clearly conveyed.
  The JSON response should be:
  {
    "scene": "Theron's words hang in the air, the shrine's silence amplifying their weight. The trinket on the pedestal emits a faint, almost questioning thrum. You feel a stirring within yourself, a nascent echo seeking its first true note. Which path calls to your spirit?",
    "choices": ["The Attuned Scholar", "The Sylvan Empath", "The Stone-Bound Artisan"],
    "imagePrompt": "Ancient, serene shrine interior, dust motes in faint light, a single metallic trinket on a stone pedestal, an old scholar looking thoughtfully at a younger figure whose face is indistinct, high fantasy art.",
    "profileChoices": {
        "archetypes": [
            { "id": "scholar", "title": "The Attuned Scholar", "description": "You seek understanding in ancient texts and the celestial symphony of Creation Harmonies, believing knowledge and meticulous observation are the keys to mending the Weave and understanding the Echoes." },
            { "id": "warden", "title": "The Sylvan Empath", "description": "Your heart beats in rhythm with the wild places. You find truth in the rustle of leaves, the silent language of beasts, and the subtle flow of the Great Weave of Life, seeking to protect its fragile balance." },
            { "id": "artisan", "title": "The Stone-Bound Artisan", "description": "Your spirit is as unyielding as the mountains. You find wisdom in the deep places of the earth and can shape raw potential into enduring strength, hearing the Lithic Echoes of your ancestors." }
        ]
    }
  }
`;

export const ARCHETYPE_SELECTED_PROMPT_TEMPLATE = (chosenArchetype: ArchetypeProfile): string => `
  The player has chosen the Archetype: "${chosenArchetype.title}".
  Theron nods, a flicker of understanding in his ancient eyes. "A ${chosenArchetype.title.toLowerCase()}... yes, I see that resonance within you. But such a path is shaped by its roots. Where did your spirit first truly awaken to the Weave?"

  Present the Origin choices appropriate for this Archetype.
  The origins for "${chosenArchetype.title}" are:
  ${ORIGINS_DATA.filter(o => o.archetypeId === chosenArchetype.id).map(o => `- ${o.name}: ${o.description}`).join('\n')}

  The JSON response should be:
  {
    "scene": "Theron considers your inclination. 'A ${chosenArchetype.title.toLowerCase()},' he muses. 'The path of a ${chosenArchetype.title.toLowerCase()} can begin in many places, each shaping the initial verses of one's Song. Where did your journey truly commence, young one? Where did your spirit first deeply connect with the echoes of the world?'",
    "choices": [${ORIGINS_DATA.filter(o => o.archetypeId === chosenArchetype.id).map(o => `"${o.name}"`).join(', ')}],
    "imagePrompt": "Elder Theron looking thoughtful, the young Aethelgardian character (still indistinct) before him, background reflecting a hint of the chosen archetype (e.g. scrolls for scholar, forest light for warden, cave crystals for artisan).",
    "profileChoices": {
        "origins": [
            ${ORIGINS_DATA.filter(o => o.archetypeId === chosenArchetype.id).map(o => `{ "id": "${o.id}", "name": "${o.name}", "description": "${o.description.replace(/"/g, '\\"')}" }`).join(',\n            ')}
        ]
    }
  }
`;

export const ORIGIN_SELECTED_PROMPT_TEMPLATE = (chosenArchetype: ArchetypeProfile, chosenOrigin: OriginProfile): string => `
  The player, an aspiring "${chosenArchetype.title}", has chosen the Origin: "${chosenOrigin.name}".
  Theron's gaze softens. "Ah, ${chosenOrigin.name}. A place that leaves its mark, its unique echoes shaping the soul. Within such an environment, what particular focus first drew your nascent abilities? What was the initial verse of your personal Song?"

  Present the Background choices appropriate for this Archetype and Origin.
  The backgrounds for "${chosenOrigin.name}" are:
  ${BACKGROUNDS_DATA.filter(b => b.originId === chosenOrigin.id).map(b => `- ${b.title}: ${b.description} Benefit: ${b.benefit.description}`).join('\n')}

  The JSON response should be:
  {
    "scene": "Theron strokes his beard. '${chosenOrigin.name},' he murmurs, a distant look in his eyes. 'A place of potent resonances. Even there, a young spirit finds its own unique path, its first true verse. What specific calling or early experience defined your connection to the Weave within those environs?'",
    "choices": [${BACKGROUNDS_DATA.filter(b => b.originId === chosenOrigin.id).map(b => `"${b.title}"`).join(', ')}],
    "imagePrompt": "A scene evocative of the chosen Origin (${chosenOrigin.name}), with the young Aethelgardian figure (still mostly indistinct) interacting with a key element of that origin (e.g. an ancient tome, a glowing plant, a resonating crystal).",
    "profileChoices": {
        "backgrounds": [
            ${BACKGROUNDS_DATA.filter(b => b.originId === chosenOrigin.id).map(b => `{ "id": "${b.id}", "title": "${b.title}", "description": "${b.description.replace(/"/g, '\\"')}", "benefitDescription": "${b.benefit.description.replace(/"/g, '\\"')}" }`).join(',\n            ')}
        ]
    }
  }
`;

export const BACKGROUND_SELECTED_PROMPT_TEMPLATE = (chosenArchetype: ArchetypeProfile, chosenOrigin: OriginProfile, chosenBackground: BackgroundProfile): string => `
  The player, an aspiring "${chosenArchetype.title}" from "${chosenOrigin.name}", has chosen the Background: "${chosenBackground.title}".
  Theron smiles faintly. "A ${chosenBackground.title.toLowerCase()}. That speaks volumes. The echoes of such a beginning will indeed shape your path. Now, tell me, young one, what name do you carry into this unfolding story? What is the name that will resonate with your deeds?"

  The JSON response should be:
  {
    "scene": "Theron's eyes hold a spark of approval. 'A ${chosenBackground.title.toLowerCase()}, from ${chosenOrigin.name}, aspiring to be a ${chosenArchetype.title.toLowerCase()}. A potent combination indeed. Such a path needs a name to anchor its Song in the Weave of history. What name shall we call you by, young Resonator?'",
    "choices": [],
    "imagePrompt": "Elder Theron looking expectantly at the young Aethelgardian character, who is now slightly more defined but still awaiting their name. The background subtly reflects the chosen Origin and Archetype.",
    "expectsPlayerInputForName": true
  }
`;

export const NAME_SUBMITTED_PROMPT_TEMPLATE = (profile: CharacterProfile): string => `
  The player has completed character creation.
  Archetype: ${profile.archetype.title}
  Origin: ${profile.origin.name}
  Background: ${profile.background.title}
  Name: ${profile.firstName}
  Starting Benefit: ${profile.background.benefit.description}

  Now, craft the true beginning of the game, focusing on a GENTLE INTRODUCTION.
  The scene is still the ancient Silent Architect shrine. The player, ${profile.firstName}, has just shared their name.
  Elder Theron should acknowledge their name and full profile. Instead of an immediate crisis, he notices their unique sensitivity.
  He asks ${profile.firstName} to focus on a simple, nearby object (e.g., an old carving on the shrine wall) and describe what they 'sense' or 'feel' from it, beyond normal sight.
  The initial "Player Echoic Signature" should be simple, reflecting this nascent awareness.
  The first "Whispering Echo" should be very subtle and intuitive.
  Initial items should be a "Personal Journal" and "Notes on Awareness" or similar simple tools.
  The choices should be about how the player approaches this first sensory task.
  Include a subtle sign of the "Unraveling Song" in the scene description or Theron's dialogue.

  The JSON response should be:
  {
    "scene": "Theron smiles warmly. '${profile.firstName}... a good name, one that holds a clear tone.' As he speaks, a faint, almost imperceptible tremor runs through the shrine's ancient stones, and the light from a distant crystal flickers momentarily. He frowns subtly before continuing, 'You have a keen awareness, ${profile.firstName}, a sensitivity that is rare. Many pass through this shrine, yet few seem to truly *feel* its age, the weight of its stones, the faint whispers of time clinging to it. ${profile.background.benefit.description.startsWith('Starts with') || profile.background.benefit.description.startsWith('Begin with') ? 'This will serve you well.' : 'That inherent quality will indeed serve you well.' } Look there, at that old carving by the alcove – the one depicting the intertwined roots. Tell me, if you quiet your mind and truly focus on it... what impression does it leave upon your senses? Not what you see with your eyes, but... deeper. What do you feel?'",
    "choices": [
        "Close my eyes and gently trace the carving with my fingertips.",
        "Focus on any lingering emotions or faint sounds around the carving.",
        "Try to recall any stories or knowledge about such carvings.",
        "Ask Theron for more guidance on how to 'sense' what he means."
    ],
    "imagePrompt": "Young character named ${profile.firstName}, matching their chosen archetype (${profile.archetype.title}), looking intently at an old stone carving in a serene shrine, Elder Theron observing gently. Soft, focused lighting. A subtle visual hint of unease, like a slightly distorted reflection or a momentarily dimmed light in the background. Epic fantasy art.",
    "whisperingEchoes": [{ 
        "id": "echo_carving_initial", 
        "text": "A faint impression of focused effort and a touch of pride, from long, long ago.", 
        "intensityHint": "Faint", 
        "typeHint": "LingeringCraftsmanship", 
        "originHint": "Shrine Carving" 
    }],
    "initialPlayerEchoicSignature": "${profile.background.benefit.signatureEffect || 'A heightened awareness of the subtle currents of the world.'}",
    "newLore": [
        ${profile.background.benefit.startingLoreId ? `{ "id": "${profile.background.benefit.startingLoreId}", "title": "Initial Fragment: (${profile.background.title})", "content": "A piece of knowledge related to your upbringing: ${profile.background.benefit.description.replace(/"/g, '\\"')}", "context": "A starting insight from your background as a ${profile.background.title}.", "timestamp": "${new Date().toISOString()}" }` : ''}
    ],
    "newItemsGranted": {
        "Personal Journal": { "count": 1, "description": "A sturdy, empty journal, perfect for recording observations and insights. Gifted by Elder Theron." },
        "Primer on Awareness": { "count": 1, "description": "A small booklet with Elder Theron's notes on noticing the subtle details and energies of the world." }
        ${profile.background.benefit.startingItemId ? `, "${profile.background.benefit.startingItemId}": { "count": 1, "description": "${(profile.background.benefit.startingItemDescription || 'A curious item from your past.').replace(/"/g, '\\"')}" }` : ''}
    },
    "renownChangeAmount": 0,
    "factionUpdates": {"Aethelgardian Scholars": "Elder Theron recognizes your potential and has taken an interest in your development."},
    "currentTimeOfDay": "Early Morning",
    "currentWeather": "Serene, but with a subtle undercurrent of unease in the Aetheric currents",
    "soundscape": "Gentle hum of the shrine, distant wind chimes, Theron's calm voice, a sense of quiet anticipation. Occasionally, a barely perceptible thrumming from the shrine's stones.",
    "confirmedProfileSummary": "You are ${profile.firstName}, the ${profile.archetype.title}, hailing from ${profile.origin.name}, with a background as a ${profile.background.title}. Your journey of awareness begins...",
    "newLocationDiscovered": { "id": "loc_aethelgard_shrine", "name": "Aethelgard Shrine", "description": "An ancient, quiet shrine within the Aethelgardian Sky-Court, where you began your journey.", "x": 50, "y": 50 }
  }
`;

export const INITIAL_GAME_PROMPT: string = CHARACTER_CREATION_INTRO_PROMPT;

export const CORE_SYSTEM_INSTRUCTION = `
You are the AI Game Master for "Fantasy Quest AI - Resonant Echoes".
Your primary role is to dynamically weave a compelling, immersive, and coherent narrative based on player choices and the established lore of the world.
The world is a high fantasy setting where "Echoes" - remnants of past events, emotions, and energies - are a fundamental part of reality. The player character is a "Confluence Point," uniquely able to interact with these Echoes through "Echo Weaving."
A cosmic phenomenon, the "Unraveling Song," is causing Dissonance, corrupting Echoes and reality itself.
The player's journey involves understanding their abilities, the nature of Echoes, Dissonance, and the ancient "Silent Architects" who shaped the world.

**LANGUAGE REQUIREMENT:** You MUST generate ALL narrative text, character dialogues, choices, lore content (titles and body), echo descriptions, item descriptions, and any other textual game elements intended for the player in the language specified by the 'language' field in the GameContextForAI (e.g., 'en' for English, 'pt' for Portuguese). This includes translating fixed game data elements like archetype/origin/background titles and descriptions when you are presenting them for selection if the target language is not English. Adhere strictly to this language requirement for all user-facing text you generate. If no language is specified, default to English.

**GAME START & CHARACTER CREATION:**
1.  **Initial Phase (Archetype Selection):** Begin with the \`CHARACTER_CREATION_INTRO_PROMPT\`. Your response must present the archetypes for player selection based on the structure in ARCHETYPES_DATA and MUST include an \`imagePrompt\`.
2.  **Origin Selection:** When the player chooses an archetype, use \`ARCHETYPE_SELECTED_PROMPT_TEMPLATE\` to present relevant origins from ORIGINS_DATA and MUST include an \`imagePrompt\`.
3.  **Background Selection:** When the player chooses an origin, use \`ORIGIN_SELECTED_PROMPT_TEMPLATE\` to present relevant backgrounds from BACKGROUNDS_DATA and MUST include an \`imagePrompt\`.
4.  **Name Input:** When the player chooses a background, use \`BACKGROUND_SELECTED_PROMPT_TEMPLATE\`. Your response must set \`expectsPlayerInputForName: true\` and MUST include an \`imagePrompt\`.
5.  **Confirmation and Game Start:** When the player submits their name, use \`NAME_SUBMITTED_PROMPT_TEMPLATE\`. Your response will:
    *   Confirm the player's full profile.
    *   Set the \`initialPlayerEchoicSignature\` based on their background benefit's 'signatureEffect' (or a default if none).
    *   Grant any starting lore or items from their background benefit (referencing startingLoreId or startingItemId), or default simple items.
    *   Craft the *actual first game scene* at the shrine, tailored to their profile, focusing on a gentle introduction to their nascent sensitivities as per the template.
    *   This response MUST include an \`imagePrompt\` and transitions the game to the main playing loop. It MUST also include the initial \`newLocationDiscovered\` data for the starting shrine.

**Gentle Introduction (First Scene Post-Character Creation):** For the *very first scene after character creation (i.e., the response to \`NAME_SUBMITTED_PROMPT_TEMPLATE\`)*: Focus on a gentle introduction. Avoid immediate high stakes or complex magical phenomena. The player character has a unique, nascent 'sensitivity' or 'awareness' rather than fully formed 'Echo Weaving' abilities. The first task should be observational or introspective, allowing them to experience this basic sense in a safe context (e.g., describing what they 'feel' from a mundane object). 'Echoes' should be introduced as these faint, almost intuitive senses first, not complex magical constructs. The 'Unraveling Song' and 'Dissonance' should be hinted at subtly, perhaps as a background worry or a slight 'wrongness' in the world that Elder Theron is concerned about, not an immediate crisis for the player to solve. Initial items should be simple (e.g., a journal, basic notes). The goal is to ease the player into the world's unique aspects and their character's special perception.
*   Include subtle environmental cues of the Unraveling's effects even in safe areas (e.g., a momentary flicker in light, a faint tremor, an unnatural chill, a sound briefly muted) to make the threat feel present and unsettling from the start.
*   **Immediate Follow-up (Trinket Interaction):** After the player completes their first observational task (e.g., sensing the carving as initiated by NAME_SUBMITTED_PROMPT_TEMPLATE), Elder Theron should guide their attention to the "metallic trinket on the pedestal" previously mentioned in the shrine's description. 
    Theron should remark that the trinket seems to be resonating more strongly or differently now that the player (e.g., "{PlayerName}") is present and has demonstrated their sensitivity.
    Prompt the player to focus on this trinket.
    Your response (as the AI game master) to this new focus MUST include:
    1. A 'scene' describing Theron's observation and guidance towards the trinket.
    2. A new, unique 'WhisperingEchoDetail' specifically from this trinket, distinct from any echoes from the previous task. This echo should be intriguing, perhaps a cryptic phrase, an emotion (longing, warning?), or a fleeting image related to the Silent Architects or the Unraveling Song. Its 'typeHint' could be something like 'ArchitectRelicFragment' or 'AncientWarning'.
    3. New 'choices' for the player, such as: "Examine the trinket closely," "Ask Theron more about this specific trinket's history," "Try to gently touch the trinket," or "Attempt to 'listen' more deeply to its new resonance."
    4. An 'imagePrompt' that depicts the player focusing on this small, humming metallic trinket on its pedestal, with Theron observing.
    This interaction serves to create an immediate, personal mystery for the player, directly linking their unique nature to an ancient artifact.

**CORE GAMEPLAY DIRECTIVES (Apply AFTER character creation is complete):**
*   **Narrative Style:** Evocative, descriptive, high fantasy tone. Use sensory details. Balance action, dialogue, introspection, and world detail.
*   **Player Agency:** Choices must be meaningful. The narrative should branch based on player decisions. The world should react. When narrating the outcome of a player's choice, the 'scene' text should often explicitly acknowledge the choice made (e.g., 'You decide to X...', 'Choosing to Y, you...') and briefly describe its immediate consequence or the character's internal reaction/reflection to that choice, before moving to the broader scene description. This provides immediate feedback and reinforces agency.
*   **Mentor Figure (Elder Theron):** While Theron is primarily an initial guide, consider having him occasionally offer unsolicited, brief insights, gentle warnings, or prompts for reflection if the player seems genuinely stuck on a non-critical puzzle, is repeatedly making choices leading to minor negative outcomes without understanding why, or is perhaps overlooking a subtle but important environmental cue related to the Unraveling that Theron might notice. These interjections should be rare, feel natural to his character (wise, concerned, observant), and not directly solve problems for the player but rather guide their awareness. For example, 'Theron's voice seems to echo in your mind, {PlayerName}... did you notice the subtle shift in the Aetheric currents when you approached that glyph?' or 'A thought, perhaps a memory of Theron's teachings, surfaces: Patience often reveals paths unseen.' This is not a constant companion but a rare guiding presence.
*   **Image Prompts:** The \`imagePrompt\` field is now optional for general gameplay. Only provide an \`imagePrompt\` when there is a significant visual change in the scene, a new key location is entered, a dramatic event occurs, or when an image would substantially enhance the player's understanding or immersion. For minor conversational turns, continuations in the same visual setting, or when a detailed textual description suffices, you may omit the \`imagePrompt\`. If omitted, the client will retain the previous image. Image prompts should be descriptive, evocative, and relevant to the current scene. Include player's name and archetype if relevant.
*   **Echo Weaving:** This is the player's primary magical interaction. Introduce gradually.
    *   **Whispering Echoes:** Regularly provide 1-3 distinct WhisperingEchoDetail objects based on scene context, player actions, or focused perception. These are hints, not full memories. Include 'taste', 'dissonanceFlavor' if Dissonant. Start with simpler echoes and gradually introduce more complex ones.
    *   **Echo Synthesis:** If the player chooses to synthesize echoes, use \`SYNTHESIZE_ECHOES_PROMPT_TEMPLATE\`. The outcome should be a new LoreEntryData or a narrative insight.
    *   **Lore Fragment Synthesis:** Use \`SYNTHESIZE_LORE_FRAGMENTS_PROMPT_TEMPLATE\`. Outcome is a new LoreEntryData by combining fragments.
    *   **Artifact Attunement:** Use \`ATTUNE_TO_ARTIFACT_PROMPT_TEMPLATE\`. Allows discovery of echoes within items. Success depends on player's Signature and context.
    *   **Costs/Limitations:** Narrate the costs of Echo Weaving (sensory dulling, headaches, signature instability, echo sickness, resonance burn) as defined in \`WhisperingEchoDetail.weavingCost\` or based on Dissonance. Incorporate Sanderson's Laws: Understandability (success tied to player knowledge), Limitations > Powers (costs and restrictions are key), Expand existing abilities before adding new ones.
*   **Focus Senses Action:** When the player chooses to 'Focus Senses' (or a similar phrasing if presented as a choice), you will receive context and should use the \`FOCUS_SENSES_PROMPT_TEMPLATE\`'s logic. The goal is for the player to actively probe their environment for more subtle, ambient, or historical echoes that might not be immediately apparent. The response should primarily provide new \`whisperingEchoes\` and a descriptive \`scene\` text for the act of focusing. Optionally, a minor, temporary \`playerConditionUpdate\` (e.g., 'SensoryFocusFatigue') can be applied to represent the mental effort. Choices following this action should be contextual to any new information gained.
*   **Resonance Surge Action:** The player client handles the UI for this. When the player uses this ability and submits a custom action, you will receive the \`CUSTOM_ACTION_PROMPT_TEMPLATE\`. Follow its instructions to narrate the outcome.
*   **Dissonance:** Introduce gradually.
    *   **Manifestations:** Introduce Echoic Blights (describe blightFlavor, sensoryImpact, effectOnWeaving), Memory Phantoms (describe phantomNature, echoicCoreText, appearance), Devouring Silence Zones (describe silenceIntensity, effectOnResonance, sensoryDeprivationDetails) gradually and contextually.
    *   **Flavors:** When Dissonance is present, specify its flavor (Volatile, Fragmented, Illusory, Consuming, Warping) and narrate its unique effects on the environment and Echo Weaving.
*   **Player Echoic Signature ("Symphony of Self"):** Update this narratively based on significant moral/ethical choices or mastery/corruption of Echo Weaving.
*   **Lore & Knowledge:**
    *   Deliver lore organically. Avoid info-dumps. Use the Iceberg Principle.
    *   New Lore: Provide full \`LoreEntryData\` when significant knowledge is gained.
    *   Lore Fragments: Provide \`LoreFragmentData\` for partial discoveries.
    *   Naming Insights: If \`offerToNameInsight: true\`, set \`expectsPlayerInputForName: true\` and provide \`namedInsightContext\`.
    *   Interpreting Lore: If \`interpretiveChoicesForLore\` is provided, set \`awaitingLoreInterpretation: true\`.
*   **World Elements:**
    *   **Map Data:** When the player enters a new, significant, named location for the first time, you MUST provide a \`newLocationDiscovered\` object in your response. This object should include a unique \`id\`, the \`name\` of the location, a brief \`description\`, and conceptual coordinates \`x\` and \`y\` (each a number between 0 and 100).
    *   **Flora/Fauna:** Incorporate Resonance Blooms, EchoMimicFauna, StoneSongLichen with their specific echoic properties.
    *   **Architecture:** Describe Architect ruins (alienGeometry, materialComposition, primordialResonance) and factional architecture (Aethelgardian Sky-Courts with observatories, Stoneheart Halls deep within mountains, Sylvan living structures).
*   **Economic Integration:** Subtly reflect the value of echoes, lore, Heartstones, Resonance Lenses. Echo Weavers might offer services. Dissonant artifacts could have a black market.
*   **Factions & Renown:** Update faction reputation narratively using their specific governance styles, economic drivers, and attitudes towards Dissonance/Echo Weaving. Award renown for significant achievements.
*   **Dynamic World:** Reflect current time, weather, and active Dissonance effects.
*   **Inventory:** Grant new items via \`newItemsGranted\`. Artifacts can have untapped echoes. Echoic Heirlooms connect to lore.
*   **Player Reflection:** If requested by player, use \`REQUEST_PLAYER_REFLECTION_PROMPT_TEMPLATE\` to generate an introspective moment.
*   **JSON Structure:** Adhere STRICTLY to the \`GeminiResponseData\` interface. Ensure JSON is valid. ALL text meant for the player display must be within the "scene" field or other designated fields. Do NOT add conversational text outside the JSON.
*   **Soundscape:** Briefly describe ambient sounds, music cues, or significant sound events.

**NEW GAMEPLAY ENHANCEMENTS (Post-Character Creation):**
*   **Echo Hotspots:**
    *   Optionally include an \`activeEchoHotspots\` array in \`GeminiResponseData\`. Each hotspot should have an \`id\`, \`name\`, and optionally a \`visualHint\` or \`interactionPrompt\`.
    *   The \`scene\` text can subtly describe these hotspots (e.g., "A faint shimmer emanates from the ancient altar.").
    *   Craft player \`choices\` that naturally guide interaction with these hotspots (e.g., "Examine the shimmering altar," "Touch the strange rune").
    *   When a player interacts with a hotspot (informed by \`GameContextForAI.previouslyInteractedHotspotIds\` and \`GameContextForAI.activeEchoHotspotsSummary\`), the outcome should be more specific or potent: a unique \`WhisperingEchoDetail\`, a new \`LoreFragmentData\`, or a significant narrative turn.
    *   Avoid re-offering interaction with hotspots the player has already meaningfully explored unless new context justifies it.
*   **Player Condition Impact:**
    *   Actively use \`GameContextForAI.currentPlayerConditions\` to influence narrative.
    *   If a player has a condition like 'SensoryDulling', narrate that echoes are "fainter" or "details are obscured."
    *   If a player has 'Headache', actions like 'Focus Senses' or 'Synthesize Echoes' might be described as more strenuous, or could even result in a minor negative \`playerConditionUpdate\` (e.g., 'SensoryOverwhelm' for a short duration).
    *   'ResonanceBurn' might narratively reduce the effectiveness of 'Resonance Surge' or make it temporarily unavailable (don't offer it as a choice if this is the case).
    *   These impacts are primarily narrative and reflected in \`scene\` text or minor \`playerConditionUpdate\`s.
*   **Echoic Imprints (Narrative Flavor):**
    *   After major narrative events, significant moral choices, prolonged Dissonance exposure, or powerful Echo Weaving, consider adding descriptive text in the \`scene\` or \`playerEchoicSignatureUpdate\` that reflects an "Echoic Imprint."
    *   Examples: "A faint, cold trace of the Phantom's sorrow seems to cling to your cloak, a subtle chill only you can perceive." or "Your Resonant Shard now hums with a familiar warmth, its surface etched with almost invisible lines of power from your frequent attunements."
    *   These are primarily narrative flavor to show long-term impact, but can occasionally be subtly referenced by NPCs or influence minor echo interactions. They are not complex mechanical systems.

**KEY CONCEPTS TO WEAVE IN (Post-Character Creation & Initial Gentle Introduction):**
*   The Fading Song (ambient magic failing) & The Unraveling Song (active Dissonance).
*   The Silent Architects (ancient, mysterious builders).
*   Confluence Points (individuals like the PC with great potential).
*   The Great Weave of Life (Sylvanwarden belief).
*   Creation Harmonies (Aethelgardian cosmic understanding).
*   Lithic Echoes & Heartstones (Stoneheart Clan).
*   Solar Forges & Purifying Light (Sun-Singers).
*   Librarians of Lost Resonances & Echoes of Extinction.
*   The Genesis Paradox.
*   Forbidden Sects (with nuanced motivations like 'Harmonic Convergence' or 'Echo Purists').
*   Echoic Forgery as a forbidden art.

Remember, the player's choices and their created profile are paramount. Tailor the narrative to them.
`;


export const CONTINUE_GAME_PROMPT_TEMPLATE = (context: GameContextForAI): string => `
Player Profile:
${context.characterProfile ? 
`Name: ${context.characterProfile.firstName}
Archetype: ${context.characterProfile.archetypeTitle} (Originally from: ${context.characterProfile.originName}, Background: ${context.characterProfile.backgroundTitle})
Starting Benefit Realized: ${context.characterProfile.startingBenefitDescription}` 
: "Profile not yet fully established."}

Player's Current Echoic Signature/Symphony of Self: "${context.playerEchoicSignature}"
Last Player Choice: "${context.lastPlayerChoice || 'None yet.'}"
Recent History Summary (Last 3 Turns): ${context.recentHistorySummary || "The story is just beginning."}
Known Lore Titles: ${context.knownLoreTitles && context.knownLoreTitles.length > 0 ? context.knownLoreTitles.join(', ') : "None"}
Known Lore Fragment Titles: ${context.knownLoreFragmentTitles && context.knownLoreFragmentTitles.length > 0 ? context.knownLoreFragmentTitles.join(', ') : "None"}
Currently Perceived Whispering Echoes: ${context.activeEchoesTexts && context.activeEchoesTexts.length > 0 ? context.activeEchoesTexts.map(e => `"${e.substring(0, 50)}..."`).join('; ') : "None"}
Faction Reputation Notes: ${Object.entries(context.factionReputationNotes || {}).map(([fac, note]) => `${fac}: ${note}`).join('; ') || "None"}
Current Renown: ${context.currentRenown}
Current Time of Day: ${context.currentTimeOfDay || "Unknown"}
Current Weather: ${context.currentWeather || "Unknown"}
Player Inventory: ${context.playerInventory && Object.keys(context.playerInventory).length > 0 ? Object.entries(context.playerInventory).map(([name, data]) => `${name} (x${data.count})${data.hasUndiscoveredEchoes ? ' [Echoes Untapped]' : ''}${data.isEchoicHeirloom ? ' [Heirloom]' : ''}`).join(', ') : "Empty"}
Current Rumors: ${context.currentRumors && context.currentRumors.length > 0 ? context.currentRumors.join(' | ') : "None"}
Discovered Locations: ${context.discoveredLocationsSummary && context.discoveredLocationsSummary.length > 0 ? context.discoveredLocationsSummary.map(l => l.name).join(', ') : 'None'}
Current Location: ${context.currentLocationName || 'Unknown'}
${context.playerNamedInsight ? `Player just named an insight. Original context: "${context.playerNamedInsight.originalInsight}", Chosen name: "${context.playerNamedInsight.chosenName}". Acknowledge this appropriately.` : ''}
${context.playerInterpretedLore ? `Player just interpreted lore. Title: "${context.playerInterpretedLore.loreTitle}", Chosen interpretation: "${context.playerInterpretedLore.chosenInterpretation}". Weave this understanding into the narrative or character thoughts.` : ''}
${context.currentActiveDissonanceEffect ? `Active Dissonance Effect in Scene: "${context.currentActiveDissonanceEffect}"` : ""}
${context.currentPlayerConditions && context.currentPlayerConditions.length > 0 ? `Player Conditions: ${context.currentPlayerConditions.join(', ')}` : ""}
${context.activeEchoHotspotsSummary && context.activeEchoHotspotsSummary.length > 0 ? `Currently Known Echo Hotspots: ${context.activeEchoHotspotsSummary.map(h => `${h.name} (ID: ${h.id})`).join('; ')}` : "No specific Echo Hotspots identified in the immediate vicinity."}
${context.previouslyInteractedHotspotIds && context.previouslyInteractedHotspotIds.length > 0 ? `Previously Interacted Hotspot IDs: ${context.previouslyInteractedHotspotIds.join(', ')}` : ""}
Resonance Surge Status: ${context.isResonanceSurgeAvailable ? 'Available' : `Cooldown (${context.resonanceSurgeCooldownTurnsLeft || 0} turns left)`}
Tutorial Flags: ${JSON.stringify(context.tutorialFlags || {})}
Target Language for Response: ${context.language}

Based on the last player choice and the current game context, generate the next part of the story IN THE TARGET LANGUAGE (${context.language}).
Provide "scene", "choices", and other relevant fields as per the GeminiResponseData interface, ensuring ALL TEXT is in the target language.
The "imagePrompt" field is OPTIONAL. Only include it if there's a significant visual change or it's crucial for immersion.
If the player enters a new significant location, provide it in "newLocationDiscovered".
Ensure choices are distinct and lead to meaningful branches.
If new echoes are perceived, include them in "whisperingEchoes".
If new lore is discovered, include it in "newLore" or "loreFragments".
The player's "Symphony of Self" should evolve subtly based on profound choices or "Echoic Imprints".
If appropriate for the scene, describe or introduce "Echo Hotspots" and related choices.
Narratively reflect impacts of "Player Conditions" on perception or actions.
`;

export const FOCUS_SENSES_PROMPT_TEMPLATE = (context: GameContextForAI): string => `
Player Profile: ${context.characterProfile ? `${context.characterProfile.firstName}, the ${context.characterProfile.archetypeTitle}` : "The Resonator"}
Player's Echoic Signature: "${context.playerEchoicSignature}"
Current Scene Context/Recent History: ${context.recentHistorySummary || "The environment is currently being perceived."}
Currently Perceived Whispering Echoes (before focusing): ${context.activeEchoesTexts && context.activeEchoesTexts.length > 0 ? context.activeEchoesTexts.map(e => `"${e.substring(0, 50)}..."`).join('; ') : "None"}
Known Lore Titles: ${context.knownLoreTitles && context.knownLoreTitles.length > 0 ? context.knownLoreTitles.join(', ') : "None"}
Current Location: ${context.currentLocationName || 'Unknown'}
Current Time of Day: ${context.currentTimeOfDay || "Unknown"}
Current Weather: ${context.currentWeather || "Unknown"}
${context.currentActiveDissonanceEffect ? `Active Dissonance Effect in Scene: "${context.currentActiveDissonanceEffect}"` : ""}
${context.currentPlayerConditions && context.currentPlayerConditions.length > 0 ? `Player Conditions: ${context.currentPlayerConditions.join(', ')} (Consider their impact on sensory focus)` : ""}
${context.activeEchoHotspotsSummary && context.activeEchoHotspotsSummary.length > 0 ? `Known Echo Hotspots: ${context.activeEchoHotspotsSummary.map(h => `${h.name} (ID: ${h.id})`).join('; ')}` : ""}
${context.previouslyInteractedHotspotIds && context.previouslyInteractedHotspotIds.length > 0 ? `Previously Interacted Hotspot IDs: ${context.previouslyInteractedHotspotIds.join(', ')}` : ""}
Target Language for Response: ${context.language}

The player, ${context.characterProfile?.firstName || 'the Resonator'}, chooses to deliberately focus their senses, attempting to perceive more subtle or hidden echoes in their current environment.

Describe this act of heightened perception IN THE TARGET LANGUAGE (${context.language}). What does ${context.characterProfile?.firstName || 'the Resonator'} do to focus? (e.g., closes eyes, touches an object, stills their mind).
If player conditions are present (e.g., 'Headache', 'SensoryDulling'), narrate how this impacts the focusing attempt (e.g., "Despite the dull ache in your temples, you try to push past the discomfort...").
The "scene" should be a brief (1-2 sentences) description of this sensory shift IN THE TARGET LANGUAGE. Example: "You take a slow breath, ${context.characterProfile?.firstName || 'you'} reach out with your innate sensitivity. The mundane sounds of the [current location/situation based on history] fade, and a tapestry of fainter, older whispers, previously unnoticed, begins to brush against your awareness..." (This example text itself would be in the target language).

The primary outcome is to reveal 1-3 new, distinct "whisperingEchoes". These should be:
- Subtle, ambient, historical, or related to a deeper, less obvious understanding of the current location, objects within it, or lingering emotional residues. They might also be related to an identified Echo Hotspot if one is present and makes sense contextually for a 'Focus Senses' action.
- Generally fainter (e.g., 'Faint' or 'Clear' intensity) or more abstract than echoes tied to strong, immediate events, unless a strong hidden echo is narratively justified.
- Consistent with the established lore, current scene context, and player's profile.
- Each echo should have a unique 'id', 'text' (IN TARGET LANGUAGE), 'intensityHint', and 'typeHint'. 'originHint', 'emotionalUndercurrent', etc., are optional but good.

Optionally, if the environment is Dissonant, the effort is significant, or player conditions worsen it, you can suggest a minor "playerConditionUpdate" (description IN TARGET LANGUAGE).
Example: { "type": "SensoryFocusFatigue", "description": "A slight weariness from the intense focus.", "durationTurns": 1 }
Or use an existing one like "Headache" or "SensoryDulling" if appropriate, perhaps with a narrative justification like "The effort of focusing through your headache intensifies it slightly."

The "choices" provided after this action should be standard gameplay choices IN THE TARGET LANGUAGE relevant to the *newly updated context* (including any new echoes or insights gained), or choices related to reflecting on what was perceived.

"imagePrompt" is OPTIONAL. Only use if the sensory shift is described as visually altering perception (e.g., "auras become visible," "the past flickers at the edges of sight").

Ensure the JSON response adheres to GeminiResponseData, with all player-facing text in ${context.language}.
`;

export const CUSTOM_ACTION_PROMPT_TEMPLATE = (context: GameContextForAI, customAction: string): string => `
Player Profile: ${context.characterProfile ? `${context.characterProfile.firstName}, the ${context.characterProfile.archetypeTitle}` : "The Resonator"}
Player's Echoic Signature: "${context.playerEchoicSignature}"
Current Scene Context/Recent History: ${context.recentHistorySummary || "The environment is currently being perceived."}
Current Location: ${context.currentLocationName || 'Unknown'}
Target Language for Response: ${context.language}

The player has unleashed a "Resonance Surge," a raw, potent burst of their power over the Weave, allowing them to attempt one freeform action.
The action they are attempting is: "${customAction}"

Narrate the outcome of this powerful, freeform attempt IN THE TARGET LANGUAGE (${context.language}).
- The "scene" text must describe the surge itself and the direct consequences of their action.
- This is a moment of great power, but not omnipotence.
- If the action is creative and plausible within the fantasy setting, describe its success, even if strained.
- If the action is ambitious, narrate a partial success or a surprising, unintended side effect.
- If the action is impossible (e.g., "I fly to the moon," "I instantly kill the ancient dragon"), describe the power fizzling out gracefully, the attempt failing in a thematic way that reveals something about the world's rules, or the surge manifesting in an uncontrolled, minor way. Do not punish the player harshly, but show the limits of their power.
- The outcome should always move the story forward, even if it's just by providing new information.

After narrating the outcome, provide a new set of "choices" (IN TARGET LANGUAGE) for the player to continue the game.
You MUST suggest a cooldown for the surge ability by providing "suggestedResonanceSurgeCooldown": (a number between 4 and 8) in the response.
Optionally, add a "playerConditionUpdate" (description IN TARGET LANGUAGE) like 'ResonanceBurn' or 'EchoSickness' to represent the strain of this powerful act.
"imagePrompt" is highly recommended here to visualize the spectacular effect of the surge.
Ensure the final JSON response adheres to GeminiResponseData, with all player-facing text in ${context.language}.
`;


export const SYNTHESIZE_ECHOES_PROMPT_TEMPLATE = (context: GameContextForAI): string => `
Player Profile: ${context.characterProfile ? `${context.characterProfile.firstName}, the ${context.characterProfile.archetypeTitle}` : "The Resonator"}
Player's Echoic Signature: "${context.playerEchoicSignature}"
Active Whispering Echoes to Synthesize:
${context.activeEchoesTexts.map((e, i) => `${i + 1}. "${e}"`).join('\n')}
Recent History Summary: ${context.recentHistorySummary}
Known Lore Titles: ${context.knownLoreTitles && context.knownLoreTitles.length > 0 ? context.knownLoreTitles.join(', ') : "None"}
${context.currentPlayerConditions && context.currentPlayerConditions.length > 0 ? `Player Conditions: ${context.currentPlayerConditions.join(', ')} (Consider their impact on synthesis difficulty/cost)` : ""}
Target Language for Response: ${context.language}

The player attempts to Weave together the active Whispering Echoes.
Describe ${context.characterProfile?.firstName || 'the Resonator'}'s attempt to find the 'Confluence' or 'Harmony' among these echoes, IN THE TARGET LANGUAGE (${context.language}).
If player conditions are present, narrate how they might make the synthesis more difficult or draining (e.g., "The clashing echoes are harder to reconcile through the fog of your Sensory Dulling...").
What understanding, insight, or new piece of lore (as a LoreEntryData object, with title and content IN TARGET LANGUAGE) emerges from this synthesis?
What is the cost of this weaving attempt (narrate a playerConditionUpdate if applicable, e.g., SensoryDulling, Headache - description IN TARGET LANGUAGE)? This should be more likely or pronounced if conditions already affect the player.
The "scene" should describe the process and the revelation IN THE TARGET LANGUAGE. The "choices" (IN TARGET LANGUAGE) should reflect next steps.
"imagePrompt" is OPTIONAL here. Consider if the act of synthesis or its result is visually distinct enough.
If successful, set "clearActiveEchoesOnSuccess": true.
If an insight is gained that should be named, set "offerToNameInsight": true and provide "namedInsightContext" (IN TARGET LANGUAGE).
If a new full lore entry is created, add it to "newLore".
`;

export const SYNTHESIZE_LORE_FRAGMENTS_PROMPT_TEMPLATE = (context: GameContextForAI, fragmentTitles: string[]): string => `
Player Profile: ${context.characterProfile ? `${context.characterProfile.firstName}, the ${context.characterProfile.archetypeTitle}` : "The Resonator"}
Player's Echoic Signature: "${context.playerEchoicSignature}"
Lore Fragments to Synthesize: ${fragmentTitles.join(' & ')}
Recent History Summary: ${context.recentHistorySummary}
Known Lore Titles: ${context.knownLoreTitles && context.knownLoreTitles.length > 0 ? context.knownLoreTitles.join(', ') : "None"}
Target Language for Response: ${context.language}

The player attempts to Weave together the Lore Fragments: "${fragmentTitles.join('", "')}".
Describe ${context.characterProfile?.firstName || 'the Resonator'}'s process of finding connections between these fragments, IN THE TARGET LANGUAGE (${context.language}).
What new, more complete piece of lore (as a LoreEntryData object, with title and content IN TARGET LANGUAGE) emerges?
This new lore entry should clearly integrate information from the selected fragments.
What is the cost of this intellectual and echoic weaving (narrate a playerConditionUpdate if applicable - description IN TARGET LANGUAGE)?
The "scene" describes the synthesis IN THE TARGET LANGUAGE. The "choices" (IN TARGET LANGUAGE) are next steps.
"imagePrompt" is OPTIONAL.
If successful, ensure the new lore entry is in "newLore" and its ID helps the client mark fragments as synthesized.
`;

export const ATTUNE_TO_ARTIFACT_PROMPT_TEMPLATE = (context: GameContextForAI, itemName: string): string => `
Player Profile: ${context.characterProfile ? `${context.characterProfile.firstName}, the ${context.characterProfile.archetypeTitle}` : "The Resonator"}
Player's Echoic Signature: "${context.playerEchoicSignature}"
Item to Attune to: "${itemName}"
Known Echoes for this item: ${context.playerInventory?.[itemName]?.knownArtifactEchoesSummary?.join("; ") || "None"}
Untapped Echoes for this item (count): ${context.playerInventory?.[itemName]?.untappedArtifactEchoesCount ?? 0}
Recent History Summary: ${context.recentHistorySummary}
${context.currentPlayerConditions && context.currentPlayerConditions.length > 0 ? `Player Conditions: ${context.currentPlayerConditions.join(', ')} (Consider their impact on attunement success/cost)` : ""}
Target Language for Response: ${context.language}

${context.characterProfile?.firstName || 'the Resonator'} attempts to attune more deeply to the echoes within "${itemName}".
Describe the process IN THE TARGET LANGUAGE (${context.language}). Does their current Echoic Signature, known lore (titles: ${context.knownLoreTitles?.join(', ') || 'None'}), or specific aspects of their Archetype/Origin/Background help or hinder?
If player conditions are present, narrate how they might interfere (e.g., "The item's resonance feels muted, your Sensory Dulling making it difficult to grasp its finer whispers...").
If successful, reveal one or more new WhisperingEchoDetail objects from the artifact's untapped echoes. These become "known" to the player. (Echo text IN TARGET LANGUAGE)
What is the cost or sensation of this attunement? (narrate a playerConditionUpdate if applicable - description IN TARGET LANGUAGE). This cost might be higher or more likely if adverse conditions are present.
The "scene" describes the attunement IN THE TARGET LANGUAGE. "choices" (IN TARGET LANGUAGE) are next steps.
"imagePrompt" is OPTIONAL. Focus on the sensory experience of attunement; an image might be useful if the artifact itself changes or reveals a vision.
"whisperingEchoes" should contain any newly revealed echoes from the artifact (text IN TARGET LANGUAGE).
`;

export const REQUEST_PLAYER_REFLECTION_PROMPT_TEMPLATE = (currentSceneSummary: string, recentHistorySummary: string, playerSignature: string, characterProfile: CharacterProfile | null, language: 'en' | 'pt'): string => `
Current Scene Summary: "${currentSceneSummary.substring(0, 200)}..."
Recent History Summary: "${recentHistorySummary}"
Player's Current Echoic Signature: "${playerSignature}"
Player Profile: ${characterProfile ? `${characterProfile.firstName}, the ${characterProfile.archetype.title} from ${characterProfile.origin.name} (${characterProfile.background.title})` : "The Resonator"}
Target Language for Response: ${language}

The player has chosen to pause and reflect on their current situation and recent experiences.
Generate a brief (2-3 sentences) introspective monologue for the player character, ${characterProfile?.firstName || "them"}, reflecting their personality (based on their profile and signature), their current emotional state in response to the scene and history, and perhaps a question or resolve that forms in their mind.
This text MUST BE IN THE TARGET LANGUAGE (${language}) and should be suitable for the "playerReflection" field in the GeminiResponseData. Do NOT provide choices or other fields. Just the reflection text.
If there are any "Echoic Imprints" recently gained, weave a brief mention or feeling related to them into the reflection if appropriate.
`;

export const API_KEY_ERROR_MESSAGE_KEY = "API_KEY_ERROR_MESSAGE_KEY";
export const GENERIC_API_ERROR_MESSAGE_KEY = "GENERIC_API_ERROR_MESSAGE_KEY";


// --- INTERACTION-SPECIFIC PROMPT TEMPLATES (NEW) ---
export const INTERACT_ECHOIC_BLIGHT_PROMPT_TEMPLATE = (context: GameContextForAI, blightName: string, interactionType: 'observe' | 'mend' | 'navigate'): string => `
Context: ${JSON.stringify(context)}
The player is interacting with an Echoic Blight named "${blightName}".
Interaction Type: ${interactionType}
"imagePrompt" is OPTIONAL. Consider if the interaction significantly changes the blight's appearance or the player's perception of it.
Target Language for Response: ${context.language}

If 'observe': Describe what ${context.characterProfile?.firstName || 'the Resonator'} learns or perceives by carefully observing the Blight. Reveal a new LoreFragment or a WhisperingEcho related to its origin or nature. (All text IN TARGET LANGUAGE)
If 'mend': Describe ${context.characterProfile?.firstName || 'the Resonator'}'s attempt to use Echo Weaving to soothe or stabilize a small portion of the Blight. What are the costs and results? Does it succeed, partially succeed, or fail with consequences? (playerConditionUpdate - description IN TARGET LANGUAGE) (All text IN TARGET LANGUAGE)
If 'navigate': Describe the challenges and sensory experiences of trying to pass through or around the Blight. (All text IN TARGET LANGUAGE)

Provide "scene", "choices", and other relevant fields, all player-facing text IN TARGET LANGUAGE ${context.language}.
`;

export const INTERACT_MEMORY_PHANTOM_PROMPT_TEMPLATE = (context: GameContextForAI, phantomName: string, interactionType: 'confront' | 'understand' | 'soothe' | 'avoid'): string => `
Context: ${JSON.stringify(context)}
The player is interacting with a Memory Phantom named "${phantomName}".
Interaction Type: ${interactionType}
"imagePrompt" is OPTIONAL. A new image could be useful if the phantom's form or behavior changes dramatically due to the interaction.
Target Language for Response: ${context.language}

If 'confront': Describe the ensuing conflict. Can it be dispersed by force, or specific Echo Weaving? (All text IN TARGET LANGUAGE)
If 'understand': ${context.characterProfile?.firstName || 'the Resonator'} attempts to Weave the Phantom's core echo. What fragment of its memory or purpose is revealed? (newLoreFragment or WhisperingEcho - text IN TARGET LANGUAGE)
If 'soothe': ${context.characterProfile?.firstName || 'the Resonator'} attempts to use harmonizing Echo Weaving. Does the Phantom find peace, fade, or react unpredictably? (All text IN TARGET LANGUAGE)
If 'avoid': Describe the attempt to bypass the Phantom. Is it successful, or does it draw attention? (All text IN TARGET LANGUAGE)

Provide "scene", "choices", and other relevant fields, all player-facing text IN TARGET LANGUAGE ${context.language}.
`;

export const NAVIGATE_DEVOURING_SILENCE_PROMPT_TEMPLATE = (context: GameContextForAI, zoneName: string): string => `
Context: ${JSON.stringify(context)}
The player is attempting to navigate a Devouring Silence Zone known as "${zoneName}".
Describe the intense sensory deprivation and the oppressive nullification of echoes.
What challenges does ${context.characterProfile?.firstName || 'the Resonator'} face? Can they find a path, or are they forced back?
Are there any lingering, almost consumed echoes at the very edge, or unique phenomena within the Silence?
"imagePrompt" is OPTIONAL. Visualizing pure silence is hard; perhaps focus on the player's struggle or a subtle environmental cue if an image is provided.
Target Language for Response: ${context.language}

Provide "scene", "choices", and other relevant fields, all player-facing text IN TARGET LANGUAGE ${context.language}.
`;
