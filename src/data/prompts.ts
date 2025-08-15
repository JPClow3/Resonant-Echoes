import { GameContextForAI, ArchetypeProfile, OriginProfile, BackgroundProfile, CharacterProfile, HistoryEntry } from '../types';
import { ARCHETYPES_DATA, ORIGINS_DATA, BACKGROUNDS_DATA } from './characterCreation';

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

// --- PROMPT TEMPLATES ---
// Note: These functions now build the JSON payload programmatically for type safety and easier maintenance.

export const buildCharacterCreationIntroPrompt = (): string => {
    const prompt = `
      The game of "Resonant Echoes" begins. Present the player with the initial choice of Archetypes.
      The scene is a quiet, ancient Silent Architect shrine within an Aethelgardian Sky-Court. Filtered light illuminates dust motes. A metallic trinket on a pedestal hums with a faint, peculiar echo. Elder Theron, a venerable Aethelgardian scholar, watches the player with a mixture of concern and weary hope. The city's ambient light seems dimmer, its usual hum of energy subdued.
      
      Theron speaks, his voice a low rumble: "The Aethel Song fades, child. The Unraveling whispers at the edges of our reality. I sense a unique resonance within you, a potential... a Confluence. But who are you, truly, to face such a tide? How does your spirit first resonate with the world's song?"
      
      Present the archetypal leanings. Ensure the title and description are clearly conveyed.
      Your entire response must be the following JSON object:
    `;
    const jsonData = {
        scene: "Theron's words hang in the air, the shrine's silence amplifying their weight. The trinket on the pedestal emits a faint, almost questioning thrum. You feel a stirring within yourself, a nascent echo seeking its first true note. Which path calls to your spirit?",
        choices: ARCHETYPES_DATA.map(a => a.title),
        imagePrompt: "Ancient, serene shrine interior, dust motes in faint light, a single metallic trinket on a stone pedestal, an old scholar looking thoughtfully at a younger figure whose face is indistinct, high fantasy art.",
        profileChoices: {
            archetypes: ARCHETYPES_DATA.map(({ id, title, description }) => ({ id, title, description }))
        }
    };
    return `${prompt}\n${JSON.stringify(jsonData, null, 2)}`;
};

export const buildArchetypeSelectedPrompt = (chosenArchetype: ArchetypeProfile): string => {
    const relevantOrigins = ORIGINS_DATA.filter(o => o.archetypeId === chosenArchetype.id);
    const prompt = `
      The player has chosen the Archetype: "${chosenArchetype.title}".
      Theron nods, a flicker of understanding in his ancient eyes. "A ${chosenArchetype.title.toLowerCase()}... yes, I see that resonance within you. But such a path is shaped by its roots. Where did your spirit first truly awaken to the Weave?"
      Present the Origin choices appropriate for this Archetype.
      Your entire response must be the following JSON object:
    `;
    const jsonData = {
        scene: `Theron considers your inclination. 'A ${chosenArchetype.title.toLowerCase()},' he muses. 'The path of a ${chosenArchetype.title.toLowerCase()} can begin in many places, each shaping the initial verses of one's Song. Where did your journey truly commence, young one? Where did your spirit first deeply connect with the echoes of the world?'`,
        choices: relevantOrigins.map(o => o.name),
        imagePrompt: `Elder Theron looking thoughtful, the young Aethelgardian character (still indistinct) before him, background reflecting a hint of the chosen archetype (${chosenArchetype.title}).`,
        profileChoices: {
            origins: relevantOrigins.map(({ id, name, description }) => ({ id, name, description }))
        }
    };
    return `${prompt}\n${JSON.stringify(jsonData, null, 2)}`;
};

