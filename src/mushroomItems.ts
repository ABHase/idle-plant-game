// mushroomItems.ts

import { ThunkDispatch } from 'redux-thunk';
import { Action } from '@reduxjs/toolkit'; 
import { RootState } from './rootReducer';
import { updateGame } from './gameActions';
import { addGeneticMarkers } from './gameStateSlice';  // Assume you have deductSugar function in gameStateSlice
import { PlantState, deductSugar } from "./plantSlice";
import { activateTimeBoost, deactivateTimeBoost } from './timeBoostSlice';

export type MushroomItem = {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: (dispatch: ThunkDispatch<RootState, unknown, Action<string>>, getState: () => RootState) => void;  // The function now takes dispatch and getState
};

export const MUSHROOM_ITEMS: MushroomItem[] = [
    {
        id: 'nitrogen',
        name: 'Nitrogen',
        description: 'Try some fertilizer, time will just fly by.',
        cost: 1000,
        effect: (dispatch, getState) => {
            dispatch(activateTimeBoost()); // Activate time boost
            dispatch(deductSugar(1000));  // Deduct sugar cost
            
            let counter = 0;
            const intervalId = setInterval(() => {
                dispatch(updateGame());
                counter++;
                if (counter >= 144) {
                    clearInterval(intervalId);
                    dispatch(deactivateTimeBoost()); // Deactivate time boost
                }
            }, 50);
        }
    },

    {
        id: 'buyDNA',
        name: 'Buy DNA',
        description: 'Black market DNA.',
        cost: 500,  // Adjust sugar cost as necessary
        effect: (dispatch, getState) => {
            const sugar = getState().plant.sugar;  // Get sugar from plant slice
            if (sugar >= 500) {
                dispatch(deductSugar(500));  // Deduct sugar cost
                dispatch(addGeneticMarkers(1));  // Add 1 DNA
            } else {
                console.error('Not enough sugar to buy DNA');
            }
        }
    },
    // ... other mushroom items
];

export const MUSHROOM_ITEM_FUNCTIONS: { [key: string]: (dispatch: ThunkDispatch<RootState, unknown, Action<string>>, getState: () => RootState) => void } = {
    nitrogen: (MUSHROOM_ITEMS.find(item => item.id === 'nitrogen')?.effect) as (dispatch: ThunkDispatch<RootState, unknown, Action<string>>, getState: () => RootState) => void,
    buyDNA: (MUSHROOM_ITEMS.find(item => item.id === 'buyDNA')?.effect) as (dispatch: ThunkDispatch<RootState, unknown, Action<string>>, getState: () => RootState) => void,
    // ... other mushroom item functions
};

