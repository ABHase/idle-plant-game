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
import { PlantTimeState } from "./plantTimeSlice";

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
  rootRot: number;
  rootRotThreshold: number;
  springModifier: number;
  summerModifier: number;
  autumnModifier: number;
  winterModifier: number;
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
  rootRot: 0,
  rootRotThreshold: 100,
  springModifier: 1.5,
  summerModifier: 1.5,
  autumnModifier: 1.5,
  winterModifier: 0.25,
};

const initialState: PlantState = INITIAL_PLANT_CONFIG;

export const photosynthesisWaterConsumption = (
  maturity_level: number
): number =>
  BASE_WATER_CONSUMPTION *
  (1 + MATURITY_WATER_CONSUMPTION_MODIFIER * maturity_level);
export const photosynthesisSunlightConsumption = (
  maturity_level: number
): number =>
  BASE_SUNLIGHT_CONSUMPTION *
  (1 + MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER * maturity_level);
export const photosynthesisSugarProduction = (
  plant: PlantState,
  season: string
): number => {
  let sugarModifier = 1; // default
  if (season === "Autumn") {
    sugarModifier = plant.autumnModifier;
  } else if (season === "Winter") {
    sugarModifier = plant.winterModifier; // reduced in winter
  }
  const baseRate = plant.sugar_production_rate;
  const modifiedRate =
    baseRate * (1 + MATURITY_SUGAR_PRODUCTION_MODIFIER * plant.maturity_level);
  return modifiedRate * sugarModifier;
};

export const geneticSugarConsumption = (plant: PlantState): number => {
  const costMultiplier = plant.geneticMarkerUpgradeActive ? 4 : 1;
  return SUGAR_THRESHOLD * costMultiplier;
};

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
        const waterConsumption = photosynthesisWaterConsumption(
          state.maturity_level
        );
        const sunlightConsumption = photosynthesisSunlightConsumption(
          state.maturity_level
        );

        if (
          state.water > waterConsumption &&
          state.sunlight > sunlightConsumption
        ) {
          state.water -= waterConsumption;
          state.sunlight -= sunlightConsumption;
          const sugars = photosynthesisSugarProduction(
            state,
            action.payload.season
          );
          state.sugar += sugars;
          state.totalSugarCreated += sugars;
        }
      }
    },
    updateWaterAndSunlight: (
      state,
      action: PayloadAction<{ season: string }>
    ) => {
      const season = action.payload.season;
      let waterModifier = 1; // default
      if (season === "Spring") {
        waterModifier = state.springModifier;
      } else if (season === "Winter") {
        waterModifier = state.winterModifier; // reduced in winter
      }

      let sunlightModifier = 1; // default
      if (season === "Summer") {
        sunlightModifier = state.summerModifier;
      } else if (season === "Winter") {
        sunlightModifier = state.winterModifier; // reduced in winter
      }

      const waterDecrease = state.leaves;
      const rootsWaterIncrease =
        state.roots * state.water_absorption_multiplier;
      const leavesSunlightIncrease =
        state.leaves * state.sunlight_absorption_multiplier;
      const seasonModifiedWaterIncrease = rootsWaterIncrease * waterModifier;
      const seasonModifiedSunlightIncrease =
        leavesSunlightIncrease * sunlightModifier;

      state.water = Math.max(
        0,
        state.water + seasonModifiedWaterIncrease - waterDecrease
      );
      state.totalWaterAbsorbed += seasonModifiedWaterIncrease;
      state.sunlight += seasonModifiedSunlightIncrease;
      state.totalSunlightAbsorbed += seasonModifiedSunlightIncrease;
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
    handlePest: (
      state,
      action: PayloadAction<{ pestType: "Aphids" | "Deer" }>
    ) => {
      // Reducer logic will be added later
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
  increaseRootRot,
  resetRootRot,
  removeRoots,
} = plantSlice.actions;
export default plantSlice.reducer;