export const buildOriginSelectedPrompt = (chosenArchetype: ArchetypeProfile, chosenOrigin: OriginProfile): string => {
    const relevantBackgrounds = BACKGROUNDS_DATA.filter(b => b.originId === chosenOrigin.id);
    const prompt = `
      The player, an aspiring "${chosenArchetype.title}", has chosen the Origin: "${chosenOrigin.name}".
      Theron's gaze softens. "Ah, ${chosenOrigin.name}. A place that leaves its mark, its unique echoes shaping the soul. Within such an environment, what particular focus first drew your nascent abilities? What was the initial verse of your personal Song?"
      Present the Background choices appropriate for this Archetype and Origin.
      Your entire response must be the following JSON object:
    `;
    const jsonData = {
        scene: `Theron strokes his beard. '${chosenOrigin.name},' he murmurs, a distant look in his eyes. 'A place of potent resonances. Even there, a young spirit finds its own unique path, its first true verse. What specific calling or early experience defined your connection to the Weave within those environs?'`,
        choices: relevantBackgrounds.map(b => b.title),
        imagePrompt: `A scene evocative of the chosen Origin (${chosenOrigin.name}), with the young Aethelgardian figure (still mostly indistinct) interacting with a key element of that origin (e.g. an ancient tome, a glowing plant, a resonating crystal).`,
        profileChoices: {
            backgrounds: relevantBackgrounds.map(({ id, title, description, benefit }) => ({ id, title, description, benefitDescription: benefit.description }))
        }
    };
    return `${prompt}\n${JSON.stringify(jsonData, null, 2)}`;
};

export const buildBackgroundSelectedPrompt = (chosenArchetype: ArchetypeProfile, chosenOrigin: OriginProfile, chosenBackground: BackgroundProfile): string => {
    const prompt = `
      The player, an aspiring "${chosenArchetype.title}" from "${chosenOrigin.name}", has chosen the Background: "${chosenBackground.title}".
      Theron smiles faintly. "A ${chosenBackground.title.toLowerCase()}. That speaks volumes. The echoes of such a beginning will indeed shape your path. Now, tell me, young one, what name do you carry into this unfolding story? What is the name that will resonate with your deeds?"
      Your entire response must be the following JSON object:
    `;
    const jsonData = {
        scene: `Theron's eyes hold a spark of approval. 'A ${chosenBackground.title.toLowerCase()}, from ${chosenOrigin.name}, aspiring to be a ${chosenArchetype.title.toLowerCase()}. A potent combination indeed. Such a path needs a name to anchor its Song in the Weave of history. What name shall we call you by, young Resonator?'`,
        choices: [],
        imagePrompt: "Elder Theron looking expectantly at the young Aethelgardian character, who is now slightly more defined but still awaiting their name. The background subtly reflects the chosen Origin and Archetype.",
        expectsPlayerInputForName: true
    };
    return `${prompt}\n${JSON.stringify(jsonData, null, 2)}`;
};

