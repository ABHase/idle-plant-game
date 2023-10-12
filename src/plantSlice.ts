import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { SUGAR_THRESHOLD, SECONDARY_SUGAR_THRESHOLD } from './constants';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './rootReducer'; // This needs to be the actual path to your rootReducer
import { UPGRADE_FUNCTIONS, UPGRADES } from './upgrades'; // Assuming you have UPGRADES defined in an 'upgrades.ts' file


export interface PlantState {
    id: string;
    maturity_level: number;
    sugar_production_rate: number;
    genetic_marker_production_rate: number;
    is_sugar_production_on: boolean;
    is_genetic_marker_production_on: boolean;
    is_secondary_resource_production_on: boolean;
    sunlight: number;
    water: number;
    sugar: number;
    ladybugs: number;
    roots: number;
    leaves: number;
    vacuoles: number;
    resin: number;
    taproot: number;
    pheromones: number;
    thorns: number;
    sugarProduced: number;
    lastProductionTimestamp: number;
}

const INITIAL_PLANT_CONFIG: PlantState = {
    id: uuidv4(),  // Will be overridden when initialized
    maturity_level: 1,
    sugar_production_rate: 1,
    genetic_marker_production_rate: 1,
    is_sugar_production_on: false,
    is_genetic_marker_production_on: false,
    is_secondary_resource_production_on: false,
    sunlight: 0,
    water: 0,
    sugar: 0,
    ladybugs: 0,
    roots: 2,
    leaves: 1,
    vacuoles: 1,
    resin: 0,
    taproot: 0,
    pheromones: 0,
    thorns: 0,
    sugarProduced: 0,
    lastProductionTimestamp: 0,
};

const initialState: PlantState = INITIAL_PLANT_CONFIG;
;

const plantSlice = createSlice({
    name: 'plant',
    initialState,
    reducers: {
        resetPlant: () => initialState,

        initializeNewPlant: (state, action: PayloadAction<{ biome_id: string }>) => {
            return {
                ...INITIAL_PLANT_CONFIG, 
                id: uuidv4(),
            };
        },

        evolvePlant: (state, action: PayloadAction<string[]>) => {
            // Use the purchased upgrades from the action payload
            const purchasedUpgrades = action.payload;
        
            // Modify the properties of the state directly
            Object.assign(state, INITIAL_PLANT_CONFIG);
            state.id = uuidv4();
        
            purchasedUpgrades.forEach(upgradeId => {
                const upgradeFunction = UPGRADE_FUNCTIONS[upgradeId];
                if (upgradeFunction) {
                    upgradeFunction(state);
                }
            });
        },      
          
        absorbSunlight: (state, action: PayloadAction<{ amount: number }>) => {
            state.sunlight += action.payload.amount;
        },
        absorbWater: (state, action: PayloadAction<{ amount: number }>) => {
            state.water += action.payload.amount;
        },
        produceSugar: (state) => {
            if (state.is_sugar_production_on) {
                const baseRate = state.sugar_production_rate;
                const modifiedRate = baseRate * (1 + 0.5 * state.maturity_level);
                const waterConsumption = 10 * (1 + 0.6 * state.maturity_level);
                const sunlightConsumption = 10 * (1 + 0.9 * state.maturity_level);
    
                if (state.water > waterConsumption && state.sunlight > sunlightConsumption) {
                    state.water -= waterConsumption;
                    state.sunlight -= sunlightConsumption;
                    state.sugar += modifiedRate;
                }
            }
        },
        updateWaterAndSunlight: (state) => {
            const waterDecrease = state.leaves;
            const rootsWaterIncrease = state.roots;
            const leavesSunlightIncrease = state.leaves;
    
            state.water = Math.max(0, state.water + rootsWaterIncrease - waterDecrease);
            state.sunlight += leavesSunlightIncrease;
        },
        growRoots: (state) => {
            // Logic to increase roots here
        },
        growLeaves: (state) => {
            // Logic to increase leaves here
        },
        toggleSugarProduction: (state) => {
            state.is_sugar_production_on = !state.is_sugar_production_on;
        },
        toggleGeneticMarkerProduction: (state) => {
            state.is_genetic_marker_production_on = !state.is_genetic_marker_production_on;
        },
        buyRoots: (state, action: PayloadAction<{ cost: number }>) => {
            if (state.sugar >= action.payload.cost) {
                state.sugar -= action.payload.cost;
                state.roots += 1;
            }
        },
        buyLeaves: (state, action: PayloadAction<{ cost: number }>) => {
            if (state.sugar >= action.payload.cost) {
                state.sugar -= action.payload.cost;
                state.leaves += 1;
            }
        },
        produceGeneticMarkers: (state) => {
            if (state.sugar >= SUGAR_THRESHOLD) {
                state.sugar -= SUGAR_THRESHOLD;
            }
        },
        produceSecondaryResource: (state) => {
            if (state.is_secondary_resource_production_on && state.sugar >= SECONDARY_SUGAR_THRESHOLD) {
                state.sugar -= SECONDARY_SUGAR_THRESHOLD;
            }
        },
        updateMaturityLevel: (state) => {
            state.maturity_level = Math.floor(Math.sqrt(state.roots + state.leaves));
        },
        attractLadybugs: (state) => {
            if (state.pheromones > 0) {
                state.ladybugs += 1;
                state.pheromones -= 1;
            }
        },
        handlePest: (state, action: PayloadAction<{ pestType: 'Aphids' | 'Deer' }>) => {
            // Reducer logic will be added later
        },
    },
    
});

export const {
    initializeNewPlant,
    absorbSunlight,
    absorbWater,
    toggleSugarProduction,
    toggleGeneticMarkerProduction,
    buyRoots,
    buyLeaves,
    produceSugar,
    growRoots,
    growLeaves,
    updateWaterAndSunlight,
    produceGeneticMarkers,
    produceSecondaryResource,
    updateMaturityLevel,
    attractLadybugs,
    handlePest,
    resetPlant,
    evolvePlant,
} = plantSlice.actions;
export default plantSlice.reducer;
