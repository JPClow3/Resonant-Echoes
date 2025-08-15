import { ArchetypeProfile, OriginProfile, BackgroundProfile } from '../types';

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