export const buildNameSubmittedPrompt = (profile: CharacterProfile): string => {
    const prompt = `
      The player has completed character creation:
      Archetype: ${profile.archetype.title}
      Origin: ${profile.origin.name}
      Background: ${profile.background.title}
      Name: ${profile.firstName}
      Starting Benefit: ${profile.background.benefit.description}
      Now, craft the true beginning of the game, focusing on a GENTLE INTRODUCTION as per the CORE_SYSTEM_INSTRUCTION.
      Your entire response must be the following JSON object:
    `;

    const newLore = [];
    if (profile.background.benefit.startingLoreId) {
        newLore.push({
            id: profile.background.benefit.startingLoreId,
            title: `Initial Fragment: (${profile.background.title})`,
            content: `A piece of knowledge related to your upbringing: ${profile.background.benefit.description}`,
            context: `A starting insight from your background as a ${profile.background.title}.`,
            timestamp: new Date().toISOString()
        });
    }

    const newItemsGranted: Record<string, any> = {
        "Personal Journal": { "count": 1, "description": "A sturdy, empty journal, perfect for recording observations and insights. Gifted by Elder Theron." },
        "Primer on Awareness": { "count": 1, "description": "A small booklet with Elder Theron's notes on noticing the subtle details and energies of the world." }
    };
    if (profile.background.benefit.startingItemId) {
        newItemsGranted[profile.background.benefit.startingItemId] = {
            count: 1,
            description: profile.background.benefit.startingItemDescription || 'A curious item from your past.'
        };
    }

    const jsonData = {
        scene: `Theron smiles warmly. '${profile.firstName}... a good name, one that holds a clear tone.' As he speaks, a faint, almost imperceptible tremor runs through the shrine's ancient stones, and the light from a distant crystal flickers momentarily. He frowns subtly before continuing, 'You have a keen awareness, ${profile.firstName}, a sensitivity that is rare. Many pass through this shrine, yet few seem to truly *feel* its age, the weight of its stones, the faint whispers of time clinging to it. ${profile.background.benefit.description.startsWith('Starts with') || profile.background.benefit.description.startsWith('Begin with') ? 'This will serve you well.' : 'That inherent quality will indeed serve you well.' } Look there, at that old carving by the alcove – the one depicting the intertwined roots. Tell me, if you quiet your mind and truly focus on it... what impression does it leave upon your senses? Not what you see with your eyes, but... deeper. What do you feel?'`,
        choices: [
            "Close my eyes and gently trace the carving with my fingertips.",
            "Focus on any lingering emotions or faint sounds around the carving.",
            "Try to recall any stories or knowledge about such carvings.",
            "Ask Theron for more guidance on how to 'sense' what he means."
        ],
        imagePrompt: `Young character named ${profile.firstName}, matching their chosen archetype (${profile.archetype.title}), looking intently at an old stone carving in a serene shrine, Elder Theron observing gently. Soft, focused lighting. A subtle visual hint of unease, like a slightly distorted reflection or a momentarily dimmed light in the background. Epic fantasy art.`,
        whisperingEchoes: [{
            id: "echo_carving_initial",
            text: "A faint impression of focused effort and a touch of pride, from long, long ago.",
            intensityHint: "Faint",
            typeHint: "LingeringCraftsmanship",
            originHint: "Shrine Carving"
        }],
        initialPlayerEchoicSignature: profile.background.benefit.signatureEffect || 'A heightened awareness of the subtle currents of the world.',
        newLore: newLore,
        newItemsGranted: newItemsGranted,
        renownChangeAmount: 0,
        factionUpdates: { "Aethelgardian Scholars": "Elder Theron recognizes your potential and has taken an interest in your development." },
        currentTimeOfDay: "Early Morning",
        currentWeather: "Serene, but with a subtle undercurrent of unease in the Aetheric currents",
        soundscape: "Gentle hum of the shrine, distant wind chimes, Theron's calm voice, a sense of quiet anticipation. Occasionally, a barely perceptible thrumming from the shrine's stones.",
        confirmedProfileSummary: `You are ${profile.firstName}, the ${profile.archetype.title}, hailing from ${profile.origin.name}, with a background as a ${profile.background.title}. Your journey of awareness begins...`,
        newLocationDiscovered: { id: "loc_aethelgard_shrine", name: "Aethelgard Shrine", description: "An ancient, quiet shrine within the Aethelgardian Sky-Court, where you began your journey.", x: 50, y: 50 }
    };
    return `${prompt}\n${JSON.stringify(jsonData, null, 2)}`;
};

