// gameActions.ts

import { ThunkAction } from 'redux-thunk';
import { RootState } from './rootReducer';
import { Action } from '@reduxjs/toolkit';  // Import Action
import { updateTime } from './appSlice';
import { attractLadybugs, produceGeneticMarkers, produceSecondaryResource, produceSugar, updateMaturityLevel, updateWaterAndSunlight } from './plantSlice';
import { updateGeneticMarkerProgress } from './gameStateSlice';
import { SECONDARY_SUGAR_THRESHOLD, SUGAR_THRESHOLD } from './constants';

//... [other imports]

export const updateGame = (): ThunkAction<void, RootState, unknown, Action<string>> => {
    return (dispatch, getState) => {
        
        const currentTotalTime = getState().app.totalTime;
        const newTotalTime = currentTotalTime + 1;

        // Dispatch updateTime with newTotalTime
        dispatch(updateTime(newTotalTime));

        const plant = getState().plant;

        if (plant.is_genetic_marker_production_on && plant.sugar >= SUGAR_THRESHOLD) {
            dispatch(produceGeneticMarkers());
            dispatch(updateGeneticMarkerProgress());
        }
        if (plant.is_secondary_resource_production_on && plant.sugar >= SECONDARY_SUGAR_THRESHOLD) {
            dispatch(produceSecondaryResource());
        }
        dispatch(updateMaturityLevel());
        dispatch(attractLadybugs());
        dispatch(updateWaterAndSunlight());
        dispatch(produceSugar());

        // ... [other logic and dispatches as needed]
    };
};
function updateSecondaryResources(arg0: { biomeName: string; }): any {
    throw new Error('Function not implemented.');
}

