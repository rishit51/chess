import React, { createContext, useReducer } from 'react';
import GameReducer from './GameReducer';

const initialState = {
    possibleMoves: [],
    turn: 'w', //w or b. w goes first so its the default
    check: false, //true if the side to move (current turn) is in check.
    gameOver: false,
    status: '',
    playerName: '',
    playerColor: '',
    opponentName: '',
    message: '',
    opponentMoves: [], //game over status e.g checkmate or stalemate
};
export const GameContext = createContext(initialState);

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(GameReducer, initialState);

    return (
        <GameContext.Provider value={{ ...state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};