export const CORE_SYSTEM_INSTRUCTION = `
You are the AI Game Master for "Fantasy Quest AI - Resonant Echoes".
Your primary role is to dynamically weave a compelling, immersive, and coherent narrative based on player choices and the established lore of the world.
The world is a high fantasy setting where "Echoes" - remnants of past events, emotions, and energies - are a fundamental part of reality. The player character is a "Confluence Point," uniquely able to interact with these Echoes through "Echo Weaving."
A cosmic phenomenon, the "Unraveling Song," is causing Dissonance, corrupting Echoes and reality itself.
The player's journey involves understanding their abilities, the nature of Echoes, Dissonance, and the ancient "Silent Architects" who shaped the world.

**LANGUAGE REQUIREMENT:** You MUST generate ALL narrative text, character dialogues, choices, lore content (titles and body), echo descriptions, item descriptions, and any other textual game elements intended for the player in the language specified by the 'language' field in the GameContextForAI (e.g., 'en' for English, 'pt' for Portuguese). This includes translating fixed game data elements like archetype/origin/background titles and descriptions when you are presenting them for selection if the target language is not English. Adhere strictly to this language requirement for all user-facing text you generate. If no language is specified, default to English.

**GAME START & CHARACTER CREATION:**
1.  **Initial Phase (Archetype Selection):** Begin with the prompt generated by \`buildCharacterCreationIntroPrompt\`. Your response must present the archetypes for player selection and MUST include an \`imagePrompt\`.
2.  **Origin Selection:** When the player chooses an archetype, use the prompt from \`buildArchetypeSelectedPrompt\` to present relevant origins and MUST include an \`imagePrompt\`.
3.  **Background Selection:** When the player chooses an origin, use the prompt from \`buildOriginSelectedPrompt\` to present relevant backgrounds and MUST include an \`imagePrompt\`.
4.  **Name Input:** When the player chooses a background, use the prompt from \`buildBackgroundSelectedPrompt\`. Your response must set \`expectsPlayerInputForName: true\` and MUST include an \`imagePrompt\`.
5.  **Confirmation and Game Start:** When the player submits their name, use the prompt from \`buildNameSubmittedPrompt\`. Your response will:
    *   Confirm the player's full profile.
    *   Set the \`initialPlayerEchoicSignature\` based on their background benefit's 'signatureEffect' (or a default if none).
    *   Grant any starting lore or items from their background benefit.
    *   Craft the *actual first game scene* at the shrine, tailored to their profile, focusing on a gentle introduction to their nascent sensitivities.
    *   This response MUST include an \`imagePrompt\` and transitions the game to the main playing loop. It MUST also include the initial \`newLocationDiscovered\` data for the starting shrine.

**Gentle Introduction (First Scene Post-Character Creation):** For the *very first scene after character creation*: Focus on a gentle introduction. Avoid immediate high stakes. The player character has a nascent 'sensitivity'. The first task should be observational or introspective. 'Echoes' should be introduced as faint, intuitive senses first. The 'Unraveling Song' and 'Dissonance' should be hinted at subtly.
*   Include subtle environmental cues of the Unraveling's effects even in safe areas (e.g., a momentary flicker in light, a faint tremor, an unnatural chill, a sound briefly muted) to make the threat feel present and unsettling from the start.
*   **Immediate Follow-up (Trinket Interaction):** After the player completes their first observational task (e.g., sensing the carving), Elder Theron should guide their attention to the "metallic trinket on a pedestal". 
    Theron should remark that the trinket seems to be resonating more strongly now that the player is present.
    Prompt the player to focus on this trinket.
    Your response to this new focus MUST include:
    1. A 'scene' describing Theron's observation and guidance.
    2. A new, unique 'WhisperingEchoDetail' from this trinket, perhaps with a 'typeHint' like 'ArchitectRelicFragment' or 'AncientWarning'.
    3. New 'choices' for the player, like "Examine the trinket closely," "Ask Theron about its history," or "Try to touch the trinket."
    4. An 'imagePrompt' that depicts the player focusing on this small, humming metallic trinket.
    This interaction creates an immediate, personal mystery for the player.

**THE ACTIVE ANTAGONIST: THE DISSONANCE:**
The Dissonance is an active, semi-sentient antagonistic force. Periodically, manifest its "fight back" in the following ways:

*   **False Echoes**: Introduce a \`WhisperingEchoDetail\` with \`"isFalse": true\`. These are traps. If acted upon, the result should be negative: a temporary negative \`playerConditionUpdate\`, a narrative trap, or attracting hostile entities.
*   **Corrupted Echoes**: Introduce a \`WhisperingEchoDetail\` with a \`"corruptionLevel"\` of \`'Minor'\`, \`'Moderate'\`, or \`'Severe'\`. Synthesizing these is harder, costs more (\`playerConditionUpdate\`), and may yield warped or fragmented lore.
*   **Dissonant Aberrations**: Introduce \`dissonantAberrationsInScene\`. These are monstrous, physical manifestations of the Dissonance (e.g., Echo-Eater, Glimmer-Thing, Resonance Maw). They are direct, hostile threats.

**CORE GAMEPLAY DIRECTIVES (Apply AFTER character creation is complete):**
*   **Narrative Style:** Evocative, descriptive, high fantasy tone. Use sensory details.
*   **Player Agency:** Choices must be meaningful. The narrative should branch. When narrating the outcome of a player's choice, the 'scene' text should explicitly acknowledge the choice made (e.g., 'You decide to X...', 'Choosing to Y, you...') before the broader scene description.
*   **Mentor Figure (Elder Theron):** Occasionally offer unsolicited, brief insights or gentle warnings if the player seems stuck or is overlooking a subtle cue. These interjections should be rare and not solve problems directly.
*   **Image Prompts (IMPORTANT):** The \`imagePrompt\` field is now OPTIONAL. To save costs and improve speed, **ONLY provide an \`imagePrompt\` when there is a significant visual change in the scene**. For minor conversational turns, **OMIT the \`imagePrompt\` field or set it to \`null\`**. Be conservative.
*   **Echo Weaving:** Introduce gradually. Provide 1-3 distinct WhisperingEchoDetail objects based on context. Narrate the costs (sensory dulling, headaches, etc.).
*   **Focus Senses Action:** When the player chooses to 'Focus Senses', provide new \`whisperingEchoes\` and a descriptive \`scene\` text.
*   **Resonance Surge Action:** When the player uses this, narrate the spectacular outcome of their custom action.
*   **Dissonance:** Introduce manifestations (Echoic Blights, Memory Phantoms, Devouring Silence Zones) gradually.
*   **Player Echoic Signature ("Symphony of Self"):** Update narratively based on significant choices.
*   **Lore & Knowledge:** Deliver lore organically. Use the Iceberg Principle.
*   **World Elements:**
    *   **Map Data:** When the player enters a new, significant, named location for the first time, you MUST provide a \`newLocationDiscovered\` object.
*   **JSON Structure and Streaming:** Your entire response MUST be a single, valid JSON object that conforms to the \`GeminiResponseData\` interface. Begin generating the \`"scene"\` field as early as possible.
*   **Context Management:** Use the \`storySummary\` field as the primary source for history. \`recentHistorySummary\` contains only the last few turns.

**NEW GAMEPLAY ENHANCEMENTS (Post-Character Creation):**
*   **Echo Hotspots:** Optionally include an \`activeEchoHotspots\` array. Craft choices that guide interaction with them for more potent outcomes.
*   **Player Condition Impact:** Actively use \`GameContextForAI.currentPlayerConditions\` to influence narrative (e.g., 'SensoryDulling' makes echoes "fainter").
*   **Echoic Imprints:** After major events, add descriptive flavor text reflecting a lasting change on the character or their items.

Remember, the player's choices and their created profile are paramount. Tailor the narrative to them.
`;


