// gameActions.ts

import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';
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

        const biomes = getState().biomes;  // Get all biomes from the state

        const plants = getState().plant;  // Get all plants from the state

        plants.forEach(plant => {
            // If a plant is set to produce genetic markers and has enough sugar
            if (plant.is_genetic_marker_production_on && plant.sugar >= SUGAR_THRESHOLD) {  // Use a constant for this threshold if you have one defined
                dispatch(produceGeneticMarkers({ plantId: plant.id }));
                dispatch(updateGeneticMarkerProgress());
            }
            if (plant.is_secondary_resource_production_on && plant.sugar >= SECONDARY_SUGAR_THRESHOLD) {
                const associatedBiome = biomes.find(biome => biome.id === plant.biome_id);
                if (associatedBiome) {
                    dispatch(produceSecondaryResource({ plantId: plant.id }));
                    dispatch(updateSecondaryResources({ biomeName: associatedBiome.name }));
                }
            }
            // Update the maturity level for the plant
            dispatch(updateMaturityLevel({ plantId: plant.id }));

            // Try to attract ladybugs for the plant
            dispatch(attractLadybugs({ plantId: plant.id }));

            // Update water and sunlight for the plant
            dispatch(updateWaterAndSunlight({ plantId: plant.id }));

            //Dispatch produce sugar for the plant
            dispatch(produceSugar({ plantId: plant.id }));


        });

        // ... [other logic and dispatches as needed]
    };
};
function updateSecondaryResources(arg0: { biomeName: string; }): any {
    throw new Error('Function not implemented.');
}

