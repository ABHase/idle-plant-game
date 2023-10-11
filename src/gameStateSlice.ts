// gameStateSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
    geneticMarkerProgress: number;
    geneticMarkerThreshold: number;
    geneticMarkers: number;
    seeds: number;
    silica: number;
    tannins: number;
    calcium: number;
    fulvic: number;
    costModifier: number;
};

const initialState: GlobalState = {
    geneticMarkerProgress: 0,
    geneticMarkerThreshold: 10,
    geneticMarkers: 0,
    seeds: 0,
    silica: 0,
    tannins: 0,
    calcium: 0,
    fulvic: 0,
    costModifier: 1,
};

const globalStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        updateGeneticMarkerProgress: (state) => {
            state.geneticMarkerProgress += 1;

            if (state.geneticMarkerProgress >= state.geneticMarkerThreshold) {
                state.geneticMarkers += 1;
                state.geneticMarkerProgress = 0;
                state.geneticMarkerThreshold *= 2;
            }
        },
        updateSecondaryResources: (state, action: PayloadAction<{ biomeName: string }>) => {
            switch(action.payload.biomeName) {
                case 'Desert':
                    state.silica += 1;
                    break;
                case 'Tropical Forest':
                    state.tannins += 1;
                    break;
                case 'Mountain':
                    state.calcium += 1;
                    break;
                case 'Swamp':
                    state.fulvic += 1;
                    break;
                default:
                    break;
            }
        },
        // Add other reducers as necessary...
    }
});

export const { updateGeneticMarkerProgress } = globalStateSlice.actions;
export default globalStateSlice.reducer;