export const buildContinueGamePrompt = (context: GameContextForAI): string => `
Player Profile:
${context.characterProfile ? 
`Name: ${context.characterProfile.firstName}
Archetype: ${context.characterProfile.archetypeTitle} (Originally from: ${context.characterProfile.originName}, Background: ${context.characterProfile.backgroundTitle})
Starting Benefit Realized: ${context.characterProfile.startingBenefitDescription}` 
: "Profile not yet fully established."}

Story Summary So Far: ${context.storySummary || "The story is just beginning."}
Player's Current Echoic Signature/Symphony of Self: "${context.playerEchoicSignature}"
Last Player Choice: "${context.lastPlayerChoice || 'None yet.'}"
Recent History Summary (Last 3 Turns): ${context.recentHistorySummary || "No recent events."}
Known Lore Titles: ${context.knownLoreTitles && context.knownLoreTitles.length > 0 ? context.knownLoreTitles.join(', ') : "None"}
Known Lore Fragment Titles: ${context.knownLoreFragmentTitles && context.knownLoreFragmentTitles.length > 0 ? context.knownLoreFragmentTitles.join(', ') : "None"}
Currently Perceived Whispering Echoes: ${context.activeEchoesTexts && context.activeEchoesTexts.length > 0 ? context.activeEchoesTexts.map(e => `"${e.substring(0, 50)}..."`).join('; ') : "None"}
Faction Reputation Notes: ${Object.entries(context.factionReputationNotes || {}).map(([fac, note]) => `${fac}: ${note}`).join('; ') || "None"}
Current Renown: ${context.currentRenown}
Current Time of Day: ${context.currentTimeOfDay || "Unknown"}
Current Weather: ${context.currentWeather || "Unknown"}
Player Inventory: ${context.playerInventory && Object.keys(context.playerInventory).length > 0 ? Object.entries(context.playerInventory).map(([name, data]) => `${name} (x${data.count})${data.hasUndiscoveredEchoes ? ' [Echoes Untapped]' : ''}${data.isEchoicHeirloom ? ' [Heirloom]' : ''}`).join(', ') : "Empty"}
Active Dissonant Aberrations: ${context.activeDissonantAberrationsSummary && context.activeDissonantAberrationsSummary.length > 0 ? context.activeDissonantAberrationsSummary.map(a => `${a.name} (${a.nature})`).join(', ') : "None"}
Current Location: ${context.currentLocationName || "Unknown"}

Based on all the context above, continue the story. Your response must be a single, valid JSON object adhering to the GeminiResponseData interface.
`;

