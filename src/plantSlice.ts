import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { SUGAR_THRESHOLD, SECONDARY_SUGAR_THRESHOLD } from "./constants";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer"; // This needs to be the actual path to your rootReducer
import { UPGRADE_FUNCTIONS, UPGRADES } from "./upgrades"; // Assuming you have UPGRADES defined in an 'upgrades.ts' file
import {
  MATURITY_SUGAR_PRODUCTION_MODIFIER,
  MATURITY_WATER_CONSUMPTION_MODIFIER,
  MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER,
  BASE_WATER_CONSUMPTION,
  BASE_SUNLIGHT_CONSUMPTION,
} from "./constants";
import {
  calculateWaterAndSunlight,
  calculateSugarPhotosynthesis,
  geneticSugarConsumption,
} from "./formulas";

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
  ladybugTax: number;
  roots: number;
  leaves: number;
  resin: number;
  sugarProduced: number;
  lastProductionTimestamp: number;
  totalWaterAbsorbed: number;
  totalSunlightAbsorbed: number;
  totalSugarCreated: number;
  geneticMarkerUpgradeActive: boolean;
  rootRot: number;
  rootRotThreshold: number;
  springModifier: number;
  summerModifier: number;
  autumnModifier: number;
  winterModifier: number;
  aphids: number;
}

const INITIAL_PLANT_CONFIG: PlantState = {
  id: uuidv4(), // Will be overridden when initialized
  maturity_level: 1,
  sugar_production_rate: 1,
  genetic_marker_production_rate: 1,
  is_sugar_production_on: false,
  is_genetic_marker_production_on: false,
  is_secondary_resource_production_on: false,
  sunlight: 0,
  sunlight_absorption_rate: 10,
  water: 1,
  water_absorption_rate: 10,
  sunlight_efficiency_multiplier: 1,
  water_efficiency_multiplier: 1,
  sunlight_absorption_multiplier: 1,
  water_absorption_multiplier: 1,
  sugar: 0,
  ladybugs: 1,
  ladybugTax: 0.5,
  roots: 2,
  leaves: 1,
  resin: 0,
  sugarProduced: 0,
  lastProductionTimestamp: 0,
  totalWaterAbsorbed: 0,
  totalSunlightAbsorbed: 0,
  totalSugarCreated: 0,
  geneticMarkerUpgradeActive: false,
  rootRot: 0,
  rootRotThreshold: 100,
  springModifier: 1.5,
  summerModifier: 1.5,
  autumnModifier: 1.5,
  winterModifier: 0.25,
  aphids: 0,
};

const initialState: PlantState = INITIAL_PLANT_CONFIG;

const plantSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    resetPlant: () => initialState,

    initializeNewPlant: (
      state,
      action: PayloadAction<{ biome_id: string }>
    ) => {
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

      purchasedUpgrades.forEach((upgradeId) => {
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
    produceSugar: (state, action: PayloadAction<{ season: string }>) => {
      if (state.is_sugar_production_on) {
        const results = calculateSugarPhotosynthesis(
          state,
          action.payload.season
        );

        state.sugar = results.sugar;
        state.totalSugarCreated = results.totalSugarCreated;
        state.water = results.water;
        state.sunlight = results.sunlight;
      }
    },
    updateWaterAndSunlight: (
      state,
      action: PayloadAction<{ season: string }>
    ) => {
      const season = action.payload.season;
      const results = calculateWaterAndSunlight(state, season);
      state.water = results.water;
      state.totalWaterAbsorbed = results.totalWaterAbsorbed;
      state.sunlight = results.sunlight;
      state.totalSunlightAbsorbed = results.totalSunlightAbsorbed;
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
      state.is_genetic_marker_production_on =
        !state.is_genetic_marker_production_on;
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
    //Reducer to decrease leaves by payload
    removeLeaves: (state, action: PayloadAction<number>) => {
      state.leaves = Math.max(0, state.leaves - action.payload);
    },
    produceGeneticMarkers: (state) => {
      const neededSugar = geneticSugarConsumption(state);
      if (state.sugar >= neededSugar) {
        state.sugar -= neededSugar;
      }
    },
    produceSecondaryResource: (state) => {
      if (
        state.is_secondary_resource_production_on &&
        state.sugar >= SECONDARY_SUGAR_THRESHOLD
      ) {
        state.sugar -= SECONDARY_SUGAR_THRESHOLD;
      }
    },
    updateMaturityLevel: (state) => {
      state.maturity_level = Math.floor(Math.sqrt(state.roots + state.leaves));
    },
    toggleGeneticMarkerUpgrade: (state) => {
      state.geneticMarkerUpgradeActive = !state.geneticMarkerUpgradeActive;
    },
    deductSugar: (state, action: PayloadAction<number>) => {
      const deductionAmount = action.payload;
      state.sugar = Math.max(0, state.sugar - deductionAmount);
    },
    //Reducer to increase root rot by payload
    increaseRootRot: (state, action: PayloadAction<number>) => {
      state.rootRot += action.payload;
      if (state.rootRot > state.rootRotThreshold) {
        state.rootRot = state.rootRotThreshold;
      }
    },
    //Reducer to reset root rot to 0
    resetRootRot: (state) => {
      state.rootRot = 0;
    },
    //Reducer to remove all roots
    removeRoots: (state) => {
      state.roots = Math.max(0, state.roots - 1);
    },
    //Reducer to increase aphids by payload
    increaseAphids: (state, action: PayloadAction<number>) => {
      state.aphids += action.payload;
    },
    //Reducer to remove aphids by payload
    removeAphids: (state, action: PayloadAction<number>) => {
      state.aphids = Math.max(0, state.aphids - action.payload);
    },
    //Reducer to set aphids to 0
    deductAllAphids: (state, action: PayloadAction<number>) => {
      state.aphids = 0;
    },
    //Reduccer to set ladybugs to state.ladybugtax
    setLadybugs: (state) => {
      state.ladybugs = state.ladybugTax;
    },
    //Set ladybug tax to 1
    resetLadybugTax: (state) => {
      state.ladybugTax = 1;
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
  resetPlant,
  evolvePlant,
  deductSugar,
  increaseRootRot,
  resetRootRot,
  removeRoots,
  increaseAphids,
  removeAphids,
  setLadybugs,
  resetLadybugTax,
  deductAllAphids,
  removeLeaves,
} = plantSlice.actions;
export default plantSlice.reducer;
