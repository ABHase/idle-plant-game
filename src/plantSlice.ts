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
    thorns: 0
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
    },
});

export const { initializeNewPlant, absorbSunlight, absorbWater } = plantSlice.actions;
export default plantSlice.reducer; 
