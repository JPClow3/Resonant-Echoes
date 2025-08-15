import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { GameState } from '../types';
import { gameReducer, initialState, initializeState } from './gameReducer';
import { Action } from './actions';

interface GameStateContextType {
    state: GameState;
    dispatch: React.Dispatch<Action>;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState, initializeState);

    return (
        <GameStateContext.Provider value={{ state, dispatch }}>
            {children}
        </GameStateContext.Provider>
    );
};

export const useGameState = (): GameStateContextType => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};
