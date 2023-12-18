// mushroomItems.ts

import { ThunkDispatch } from "redux-thunk";
import { Action } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";
import { updateGame } from "./gameActions";
import {
  addGeneticMarkers,
  increaseGeneticMarkers,
  increaseGlobalBoostedTicks,
  resetGrassGeneticMarkerThreshold,
  resetSucculentGeneticMarkerThreshold,
} from "./Slices/gameStateSlice"; // Assume you have deductSugar function in gameStateSlice
import {
  PlantState,
  deductSugar,
  increaseRootRot,
  addWater,
  deductSunlight,
  increaseSugar,
  deductWater,
  removeAllRootsAndLeaves,
} from "./Slices/plantSlice";
import {
  activateTimeBoost,
  deactivateTimeBoost,
} from "./Slices/timeBoostSlice";

export type MushroomItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void; // Include quantity as a parameter
};

export const MUSHROOM_ITEMS: MushroomItem[] = [
  {
    id: "nitrogen",
    name: "Nitrogen",
    description: "Time Boost 144 ticks, adds 70 Root Rot.",
    cost: 1000,
    effect: (dispatch, getState, quantity) => {
      dispatch(increaseGlobalBoostedTicks(144 * quantity)); // Add 144 ticks
      dispatch(deductSugar(1000 * quantity)); // Deduct sugar cost
      dispatch(increaseRootRot(70 * quantity)); // Increase root rot by 7
    },
  },

  {
    id: "buyDNA",
    name: "Buy DNA",
    description: "Black market DNA.  1 DNA, adds 60 Root Rot.",
    cost: 500, // Adjust sugar cost as necessary
    effect: (dispatch, getState, quantity) => {
      const sugar = getState().plant.sugar; // Get sugar from plant slice
      if (sugar >= 500) {
        dispatch(deductSugar(500 * quantity)); // Deduct sugar cost
        dispatch(increaseRootRot(60 * quantity)); // Increase root rot by 1
        dispatch(increaseGeneticMarkers({ amount: 1, plantType: "Fern" })); // Add 1 DNA
      } else {
        console.error("Not enough sugar to buy DNA");
      }
    },
  },
  {
    id: "buyDNA_2",
    name: "Buy 100 DNA",
    description: "Blackest Market DNA.  This will remove all leaves and roots.",
    cost: 50000, // Adjust sugar cost as necessary
    effect: (dispatch, getState, quantity) => {
      const sugar = getState().plant.sugar; // Get sugar from plant slice
      if (sugar >= 500) {
        dispatch(deductSugar(50000 * quantity)); // Deduct sugar cost
        dispatch(removeAllRootsAndLeaves()); // Remove all roots and leaves
        dispatch(
          increaseGeneticMarkers({ amount: 100 * quantity, plantType: "Fern" })
        ); // Add 1 DNA
      } else {
        console.error("Not enough sugar to buy DNA");
      }
    },
  },
  // ... other mushroom items
];

export const GRASS_MUSHROOM_ITEMS: MushroomItem[] = [
  {
    id: "wildfire",
    name: "Wildfire",
    description:
      "Burn the forest to the ground to rejuvenate the soil. (Reset Leaves Needed for DNA)",
    cost: 250000000000,
    effect: (dispatch, getState, quantity) => {
      dispatch(deductSunlight(250000000000)); // Deduct sugar cost
      dispatch(resetGrassGeneticMarkerThreshold()); // Reset the succulent genetic marker threshold
    },
  },
];

