import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameState } from './state/GameStateContext';
import { useTranslation } from './lib/i18n';
import { AudioService } from './services/audioService';
import * as GeminiService from './services/geminiService';
// Ensure we can access the helper for appending the API key
// (if using "import * as ...", this works as GeminiService.getVideoUrlWithApiKey)
import { GamePhase, CharacterProfile, GeminiResponseData, HistoryEntry, PlayerNote, MindMapLayout } from './types';
import {
    buildCharacterCreationIntroPrompt, buildArchetypeSelectedPrompt, buildOriginSelectedPrompt,
    buildBackgroundSelectedPrompt, buildNameSubmittedPrompt, buildContinueGamePrompt,
    buildSynthesizeEchoesPrompt, buildSynthesizeLoreFragmentsPrompt, buildAttuneToArtifactPrompt,
    buildRequestPlayerReflectionPrompt, buildFocusSensesPrompt, buildCustomActionPrompt, buildSummarizeHistoryPrompt
} from './data/prompts';
import { ARCHETYPES_DATA, ORIGINS_DATA, BACKGROUNDS_DATA } from './data/characterCreation';

// Import all components
import LoadingIndicator from './components/LoadingIndicator';
import StoryDisplay from './components/StoryDisplay';
import ImageDisplay from './components/ImageDisplay';
import ChoicesDisplay from './components/ChoicesDisplay';
import RenownDisplay from './components/RenownDisplay';
import WhisperingEchoesDisplay from './components/WhisperingEchoesDisplay';
import LoreJournal from './components/LoreJournal';
import HistoryLog from './components/HistoryLog';
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

