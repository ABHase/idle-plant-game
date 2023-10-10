import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface PlantState {
    id: string;
    biome_id: string;
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
    id: '',  // Will be overridden when initialized
    biome_id: '',  // Will be overridden when initialized
    maturity_level: 0,
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

const initialState: PlantState[] = [];

const plantSlice = createSlice({
    name: 'plant',
    initialState,
    reducers: {
        initializeNewPlant: (state, action: PayloadAction<{ biome_id: string }>) => {
            const newPlant: PlantState = {
                ...INITIAL_PLANT_CONFIG, // Use default values for other properties
                id: uuidv4(),
                biome_id: action.payload.biome_id,
            };
            state.push(newPlant);
        },
        absorbSunlight: (state, action: PayloadAction<{ plantId: string, amount: number }>) => {
            const plant = state.find((p) => p.id === action.payload.plantId);
            if (plant) {
                plant.sunlight += action.payload.amount;
            }
        },
        absorbWater: (state, action: PayloadAction<{ plantId: string, amount: number }>) => {
            const plant = state.find((p) => p.id === action.payload.plantId);
            if (plant) {
                plant.water += action.payload.amount;
            }
        },
        // New action to produce sugar
        produceSugar: (state, action: PayloadAction<{ plantId: string }>) => {
            const plant = state.find((p) => p.id === action.payload.plantId);
            if (plant && plant.is_sugar_production_on) {
                const baseRate = plant.sugar_production_rate;
                const modifiedRate = baseRate * (1 + 0.1 * plant.maturity_level);
                const waterConsumption = 10 * (1 + 0.4 * plant.maturity_level);
                const sunlightConsumption = 10 * (1 + 0.4 * plant.maturity_level);
        
                if (plant.water > waterConsumption && plant.sunlight > sunlightConsumption) {
                    plant.water -= waterConsumption;
                    plant.sunlight -= sunlightConsumption;
                    const currentTime = Date.now();
                    const timeElapsedInSeconds = (currentTime - plant.lastProductionTimestamp) / 1000;
                    const productionPerSecond = modifiedRate;
                    const productionPerMinute = productionPerSecond * 60;
        
                    // Update sugar production properties
                    plant.sugarProduced += productionPerSecond * timeElapsedInSeconds;
                    plant.lastProductionTimestamp = currentTime;
                    plant.sugar += modifiedRate;
                }
            }
        },

        
        
        // New action to update water and sunlight for leaves and roots
        updateWaterAndSunlight: (state, action: PayloadAction<{ plantId: string }>) => {
            const plant = state.find((p) => p.id === action.payload.plantId);
            if (plant) {
                const waterDecrease = plant.leaves; // 1 water per leaf
                const rootsSunlightIncrease = plant.roots; // 1 sunlight per root
                const leavesSunlightIncrease = plant.leaves; // 1 sunlight per leaf

                plant.water += rootsSunlightIncrease - waterDecrease;
                plant.sunlight += leavesSunlightIncrease;
            }
        },

        // New action to grow roots
        growRoots: (state, action: PayloadAction<{ plantId: string }>) => {
            const plant = state.find((p) => p.id === action.payload.plantId);
            if (plant) {
                // Add logic to increase roots here
            }
        },

        // New action to grow leaves
        growLeaves: (state, action: PayloadAction<{ plantId: string }>) => {
            const plant = state.find((p) => p.id === action.payload.plantId);
            if (plant) {
                // Add logic to increase leaves here
            }
        },

        // Toggle sugar production
        toggleSugarProduction: (state, action: PayloadAction<{ plantId: string }>) => {
            const plant = state.find((p) => p.id === action.payload.plantId);
            if (plant) {
                plant.is_sugar_production_on = !plant.is_sugar_production_on;
            }
        },
        buyRoots: (state, action: PayloadAction<{ plantId: string; cost: number }>) => {
            const { plantId, cost } = action.payload;
            const plant = state.find((p) => p.id === plantId);
            if (plant && plant.sugar >= cost) {
                plant.sugar -= cost;
                plant.roots += 1;
            }
        },

        buyLeaves: (state, action: PayloadAction<{ plantId: string; cost: number }>) => {
            const { plantId, cost } = action.payload;
            const plant = state.find((p) => p.id === plantId);
            if (plant && plant.sugar >= cost) {
                plant.sugar -= cost;
                plant.leaves += 1;
            }
        },
    },
});

export const {
    initializeNewPlant,
    absorbSunlight,
    absorbWater,
    toggleSugarProduction,
    buyRoots,
    buyLeaves,
    produceSugar,
    growRoots,
    growLeaves,
    updateWaterAndSunlight,
} = plantSlice.actions;
export default plantSlice.reducer;