export const DESERT_MUSHROOM_ITEMS: MushroomItem[] = [
  {
    id: "water_drop",
    name: "Water Drop",
    description: "150 water.",
    cost: 500,
    effect: (dispatch, getState, quantity) => {
      dispatch(deductSugar(500 * quantity)); // Deduct sugar cost
      dispatch(addWater(150 * quantity)); // Add 150 water
    },
  },
  {
    id: "water_splash",
    name: "Water Splash",
    description: "500 water.",
    cost: 1000,
    effect: (dispatch, getState, quantity) => {
      dispatch(deductSugar(1000 * quantity)); // Deduct sugar cost
      dispatch(addWater(500 * quantity)); // Add 300 water
    },
  },
  {
    id: "water_flood",
    name: "Water Flood",
    description: "10000 water.",
    cost: 5000,
    effect: (dispatch, getState, quantity) => {
      dispatch(deductSugar(5000 * quantity)); // Deduct sugar cost
      dispatch(addWater(10000 * quantity)); // Add 10000 water
    },
  },
  {
    id: "reset_succulent_threshold",
    name: "Reset Sugar needed for DNA",
    description: "Reset the amount of sugar needed to gain DNA progress.",
    cost: 1000000,
    effect: (dispatch, getState, quantity) => {
      dispatch(deductSugar(1000000)); // Deduct sugar cost
      dispatch(resetSucculentGeneticMarkerThreshold()); // Reset the succulent genetic marker threshold
    },
  },
  {
    id: "desert_night",
    name: "Desert Night",
    description: "Time travel in the Darkness of the Desert. 144 ticks.",
    cost: 1000000000,
    effect: (dispatch, getState, quantity) => {
      dispatch(increaseGlobalBoostedTicks(144 * quantity)); // Add 144 ticks
      dispatch(deductSunlight(1000000000 * quantity)); // Deduct sugar cost
    },
  },
  {
    id: "desert_night_2",
    name: "Darker Desert Night",
    description: "Time travel in the Darkness of the Desert. 7200 ticks.",
    cost: 50000000000,
    effect: (dispatch, getState, quantity) => {
      dispatch(increaseGlobalBoostedTicks(7200 * quantity));
      dispatch(deductSunlight(50000000000 * quantity));
    },
  },
  {
    id: "desert_rain",
    name: "Desert Rain",
    description: "Time travel in the intense Desert Rains. 144 ticks.",
    cost: 1000000000,
    effect: (dispatch, getState, quantity) => {
      dispatch(increaseGlobalBoostedTicks(144 * quantity));
      dispatch(deductWater(1000000000 * quantity));
    },
  },
  {
    id: "desert_rain_2",
    name: "Deeper Desert Rain",
    description: "Time travel in the intense Desert Rains. 7200 ticks.",
    cost: 50000000000,
    effect: (dispatch, getState, quantity) => {
      dispatch(increaseGlobalBoostedTicks(7200 * quantity));
      dispatch(deductWater(50000000000 * quantity));
    },
  },
];

export const LICHEN_MUSHROOM_ITEMS: MushroomItem[] = [
  {
    id: "shade_for_sugar",
    name: "Shady Protection Racket",
    description: "500 Sugar.",
    cost: 50000,
    effect: (dispatch, getState, quantity) => {
      dispatch(deductSunlight(50000 * quantity)); // Deduct sugar cost
      dispatch(increaseSugar(500 * quantity)); // Add 150 water
    },
  },
  {
    id: "shade_for_sugar_2",
    name: "Shadier Protection Racket",
    description: "5000 Sugar.",
    cost: 500000,
    effect: (dispatch, getState, quantity) => {
      dispatch(deductSunlight(500000 * quantity)); // Deduct sugar cost
      dispatch(increaseSugar(5000 * quantity)); // Add 150 water
    },
  },
  {
    id: "moss_rain",
    name: "Waterfall",
    description: "Time travel through the waterfall. (60 ticks)",
    cost: 50000,
    effect: (dispatch, getState, quantity) => {
      dispatch(increaseGlobalBoostedTicks(60 * quantity));
      dispatch(deductWater(50000 * quantity));
    },
  },
];

export const MUSHROOM_ITEM_FUNCTIONS: {
  [key: string]: (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void;
} = {
  nitrogen: MUSHROOM_ITEMS.find((item) => item.id === "nitrogen")?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  buyDNA: MUSHROOM_ITEMS.find((item) => item.id === "buyDNA")?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  buyDNA_2: MUSHROOM_ITEMS.find((item) => item.id === "buyDNA_2")?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  water_drop: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "water_drop")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  water_splash: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "water_splash")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  water_flood: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "water_flood")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  desert_night: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "desert_night")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  desert_night_2: DESERT_MUSHROOM_ITEMS.find(
    (item) => item.id === "desert_night_2"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  desert_rain: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "desert_rain")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  desert_rain_2: DESERT_MUSHROOM_ITEMS.find(
    (item) => item.id === "desert_rain_2"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  shade_for_sugar: LICHEN_MUSHROOM_ITEMS.find(
    (item) => item.id === "shade_for_sugar"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
  shade_for_sugar_2: LICHEN_MUSHROOM_ITEMS.find(
    (item) => item.id === "shade_for_sugar_2"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState,
    quantity: number
  ) => void,
};
