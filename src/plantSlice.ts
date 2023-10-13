import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { SUGAR_THRESHOLD, SECONDARY_SUGAR_THRESHOLD } from './constants';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './rootReducer'; // This needs to be the actual path to your rootReducer
import { UPGRADE_FUNCTIONS, UPGRADES } from './upgrades'; // Assuming you have UPGRADES defined in an 'upgrades.ts' file
import {
    MATURITY_SUGAR_PRODUCTION_MODIFIER,
    MATURITY_WATER_CONSUMPTION_MODIFIER,
    MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER,
    BASE_WATER_CONSUMPTION,
    BASE_SUNLIGHT_CONSUMPTION,
} from './constants';



export interface PlantState {
    id: string;
    maturity_level: number;
    sugar_production_rate: number;
    genetic_marker_production_rate: number;
    is_sugar_production_on: boolean;
    is_genetic_marker_production_on: boolean;
    is_secondary_resource_production_on: boolean;
    sunlight: number;
    sunlight_absorption_rate: number;
    sunlight_efficiency_multiplier: number;
    water: number;
    water_absorption_rate: number;
    water_efficiency_multiplier: number;
    sunlight_absorption_multiplier: number;
    water_absorption_multiplier: number;
    sugar: number;
    ladybugs: number;
    roots: number;
    leaves: number;
    resin: number;
    sugarProduced: number;
    lastProductionTimestamp: number;
    totalWaterAbsorbed: number;
    totalSunlightAbsorbed: number;
    totalSugarCreated: number;
    geneticMarkerUpgradeActive: boolean;
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
    sunlight_absorption_rate: 10,
    water: 0,
    water_absorption_rate: 10,
    sunlight_efficiency_multiplier: 1,
    water_efficiency_multiplier: 1,
    sunlight_absorption_multiplier: 1,
    water_absorption_multiplier: 1,
    sugar: 0,
    ladybugs: 0,
    roots: 2,
    leaves: 1,
    resin: 0,
    sugarProduced: 0,
    lastProductionTimestamp: 0,
    totalWaterAbsorbed: 0,
    totalSunlightAbsorbed: 0,
    totalSugarCreated: 0,
    geneticMarkerUpgradeActive: false,
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
          
        absorbSunlight: (state) => {
            state.sunlight += state.sunlight_absorption_rate;
            state.totalSunlightAbsorbed += state.sunlight_absorption_rate;
        },
        absorbWater: (state) => {
            state.water += state.water_absorption_rate;
            state.totalWaterAbsorbed += state.water_absorption_rate;
        },
        produceSugar: (state) => {
            if (state.is_sugar_production_on) {
                const baseRate = state.sugar_production_rate;
                const modifiedRate = baseRate * (1 + MATURITY_SUGAR_PRODUCTION_MODIFIER * state.maturity_level);
                const waterConsumption = BASE_WATER_CONSUMPTION * (1 + MATURITY_WATER_CONSUMPTION_MODIFIER * state.maturity_level);
                const sunlightConsumption = BASE_SUNLIGHT_CONSUMPTION * (1 + MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER * state.maturity_level);
        
                if (state.water > waterConsumption && state.sunlight > sunlightConsumption) {
                    state.water -= waterConsumption;
                    state.sunlight -= sunlightConsumption;
                    state.sugar += modifiedRate;
                    state.totalSugarCreated += modifiedRate;
                }
            }
        },
        updateWaterAndSunlight: (state) => {
            const waterDecrease = state.leaves;
            const rootsWaterIncrease = state.roots * state.water_absorption_multiplier;
            const leavesSunlightIncrease = state.leaves * state.sunlight_absorption_multiplier;            
            state.water = Math.max(0, state.water + rootsWaterIncrease - waterDecrease);
            state.totalWaterAbsorbed += rootsWaterIncrease;
            state.sunlight += leavesSunlightIncrease;
            state.totalSunlightAbsorbed += leavesSunlightIncrease;
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
            const costMultiplier = state.geneticMarkerUpgradeActive ? 4 : 1;
            const neededSugar = SUGAR_THRESHOLD * costMultiplier;
            if (state.sugar >= neededSugar) {
                state.sugar -= neededSugar;
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
        handlePest: (state, action: PayloadAction<{ pestType: 'Aphids' | 'Deer' }>) => {
            // Reducer logic will be added later
        },
        toggleGeneticMarkerUpgrade: (state) => {
            state.geneticMarkerUpgradeActive = !state.geneticMarkerUpgradeActive;
        },
        deductSugar: (state, action: PayloadAction<number>) => {
            const deductionAmount = action.payload;
            state.sugar = Math.max(0, state.sugar - deductionAmount);
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
    handlePest,
    resetPlant,
    evolvePlant,
    deductSugar,
} = plantSlice.actions;
export default plantSlice.reducer;
