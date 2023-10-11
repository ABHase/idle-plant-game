// biomesSlice.ts
import { BIOMES, BiomeName } from './biomesConfig'; // Import BiomeName as well
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface ResourceModifiers {
    sunlight: number;
    water: number;
}

export interface Biome {
    id: string; // Make this optional for now
    name: string;
    capacity: number;
    ground_water_level: number;
    current_weather: string;
    current_pest: string | null;
    snowpack: number;
    resource_modifiers: ResourceModifiers;
    rain_intensity: number;
    snow_intensity: number;
}

const initialState: Biome[] = [];

const biomesSlice = createSlice({
  name: 'biomes',
  initialState,
  reducers: {
    setBiomes: (state, action: PayloadAction<Biome[]>) => {
      return action.payload;
    },
    addBiome: (state, action: PayloadAction<Biome>) => {
      state.push(action.payload);
    },
    initializeBiome: (state, action: PayloadAction<BiomeName>) => {
        const biomeName = action.payload;
        const biomeData = BIOMES[biomeName];
        if (biomeData) {
          state.push({
            id: uuidv4(),
            name: biomeName,
            capacity: biomeData.capacity,
            ground_water_level: biomeData.ground_water_level,
            current_weather: biomeData.current_weather,
            current_pest: null,
            snowpack: biomeData.snowpack,
            resource_modifiers: biomeData.resource_modifiers,
            rain_intensity: biomeData.rain_intensity,
            snow_intensity: biomeData.snow_intensity
          });
        }
      }
    },
  });
  
  export const { setBiomes, addBiome, initializeBiome } = biomesSlice.actions;
  export default biomesSlice.reducer;