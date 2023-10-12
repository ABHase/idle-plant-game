// gameActions.ts

import { ThunkAction } from 'redux-thunk';
import { RootState } from './rootReducer';
import { Action } from '@reduxjs/toolkit';  // Import Action
import { updateTime } from './appSlice';
import { produceGeneticMarkers, produceSecondaryResource, produceSugar, updateMaturityLevel, updateWaterAndSunlight } from './plantSlice';
import { updateGeneticMarkerProgress } from './gameStateSlice';
import { SECONDARY_SUGAR_THRESHOLD, SUGAR_THRESHOLD } from './constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UPGRADES } from './upgrades';

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
        dispatch(updateWaterAndSunlight());
        dispatch(produceSugar());

        // ... [other logic and dispatches as needed]
    };
};
function updateSecondaryResources(arg0: { biomeName: string; }): any {
    throw new Error('Function not implemented.');
}

export const purchaseUpgradeThunk = createAsyncThunk<void, string, { state: RootState }>(
    'upgrades/purchase',
    async (upgradeId, thunkAPI) => {
      const state = thunkAPI.getState();
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      
      if (!upgrade) {
        throw new Error('Upgrade not found');
      }
  
      if (state.globalState.geneticMarkers < upgrade.cost) {

        throw new Error('Not enough genetic markers');
      }
  
      thunkAPI.dispatch({ type: 'gameState/deductGeneticMarkers', payload: upgrade.cost });
      thunkAPI.dispatch({ type: 'upgrades/purchaseUpgrade', payload: upgradeId });
    }
  );

  export const sellUpgradeThunk = createAsyncThunk<void, string, { state: RootState }>(
    'upgrades/sell',
    async (upgradeId, thunkAPI) => {
        const state = thunkAPI.getState();
        const upgrade = UPGRADES.find(u => u.id === upgradeId);
        
        if (!upgrade) {
            throw new Error('Upgrade not found');
        }

        // Check if the player owns this upgrade
        if (!state.upgrades.purchased.includes(upgradeId)) {
            throw new Error('Upgrade not owned');
        }

        const refundAmount = upgrade.cost
  
        thunkAPI.dispatch({ type: 'gameState/increaseGeneticMarkers', payload: refundAmount });
        thunkAPI.dispatch({ type: 'upgrades/sellUpgrade', payload: upgradeId });
    }
);