const App: React.FC = () => {
    const { state, dispatch } = useGameState();
    const { t } = useTranslation();
    const audioService = useRef(new AudioService());
    const hasSentApiCall = useRef(false);

    // --- Effects ---
    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'light';
        const cb = localStorage.getItem('colorBlindAssist') === 'true';
        document.documentElement.classList.toggle('theme-dark', theme === 'dark');
        document.documentElement.classList.toggle('cb-assist-active', cb);
        if (cb && !state.isColorBlindAssistActive) dispatch({ type: 'TOGGLE_COLOR_BLIND_ASSIST' });
    }, []);

    useEffect(() => {
        audioService.current.setVolume(state.currentVolume / 100);
        audioService.current.toggleMute(state.isMuted);
    }, [state.currentVolume, state.isMuted]);

    useEffect(() => {
        if (!state.homeScreenImageFetchAttempted) {
             dispatch({ type: 'SET_HOME_SCREEN_IMAGE_LOADING', payload: true });
            GeminiService.generateHomeScreenImage()
                .then(url => dispatch({ type: 'SET_HOME_SCREEN_IMAGE_URL', payload: { url } }))
                .catch(error => dispatch({ type: 'SET_HOME_SCREEN_IMAGE_URL', payload: { url: null, error: GeminiService.getApiErrorMessage(error, t) } }));
        }
    }, [state.homeScreenImageFetchAttempted, dispatch, t]);

    useEffect(() => {
        if (state.currentImagePrompt) {
            GeminiService.generateImage(state.currentImagePrompt)
                .then(url => dispatch({ type: 'SET_IMAGE_URL', payload: url }))
                .catch(error => console.error("Image generation failed:", error));
        }
    }, [state.currentImagePrompt, dispatch]);

    useEffect(() => {
        if (state.currentSoundscape) {
            audioService.current.playMusic(state.currentSoundscape);
        }
    }, [state.currentSoundscape]);
    
    // --- API Call Abstraction ---
    const callApiStream = useCallback(async (prompt: string, message?: string) => {
        if (!process.env.API_KEY) {
            dispatch({ type: 'API_CALL_FAILURE', payload: t("ERROR_API_KEY_MISSING") });
            return;
        }
        dispatch({ type: 'API_CALL_START', payload: { message } });
        hasSentApiCall.current = true;

        try {
            let buffer = '';
            for await (const textChunk of GeminiService.generateContentStream(prompt)) {
                buffer += textChunk;
                dispatch({ type: 'STREAMING_TEXT_UPDATE', payload: buffer });
            }
            const responseData: GeminiResponseData = JSON.parse(buffer);
            dispatch({ type: 'API_CALL_SUCCESS', payload: responseData });
        } catch (error: any) {
            dispatch({ type: 'API_CALL_FAILURE', payload: GeminiService.getApiErrorMessage(error, t) });
        }
    }, [dispatch, t]);
    
    const callApiForSummary = useCallback(async (prompt: string) => {
        if (!process.env.API_KEY) return null;
        try {
            return await GeminiService.generateContent(prompt);
        } catch (error) {
            console.error("Error fetching summary:", error);
            return null;
        }
    }, []);

    const buildGameContext = useCallback((currentState: GameState = state) => {
        const historyForSummary = currentState.storySummary
            ? currentState.historyLog.slice(-3)
            : currentState.historyLog.slice(-5);

        const recentHistory = historyForSummary.map(h => {
            if (h.type === 'choice') return `You chose: "${h.choiceMade}"`;
            if (h.type === 'story') return `Scene: ${h.sceneSummary}`;
            return null;
        }).filter(Boolean).join(' -> ');
        
        const knownLoreTitles = currentState.loreJournal.map(l => l.playerGivenName || l.title);
        const knownLoreFragmentTitles = currentState.loreFragments.map(f => f.titleHint);
        const activeEchoesTexts = currentState.whisperingEchoes.map(e => e.text);
        const currentInventory = currentState.playerInventory ? Object.entries(currentState.playerInventory).reduce((acc, [name, data]) => {
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
        }, {} as any) : {};

        return {
          characterProfile: currentState.characterProfile ? {
            archetypeTitle: currentState.characterProfile.archetype.title,
            originName: currentState.characterProfile.origin.name,
            backgroundTitle: currentState.characterProfile.background.title,
            firstName: currentState.characterProfile.firstName,
            startingBenefitDescription: currentState.characterProfile.background.benefit.description
          } : null,
          storySummary: currentState.storySummary,
          lastPlayerChoice: currentState.historyLog.filter(h => h.type === 'choice').slice(-1)[0]?.choiceMade,
          recentHistorySummary: recentHistory,
          knownLoreTitles,
          knownLoreFragmentTitles,
          activeEchoesTexts,
          playerEchoicSignature: currentState.playerEchoicSignature,
          factionReputationNotes: currentState.factionReputationNotes,
          currentRenown: currentState.renown,
          currentTimeOfDay: currentState.currentTimeOfDay,
          currentWeather: currentState.currentWeather,
          playerInventory: currentInventory,
          currentRumors: currentState.currentRumors,
          currentActiveDissonanceEffect: currentState.activeDissonanceEffect?.description,
          currentPlayerConditions: currentState.playerConditions.map(c => c.description),
          activeDissonantAberrationsSummary: currentState.activeDissonantAberrations?.map(a => ({name: a.name, nature: a.aberrationNature})),
          activeEchoHotspotsSummary: currentState.activeEchoHotspots?.map(h => ({id: h.id, name: h.name})),
          isResonanceSurgeAvailable: currentState.isResonanceSurgeAvailable,
          resonanceSurgeCooldownTurnsLeft: currentState.resonanceSurgeCooldown,
          discoveredLocationsSummary: currentState.discoveredLocations.map(l => ({ name: l.name })),
          currentLocationName: currentState.discoveredLocations.find(l => l.id === currentState.currentLocationId)?.name,
          language: currentState.currentLanguage,
        };
    }, [state]);

    // --- Game Flow Handlers ---
    const startGameFlow = useCallback(async () => {
        dispatch({ type: 'START_GAME' });
        const cachedVideo = localStorage.getItem('resonantEchoes_introVideo');
        if (cachedVideo) {
             const { url, timestamp } = JSON.parse(cachedVideo);
             if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 1 day cache
                // On cache hit, re-apply API key before use
                dispatch({ type: 'INTRO_VIDEO_SUCCESS', payload: { url: GeminiService.getVideoUrlWithApiKey(url) } });
                return;
             }
        }
        try {
            const videoUrl = await GeminiService.generateIntroVideo(
                (message: string) => dispatch({ type: 'INTRO_VIDEO_LOADING_UPDATE', payload: { message } }),
                t
            );
            // Store only the *sanitized* video URL (without API key) in localStorage
            localStorage.setItem('resonantEchoes_introVideo', JSON.stringify({ url: videoUrl, timestamp: Date.now() }));
            // When using the URL, always append the API key in-memory only
            dispatch({ type: 'INTRO_VIDEO_SUCCESS', payload: { url: GeminiService.getVideoUrlWithApiKey(videoUrl) } });
        } catch (e: any) {
            dispatch({ type: 'INTRO_VIDEO_FAILURE', payload: { error: e.message || String(e) } });
        }
    }, [dispatch, t]);

    useEffect(() => {
        if (state.gameStarted && !state.characterProfile && !hasSentApiCall.current && state.currentScene === '') {
            callApiStream(buildCharacterCreationIntroPrompt());
        }
    }, [state.gameStarted, state.characterProfile, state.currentScene, callApiStream]);

    const handleChoice = useCallback(async (choice: string, index: number) => {
        dispatch({ type: 'SET_LAST_CHOICE', payload: index });
        
        const newHistoryEntry: HistoryEntry = {
          id: `hist_choice_${new Date().toISOString()}`,
          sceneSummary: `Made choice: "${choice}"`,
          fullSceneText: state.currentScene,
          choiceMade: choice,
          timestamp: new Date().toISOString(),
          type: 'choice'
        };
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: newHistoryEntry });
        
        const newStateAfterChoice = { ...state, historyLog: [...state.historyLog, newHistoryEntry] };
        
        const turnCount = newStateAfterChoice.historyLog.filter(h => h.type === 'story').length;
        let currentContext = buildGameContext(newStateAfterChoice);
        let summaryMessage: string | undefined = undefined;

        if (turnCount > 0 && turnCount % 7 === 0) {
            summaryMessage = t("Summarizing the chronicle...");
            const summaryPrompt = buildSummarizeHistoryPrompt(
                newStateAfterChoice.storySummary,
                newStateAfterChoice.historyLog
            );
            const summary = await callApiForSummary(summaryPrompt);
            if (summary) {
                dispatch({ type: 'SUMMARIZE_HISTORY_SUCCESS', payload: summary });
                const newStateAfterSummary = { ...newStateAfterChoice, storySummary: summary };
                currentContext = buildGameContext(newStateAfterSummary);
            }
        }

        (currentContext as any).lastPlayerChoice = choice;
        const prompt = buildContinueGamePrompt(currentContext as any);
        callApiStream(prompt, summaryMessage);

    }, [state, buildGameContext, callApiStream, callApiForSummary, t, dispatch]);

    const handleSynthesizeEchoes = () => {
        const context = buildGameContext();
        const prompt = buildSynthesizeEchoesPrompt(context as any);
        callApiStream(prompt);
      };
    
    const handleFocusSenses = () => {
        const context = buildGameContext();
        const prompt = buildFocusSensesPrompt(context as any);
        callApiStream(prompt);
    };
    
    const handleCustomAction = (actionText: string) => {
        const context = buildGameContext();
        const prompt = buildCustomActionPrompt(context as any, actionText);
        callApiStream(prompt);
    };

    const handleSynthesizeFragments = (fragmentIds: string[]) => {
        const fragmentsToSynthesize = state.loreFragments.filter(f => fragmentIds.includes(f.id));
        if (fragmentsToSynthesize.length < 2) return;
        const context = buildGameContext();
        const prompt = buildSynthesizeLoreFragmentsPrompt(context as any, fragmentsToSynthesize.map(f => f.titleHint));
        callApiStream(prompt);
    };
    
    const handleAttuneToArtifact = (itemName: string) => {
        const context = buildGameContext();
        const prompt = buildAttuneToArtifactPrompt(context as any, itemName);
        callApiStream(prompt);
    };

    const handleRequestReflection = () => {
        const context = buildGameContext();
        const prompt = buildRequestPlayerReflectionPrompt(context.recentHistorySummary, state.currentScene, state.playerEchoicSignature, state.characterProfile, state.currentLanguage);
        callApiStream(prompt);
    };

    const handleNameInsight = (name: string) => {
        const context = buildGameContext();
        (context as any).playerNamedInsight = {
            originalInsight: state.insightToName!,
            chosenName: name
        };
        const prompt = buildContinueGamePrompt(context as any);
        callApiStream(prompt);
        dispatch({ type: 'CLEAR_INSIGHT_TO_NAME' });
    };

    const handleInterpretLore = (interpretation: string) => {
        dispatch({ type: 'SUBMIT_LORE_INTERPRETATION', payload: interpretation });
        const context = buildGameContext();
        (context as any).playerInterpretedLore = {
            loreTitle: state.loreToInterpret!.title,
            chosenInterpretation: interpretation,
        };
        const prompt = buildContinueGamePrompt(context as any);
        callApiStream(prompt);
    };
    
    const handleArchetypeChoice = (archetypeId: string) => {
        dispatch({ type: 'CHOOSE_ARCHETYPE', payload: archetypeId });
        const chosenArchetype = ARCHETYPES_DATA.find(a => a.id === archetypeId)!;
        const prompt = buildArchetypeSelectedPrompt(chosenArchetype);
        callApiStream(prompt);
    };

    const handleOriginChoice = (originId: string) => {
        dispatch({ type: 'CHOOSE_ORIGIN', payload: originId });
        const chosenArchetype = ARCHETYPES_DATA.find(a => a.id === state.selectedArchetypeId)!;
        const chosenOrigin = ORIGINS_DATA.find(o => o.id === originId)!;
        const prompt = buildOriginSelectedPrompt(chosenArchetype, chosenOrigin);
        callApiStream(prompt);
    };
    
    const handleBackgroundChoice = (backgroundId: string) => {
        dispatch({ type: 'CHOOSE_BACKGROUND', payload: backgroundId });
        const chosenArchetype = ARCHETYPES_DATA.find(a => a.id === state.selectedArchetypeId)!;
        const chosenOrigin = ORIGINS_DATA.find(o => o.id === state.selectedOriginId)!;
        const chosenBackground = BACKGROUNDS_DATA.find(b => b.id === backgroundId)!;
        const prompt = buildBackgroundSelectedPrompt(chosenArchetype, chosenOrigin, chosenBackground);
        callApiStream(prompt);
    };

    const handleNameSubmission = (name: string) => {
        dispatch({ type: 'SUBMIT_NAME', payload: name });
        const tempProfile: CharacterProfile = {
            archetype: ARCHETYPES_DATA.find(a => a.id === state.selectedArchetypeId)!,
            origin: ORIGINS_DATA.find(o => o.id === state.selectedOriginId)!,
            background: BACKGROUNDS_DATA.find(b => b.id === state.selectedBackgroundId)!,
            firstName: name
        };
        const prompt = buildNameSubmittedPrompt(tempProfile);
        callApiStream(prompt);
    };
    
    const handleFullReset = useCallback(() => {
        dispatch({ type: 'RESET_GAME' });
        window.location.reload();
      }, [dispatch]);

    // --- Render Logic ---
    const getGamePhase = () => {
        if (!state.gameStarted) return GamePhase.HomeScreen;
        if (state.isIntroVideoLoading || state.introVideoUrl) return GamePhase.IntroVideo;
        if (state.error) return GamePhase.Error;
        if (!state.characterProfile) {
            if (!state.selectedArchetypeId) return GamePhase.CharacterCreation;
            if (!state.selectedOriginId) return GamePhase.CharacterCreation;
            if (!state.selectedBackgroundId) return GamePhase.CharacterCreation;
            if (!state.firstName) return GamePhase.CharacterCreation;
            return GamePhase.CharacterCreation;
        }
        if (state.insightToName) return GamePhase.AwaitingNameInput;
        if (state.awaitingLoreInterpretation) return GamePhase.AwaitingLoreInterpretation;
        return GamePhase.Playing;
    };
    
    const gamePhase = getGamePhase();

    const renderMainContent = () => {
        switch (gamePhase) {
            case GamePhase.HomeScreen:
                return (
                    <>
                        <HomeScreen
                          t={t}
                          onStartNewGame={startGameFlow}
                          onOpenSettings={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'settings' })}
                          homeScreenImageUrl={state.homeScreenImageUrl}
                          isLoading={state.isHomeScreenImageLoading}
                          error={state.error}
                        />
                    </>
                );
            case GamePhase.IntroVideo:
                return (
                    <IntroVideoPlayer
                        t={t}
                        isOpen={true}
                        videoUrl={state.introVideoUrl}
                        isLoading={state.isIntroVideoLoading}
                        loadingMessage={state.introVideoLoadingMessage}
                        onVideoEnd={() => dispatch({ type: 'INTRO_VIDEO_FAILURE', payload: { error: '' } })}
                        onSkip={() => dispatch({ type: 'INTRO_VIDEO_FAILURE', payload: { error: '' } })}
                    />
                );
            case GamePhase.Error:
                return <ErrorDisplay t={t} error={state.error!} onDismiss={handleFullReset} startGameFlow={startGameFlow} currentLanguage={state.currentLanguage} />;
            default:
                let title;
                if (gamePhase === GamePhase.CharacterCreation) {
                    title = t("Forge Your Resonance");
                } else if (state.characterProfile) {
                    title = t("The Journey of {name}, the {archetype}", { name: state.characterProfile.firstName, archetype: state.characterProfile.archetype.title });
                } else {
                    title = t("Resonant Echoes");
                }
                const isStreaming = state.streamingSceneText !== null;

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
                            <aside className="lg:col-span-1 space-y-4">
                                <RenownDisplay renown={state.renown} lastChangeNarrative={state.lastRenownNarrative} animateOnUpdate={state.lastChosenChoiceIndex !== null} />
                                <GameStatusDisplay t={t} timeOfDay={state.currentTimeOfDay} weather={state.currentWeather} inventory={state.playerInventory} onAttune={handleAttuneToArtifact} characterProfile={state.characterProfile} activeAberrations={state.activeDissonantAberrations} />
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
        
                            <div className="lg:col-span-2 space-y-4">
                                <ImageDisplay t={t} imageUrl={state.currentImageUrl} altText={state.currentImagePrompt || "Game Scene"} isLoading={!state.currentImageUrl && (state.isLoading || isStreaming)} />
                                 <div className="p-4 bg-secondary rounded-lg shadow-lg border border-divider-color min-h-[10rem]">
                                    <h2 className="font-heading text-3xl text-heading-color border-b-2 border-divider-color pb-2 mb-3">{t("The Unfolding Path")}</h2>
                                    
                                    {(state.isLoading && !isStreaming) ? (
                                        <p className="text-muted-color italic">{t("The Weave Shimmers...")}</p>
                                    ) : (
                                      <>
                                        <StoryDisplay storyText={isStreaming ? state.streamingSceneText! : state.currentScene} isStreaming={isStreaming} />
                                        <div className="mt-6">
                                          <ChoicesDisplay 
                                              choices={state.choices} 
                                              onChoiceSelected={(choice, index) => {
                                                  if (!state.selectedArchetypeId) handleArchetypeChoice(ARCHETYPES_DATA.find(a=>a.title === choice)!.id);
                                                  else if (!state.selectedOriginId) handleOriginChoice(ORIGINS_DATA.find(o=>o.name === choice)!.id);
                                                  else if (!state.selectedBackgroundId) handleBackgroundChoice(BACKGROUNDS_DATA.find(b=>b.title === choice)!.id);
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
        
                            <aside className="lg:col-span-1 space-y-4">
                                <WhisperingEchoesDisplay t={t} echoes={state.whisperingEchoes} />
                                <div className="grid grid-cols-2 gap-2">
                                     <button onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'weaving' })} disabled={state.whisperingEchoes.length === 0 || state.isLoading} className="fantasy-button fantasy-button-secondary text-sm">
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
                                    <button onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'lore' })} className="fantasy-button fantasy-button-primary text-sm">
                                        {t("Tome ({count})", { count: state.loreJournal.length })}
                                    </button>
                                     <button onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'history' })} className="fantasy-button fantasy-button-primary text-sm">
                                        {t("Path Taken ({count})", { count: state.historyLog.length })}
                                    </button>
                                    <button onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'notes' })} className="fantasy-button fantasy-button-primary text-sm">
                                        {t("My Journal ({count})", { count: state.playerNotes.length })}
                                    </button>
                                    <button onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'map' })} className="fantasy-button fantasy-button-primary text-sm">
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
                    </div>
                );
        }
    };
    
    return (
        <div className={`font-body bg-primary text-main-color min-h-screen selection:bg-accent-primary selection:text-white ${state.isColorBlindAssistActive ? 'cb-assist-active' : ''}`}>
            {renderMainContent()}
            <SettingsPanel t={t} isOpen={state.activeModal === 'settings'} onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })} currentTheme={document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'} onToggleTheme={() => { document.documentElement.classList.toggle('theme-dark'); localStorage.setItem('theme', document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'); }} volume={state.currentVolume} onVolumeChange={(v) => dispatch({ type: 'UPDATE_VOLUME', payload: v })} isMuted={state.isMuted} onMuteToggle={() => dispatch({ type: 'TOGGLE_MUTE' })} isColorBlindAssistActive={state.isColorBlindAssistActive} onToggleColorBlindAssist={() => { document.documentElement.classList.toggle('cb-assist-active'); localStorage.setItem('colorBlindAssist', document.documentElement.classList.contains('cb-assist-active') ? 'true' : 'false'); dispatch({ type: 'TOGGLE_COLOR_BLIND_ASSIST' }); }} currentLanguage={state.currentLanguage} onLanguageChange={(lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang})} />
            <LoreJournal t={t} loreEntries={state.loreJournal} loreFragments={state.loreFragments} isOpen={state.activeModal === 'lore'} onToggle={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })} newestEntryId={state.newestLoreEntryId} onSynthesizeFragments={handleSynthesizeFragments} />
            <HistoryLog t={t} historyLog={state.historyLog} isOpen={state.activeModal === 'history'} onToggle={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })} />
            <DreamRumorDisplay t={t} dreamOrVision={state.dreamOrVisionToDisplay} rumors={state.currentRumors} onDismissDream={() => dispatch({ type: 'DISMISS_DREAM_VISION' })} />
            {state.awaitingLoreInterpretation && state.loreToInterpret && <LoreInterpretationModal t={t} loreTitle={state.loreToInterpret.title} interpretations={state.loreToInterpret.interpretations} onSubmit={handleInterpretLore} onCancel={() => dispatch({ type: 'CANCEL_LORE_INTERPRETATION' })} />}
            <PlayerNotesModal
              t={t}
              isOpen={state.activeModal === 'notes'}
              onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
              notes={state.playerNotes}
              loreEntries={state.loreJournal}
              layout={state.mindMapLayout}
              onLayoutChange={(layout: MindMapLayout) => dispatch({ type: 'UPDATE_MIND_MAP_LAYOUT', payload: layout })}
              onAddNote={(note: {title: string, content: string}) => dispatch({ type: 'ADD_PLAYER_NOTE', payload: note })}
              onUpdateNote={(note: PlayerNote) => dispatch({ type: 'UPDATE_PLAYER_NOTE', payload: note })}
              onDeleteNote={(id: string) => dispatch({ type: 'DELETE_PLAYER_NOTE', payload: id })}
            />
            <MapModal t={t} isOpen={state.activeModal === 'map'} onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })} locations={state.discoveredLocations} currentLocationId={state.currentLocationId} />
            <EchoWeavingModal t={t} isOpen={state.activeModal === 'weaving'} onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })} echoes={state.whisperingEchoes} onSynthesize={handleSynthesizeEchoes} />
            <LoadingIndicator isLoading={state.isLoading && state.streamingSceneText === '' && state.gameStarted && state.characterProfile != null} t={t} />
        </div>
    );
};

export default App;