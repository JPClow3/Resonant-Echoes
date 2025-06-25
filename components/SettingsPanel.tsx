
import React, { useEffect, useRef } from 'react';

interface SettingsPanelProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  isOpen: boolean;
  onClose: () => void;
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  volume: number; // Master volume 0-100
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  isColorBlindAssistActive: boolean;
  onToggleColorBlindAssist: () => void;
  currentLanguage: 'en' | 'pt';
  onLanguageChangeAndReset: (lang: 'en' | 'pt') => void;
}

const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  t,
  isOpen,
  onClose,
  currentTheme,
  onToggleTheme,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  isColorBlindAssistActive,
  onToggleColorBlindAssist,
  currentLanguage,
  onLanguageChangeAndReset,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      soundService.playSound('SETTINGS_OPEN');
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleVolumeSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    onVolumeChange(newVolume);
    soundService.playSound('VOLUME_ADJUST');
  };
  
  const handleLanguageButtonClick = (lang: 'en' | 'pt') => {
    if (lang !== currentLanguage) {
        soundService.playSound('LANGUAGE_CHANGE');
        onLanguageChangeAndReset(lang);
    }
    onClose(); 
  };

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
      <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zM12 3c.71 0 1.39.11 2.03.32L12.5 2.05C12.33 2.02 12.17 2 12 2c-5.52 0-10 4.48-10 10 0 .17.02.33.05.5l-1.27-1.53A9.916 9.916 0 0112 3zm0 18c-.71 0-1.39-.11-2.03-.32l1.53 1.27c.17.03.33.05.5.05 5.52 0 10-4.48 10-10 0-.17-.02-.33-.05-.5l1.27 1.53A9.916 9.916 0 0112 21zM3.05 10.5L2.05 12l1.27 1.53A9.916 9.916 0 013 12c0-.17.02-.33.05-.5zM21 12c0 .17-.02.33-.05.5l1.27-1.53L21.95 12l-1.27-1.53A9.916 9.916 0 0121 12z"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-400">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.67 0-4.85-2.01-4.85-4.51 0-1.61.87-3.03 2.16-3.84A8.95 8.95 0 0012 3z"/>
    </svg>
  );
  
  const MuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16.5 12A4.5 4.5 0 0013 7.97v2.19c.68.16 1.29.57 1.78 1.12A2.5 2.5 0 0116.5 12zM3 9v6h4l5 5V4L7 9H3zm7.5-1.5L8.88 9H7v6h1.88L10.5 16.5v-9zM19 12a7 7 0 00-4.5-6.48v1.54A5.5 5.5 0 0119 12a5.5 5.5 0 01-4.5 5.44v1.54A7 7 0 0019 12z"/>
    </svg>
  );
  const UnmuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3 9v6h4l5 5V4L7 9H3zm7 .79L7.79 12H5v-2h2.79L10 7.21v2.58zM16.5 12A4.5 4.5 0 0013 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM13 1.71L13 0c2.02.28 3.83 1.23 5.09 2.59L16.91 3.8A5.46 5.46 0 0013 1.71zM13 24v-1.71c1.89-.46 3.52-1.46 4.79-2.79l1.18 1.18C17.63 22.07 15.41 23.26 13 24z"/>
    </svg>
  );

  const AccessibilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-sky-400">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6ZM12 15a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1 .75-.75H12Z" clipRule="evenodd" />
        <path d="M7.757 15.41A.75.75 0 0 1 6.75 16.5H6A.75.75 0 0 1 6 15h.75a.75.75 0 0 1 1.007.707v0Z"/>
        <path d="M18 15.75a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75v-3Z"/>
        <path d="M11.25 16.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"/>
    </svg>
  );

  const LanguageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4.06 19l5.09-5.03 3.73 3.73zM17.5 10c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
    </svg>
  );


  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-panel-title"
      tabIndex={-1}
    >
      <div
        className="modal-content-area bg-secondary p-6 rounded-lg shadow-xl w-full max-w-lg text-main-color modal-content-enter-active"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="settings-panel-title" className="font-heading text-3xl text-heading-color mb-6 text-center echoic-unveil-title">
          {t("Whispers of the Weave")}
        </h2>

        {/* Language Selection */}
        <div className="mb-6">
            <h3 className="font-heading text-xl text-accent-primary mb-2 flex items-center">
                <LanguageIcon /> <span className="ml-2">{t("Language / Idioma")}</span>
            </h3>
            <div className="p-3 bg-primary rounded-md border border-divider-color space-y-2">
                <p className="text-xs text-muted-color">{t("Changing language will restart the current chronicle.")}</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleLanguageButtonClick('en')}
                        className={`fantasy-button flex-1 ${currentLanguage === 'en' ? 'fantasy-button-primary' : 'fantasy-button-secondary'}`}
                        aria-pressed={currentLanguage === 'en'}
                    >
                        {t("English")}
                    </button>
                    <button
                        onClick={() => handleLanguageButtonClick('pt')}
                        className={`fantasy-button flex-1 ${currentLanguage === 'pt' ? 'fantasy-button-primary' : 'fantasy-button-secondary'}`}
                        aria-pressed={currentLanguage === 'pt'}
                    >
                        {t("Português")}
                    </button>
                </div>
            </div>
        </div>

        {/* Theme Toggle */}
        <div className="mb-6">
          <h3 className="font-heading text-xl text-accent-primary mb-2">{t("Appearance")}</h3>
          <div className="flex items-center justify-between p-3 bg-primary rounded-md border border-divider-color mb-3">
            <span className="font-body">{currentTheme === 'light' ? t("Current Theme: Ancient Parchment") : t("Current Theme: Moonlit Archives")}</span>
            <button
              onClick={() => { onToggleTheme(); soundService.playSound('THEME_TOGGLE');}}
              className="theme-toggle-medallion p-2 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
              aria-label={t("Switch to {theme} mode", { theme: currentTheme === 'light' ? t("dark") : t("light") })}
              style={{backgroundColor: 'var(--accent-secondary)'}}
            >
              {currentTheme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
          {/* Color-Blind Assist Toggle */}
          <div className="flex items-center justify-between p-3 bg-primary rounded-md border border-divider-color">
            <div className="flex flex-col">
                <span className="font-body">{isColorBlindAssistActive ? t("Color-Blind Assist: Enabled") : t("Color-Blind Assist: Disabled")}</span>
                <span className="text-xs text-muted-color">{t("Enhances contrast & visual cues.")}</span>
            </div>
            <button
              onClick={() => { onToggleColorBlindAssist(); soundService.playSound('ACCESSIBILITY_TOGGLE');}}
              className="theme-toggle-medallion p-2 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
              aria-label={t("Toggle Color-Blind Assist Mode {status}", { status: isColorBlindAssistActive ? t("off") : t("on")})}
              style={{backgroundColor: isColorBlindAssistActive ? 'var(--magical-positive-color)' : 'var(--accent-secondary)'}}
            >
              <AccessibilityIcon />
            </button>
          </div>
        </div>


        {/* Audio Settings */}
        <div className="mb-6">
          <h3 className="font-heading text-xl text-accent-primary mb-2">{t("Echoes of Sound")}</h3>
          <div className="p-3 bg-primary rounded-md border border-divider-color space-y-4">
            <div>
              <label htmlFor="masterVolume" className="font-body block mb-1 text-sm">{t("Master Volume: {volume}%", { volume: volume })}</label>
              <input
                type="range"
                id="masterVolume"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeSliderChange}
                disabled={isMuted}
                className="w-full h-2 bg-divider-color rounded-lg appearance-none cursor-pointer range-slider-thumb focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background-primary"
                aria-label={t("Master volume")}
              />
            </div>
            <button
              onClick={() => {onMuteToggle(); soundService.playSound('MUTE_TOGGLE');}}
              className="fantasy-button fantasy-button-secondary text-sm flex items-center justify-center w-full"
              aria-label={isMuted ? t("Unmute All Sounds") : t("Mute All Sounds")}
            >
              {isMuted ? <UnmuteIcon /> : <MuteIcon />}
              <span className="ml-2">{isMuted ? t("Unmute All Sounds") : t("Mute All Sounds")}</span>
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="fantasy-button fantasy-button-primary w-full mt-6"
        >
          {t("Return to Weaving")}
        </button>
      </div>
    </div>
  );
};

export default React.memo(SettingsPanel);