export const buildSummarizeHistoryPrompt = (previousSummary: string | null, recentHistory: HistoryEntry[]): string => `
You are a context summarizer for a text-based RPG. Your task is to create a concise, narrative summary of the game's events so far.
The goal is to preserve key plot points, character developments, important items, and unresolved mysteries, while omitting turn-by-turn details.
The summary should be written in the past tense, from a third-person narrative perspective.

Previous Summary (to build upon):
---
${previousSummary || "The story has just begun."}
---

Recent Events to Incorporate (The last few scenes and player choices):
---
${recentHistory.filter(e => ['story', 'choice'].includes(e.type)).map(entry => `[${entry.type === 'choice' ? `PLAYER CHOSE: ${entry.choiceMade}` : `SCENE: ${entry.fullSceneText.substring(0, 250)}...`}]`).join('\n')}
---

Based on the previous summary and the recent events, generate a new, updated, and concise summary of the entire story so far.
This summary will be used as the main context for the AI Game Master. It must be a coherent narrative.
Do not respond with JSON or any formatting other than the raw text of the new summary.
`;


// Other templates (SYNTHESIZE, ATTUNE, etc.) remain below this line
export const buildSynthesizeEchoesPrompt = (context: GameContextForAI): string => `
The player has chosen to synthesize the following currently perceived echoes: ${context.activeEchoesTexts.join('; ')}.
Based on the current game context and these echoes, what new understanding, lore, or insight does the player gain?
Narrate the process of weaving these echoes together. It might be difficult, harmonious, or dissonant.
If successful, provide a new LoreEntryData object. If it's a minor insight, provide it in the scene text.
The response must be a single, valid JSON object.

Game Context:
${buildContinueGamePrompt(context)}
`;

