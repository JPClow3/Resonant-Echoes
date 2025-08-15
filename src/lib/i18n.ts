import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { translations } from '../data/translations';
import { useGameState } from '../state/GameStateContext';

type Language = 'en' | 'pt';

interface I18nContextType {
    t: (key: string, params?: Record<string, string | number>) => string;
    language: Language;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state } = useGameState();
    const language = state.currentLanguage;

    const t = useCallback((key: string, params?: Record<string, string | number>): string => {
        let translation = translations[key as keyof typeof translations]?.[language] || key;
        if (params) {
            Object.entries(params).forEach(([paramKey, value]) => {
                translation = translation.replace(`{${paramKey}}`, String(value));
            });
        }
        return translation;
    }, [language]);

    const value = useMemo(() => ({ t, language }), [t, language]);

    return React.createElement(I18nContext.Provider, { value }, children);
};

export const useTranslation = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
};