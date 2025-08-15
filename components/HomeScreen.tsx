
import React from 'react';
import RestartButton from './RestartButton'; 

interface HomeScreenProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  onStartNewGame: () => void;
  onOpenSettings: () => void;
  homeScreenImageUrl: string | null;
  isLoading?: boolean; 
  error?: string | null; 
}

const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  t,
  onStartNewGame, 
  onOpenSettings, 
  homeScreenImageUrl,
  isLoading, 
  error 
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn bg-cover bg-center"
      style={{ 
        backgroundImage: homeScreenImageUrl ? `url(${homeScreenImageUrl})` : 'var(--background-primary)',
        backgroundColor: 'var(--background-primary)', 
        color: 'var(--text-main)',
        position: 'relative'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {isLoading && !homeScreenImageUrl && <p className="font-body text-gray-300 mb-4 animate-simple-pulse">{t("The Atheneum Materializes...")}</p>}
        {error && (!homeScreenImageUrl || homeScreenImageUrl.includes('picsum.photos')) && ( 
          <div className="bg-red-900 bg-opacity-75 p-4 rounded-lg mb-6 max-w-md shadow-lg border border-red-700">
            <h3 className="font-heading text-xl text-red-300 mb-2">{t("A Dissonant Chord!")}</h3>
            <p className="font-body text-sm text-red-200">{error}</p>
          </div>
        )}
        
        <h1 className="font-heading text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200 mb-6 home-title-reveal filter drop-shadow-lg">
          {t("Resonant Echoes")}
        </h1>
        <p className="font-body text-xl text-gray-200 mb-12 max-w-2xl filter drop-shadow-md">
          {t("Enter the world of Resonant Echoes, where history breathes and your choices shape reality.")}
        </p>

        <nav className="space-y-5 flex flex-col items-center">
          <button
            onClick={() => {
              soundService.playSound('MENU_SELECT_NEW_GAME');
              onStartNewGame();
            }}
            className="fantasy-button fantasy-button-home text-lg px-8 py-4 w-80"
            disabled={isLoading && !homeScreenImageUrl}
          >
            {t("New Chronicle")}
          </button>
          <button
            onClick={() => {
              soundService.playSound('MENU_SELECT_SETTINGS');
              onOpenSettings();
            }}
            className="fantasy-button fantasy-button-home text-lg px-8 py-4 w-80"
            disabled={isLoading && !homeScreenImageUrl}
          >
            {t("Settings")}
          </button>
        </nav>
      </div>
       <footer className="absolute bottom-4 text-center text-xs text-gray-400 z-10">
          <p>{t("A tale woven by Gemini & React.")}</p>
        </footer>
    </div>
  );
};

export default HomeScreen;