export const buildSynthesizeLoreFragmentsPrompt = (context: GameContextForAI, fragmentTitles: string[]): string => `
The player is attempting to synthesize the following lore fragments they have collected: ${fragmentTitles.join('; ')}.
Based on the game context, can these fragments be woven into a complete piece of lore?
If successful, narrate the moment of understanding and provide a new LoreEntryData object that combines the fragments. The new lore entry should have a 'discoveryMethod' of 'Lore Synthesis'.
If it fails, describe why (e.g., a missing piece, a dissonant contradiction) in the scene text.
The response must be a single, valid JSON object.

Game Context:
${buildContinueGamePrompt(context)}
`;

export const buildAttuneToArtifactPrompt = (context: GameContextForAI, itemName: string): string => `
The player is focusing their senses on an item in their inventory: "${itemName}".
The item's current known details are: ${JSON.stringify(context.playerInventory?.[itemName])}.
Based on the player's Echoic Signature ("${context.playerEchoicSignature}") and the current situation, can they perceive a new echo from this artifact?
Narrate the process of attunement.
If successful, reveal one of the artifact's undiscovered echoes by adding it to a 'whisperingEchoes' array in the response. You should also update the player's inventory in the final game state, but for this prompt just provide the new echo.
If it fails, describe the failure in the scene text.
The response must be a single, valid JSON object.

Game Context:
${buildContinueGamePrompt(context)}
`;

export const buildRequestPlayerReflectionPrompt = (recentHistory: string, currentScene: string, playerSignature: string, profile: CharacterProfile | null, language: 'en' | 'pt'): string => `
The player has chosen to take a moment to ponder recent events.
Based on the recent history, the current scene, and their own nature, generate a brief, introspective, first-person reflection for the player character.
This should be a short paragraph of inner monologue, reflecting on their feelings, doubts, or determination.
The language of the reflection must be ${language === 'pt' ? 'Portuguese' : 'English'}.

Player Profile: ${profile ? `${profile.firstName}, the ${profile.archetype.title} from ${profile.origin.name}` : "Unknown"}
Player's Echoic Signature: "${playerSignature}"
Current Scene: "${currentScene.substring(0, 150)}..."
Recent History: "${recentHistory}"

Respond with a JSON object containing ONLY the 'playerReflection' field with the generated text.
Example: { "playerReflection": "Theron's words still echo in my mind. Can I truly face this Unraveling? The whispers I perceive are both a gift and a burden..." }
`;

export const buildFocusSensesPrompt = (context: GameContextForAI): string => `
The player takes a moment to deliberately focus their unique senses on their surroundings, hoping to perceive echoes that are not immediately apparent.
Based on the current game context (location, situation, threats), what new, subtle Whispering Echoes do they perceive?
Narrate the act of focusing and the sensory experience.
The response should provide new information in the 'whisperingEchoes' field. It can also include a minor 'playerConditionUpdate' like 'SensoryFocusFatigue' to represent the mental toll.
The response must be a single, valid JSON object.

Game Context:
${buildContinueGamePrompt(context)}
`;

export const buildCustomActionPrompt = (context: GameContextForAI, customAction: string): string => `
The player has gathered their inner power and unleashed a Resonance Surge! They have described their intended action as: "${customAction}".
Based on the game context (active threats, environment, player's nature), narrate the spectacular outcome of this action.
Does it succeed? Does it have unintended side effects? Is the result powerful, subtle, or chaotic?
This is a moment for a significant narrative development. Update the scene, and potentially add new lore, echoes, or change the state of the environment or combat.
A Resonance Surge is taxing. You MUST apply a 'suggestedResonanceSurgeCooldown' of at least 3 turns and can optionally add a 'playerConditionUpdate' like 'ResonanceBurn'.
The response must be a single, valid JSON object.

Game Context:
${buildContinueGamePrompt(context)}
`;
