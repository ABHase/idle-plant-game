// mushroomItems.ts

import { ThunkDispatch } from "redux-thunk";
import { Action } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";
import { updateGame } from "./gameActions";
import {
  addGeneticMarkers,
  increaseGeneticMarkers,
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
    getState: () => RootState
  ) => void; // The function now takes dispatch and getState
};

export const MUSHROOM_ITEMS: MushroomItem[] = [
  {
    id: "nitrogen",
    name: "Nitrogen",
    description: "Try some fertilizer, time will just fly by.",
    cost: 1000,
    effect: (dispatch, getState) => {
      dispatch(activateTimeBoost()); // Activate time boost
      dispatch(deductSugar(1000)); // Deduct sugar cost
      dispatch(increaseRootRot(70)); // Increase root rot by 7

      let counter = 0;
      const intervalId = setInterval(() => {
        dispatch(updateGame());
        counter++;
        if (counter >= 144) {
          clearInterval(intervalId);
          dispatch(deactivateTimeBoost()); // Deactivate time boost
        }
      }, 50);
    },
  },

  {
    id: "buyDNA",
    name: "Buy DNA",
    description: "Black market DNA.",
    cost: 500, // Adjust sugar cost as necessary
    effect: (dispatch, getState) => {
      const sugar = getState().plant.sugar; // Get sugar from plant slice
      if (sugar >= 500) {
        dispatch(deductSugar(500)); // Deduct sugar cost
        dispatch(increaseRootRot(60)); // Increase root rot by 1
        dispatch(increaseGeneticMarkers({ amount: 1, plantType: "Fern" })); // Add 1 DNA
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
    effect: (dispatch, getState) => {
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
    effect: (dispatch, getState) => {
      dispatch(deductSugar(500)); // Deduct sugar cost
      dispatch(addWater(150)); // Add 150 water
    },
  },
  {
    id: "water_splash",
    name: "Water Splash",
    description: "500 water.",
    cost: 1000,
    effect: (dispatch, getState) => {
      dispatch(deductSugar(1000)); // Deduct sugar cost
      dispatch(addWater(500)); // Add 300 water
    },
  },
  {
    id: "water_flood",
    name: "Water Flood",
    description: "10000 water.",
    cost: 5000,
    effect: (dispatch, getState) => {
      dispatch(deductSugar(5000)); // Deduct sugar cost
      dispatch(addWater(10000)); // Add 10000 water
    },
  },
  {
    id: "reset_succulent_threshold",
    name: "Reset Sugar needed for DNA",
    description: "Reset the amount of sugar needed to gain DNA progress.",
    cost: 1000000,
    effect: (dispatch, getState) => {
      dispatch(deductSugar(1000000)); // Deduct sugar cost
      dispatch(resetSucculentGeneticMarkerThreshold()); // Reset the succulent genetic marker threshold
    },
  },
  {
    id: "desert_night",
    name: "Desert Night",
    description:
      "Time travel in the Darkness of the Desert. (Around 3 minutes)",
    cost: 1000000000,
    effect: (dispatch, getState) => {
      dispatch(activateTimeBoost()); // Activate time boost
      dispatch(deductSunlight(1000000000));

      let counter = 0;
      const intervalId = setInterval(() => {
        dispatch(updateGame());
        counter++;
        if (counter >= 144) {
          clearInterval(intervalId);
          dispatch(deactivateTimeBoost()); // Deactivate time boost
        }
      }, 50);
    },
  },
  {
    id: "desert_night_2",
    name: "Darker Desert Night",
    description:
      "Time travel in the Darkness of the Desert. (Around 150 minutes)",
    cost: 50000000000,
    effect: (dispatch, getState) => {
      dispatch(activateTimeBoost()); // Activate time boost
      dispatch(deductSunlight(50000000000));

      let counter = 0;
      const intervalId = setInterval(() => {
        dispatch(updateGame());
        counter++;
        if (counter >= 7200) {
          clearInterval(intervalId);
          dispatch(deactivateTimeBoost()); // Deactivate time boost
        }
      }, 50);
    },
  },
  {
    id: "desert_rain",
    name: "Desert Rain",
    description: "Time travel in the intense Desert Rains. (Around 3 minutes)",
    cost: 1000000000,
    effect: (dispatch, getState) => {
      dispatch(activateTimeBoost()); // Activate time boost
      dispatch(deductWater(1000000000));

      let counter = 0;
      const intervalId = setInterval(() => {
        dispatch(updateGame());
        counter++;
        if (counter >= 144) {
          clearInterval(intervalId);
          dispatch(deactivateTimeBoost()); // Deactivate time boost
        }
      }, 50);
    },
  },
  {
    id: "desert_rain_2",
    name: "Deeper Desert Rain",
    description:
      "Time travel in the intense Desert Rains. (Around 150 minutes)",
    cost: 50000000000,
    effect: (dispatch, getState) => {
      dispatch(activateTimeBoost()); // Activate time boost
      dispatch(deductWater(50000000000));

      let counter = 0;
      const intervalId = setInterval(() => {
        dispatch(updateGame());
        counter++;
        if (counter >= 7200) {
          clearInterval(intervalId);
          dispatch(deactivateTimeBoost()); // Deactivate time boost
        }
      }, 50);
    },
  },
];

export const LICHEN_MUSHROOM_ITEMS: MushroomItem[] = [
  {
    id: "shade_for_sugar",
    name: "Shady Protection Racket",
    description: "500 Sugar.",
    cost: 50000,
    effect: (dispatch, getState) => {
      dispatch(deductSunlight(50000)); // Deduct sugar cost
      dispatch(increaseSugar(500)); // Add 150 water
    },
  },
  {
    id: "shade_for_sugar_2",
    name: "Shadier Protection Racket",
    description: "5000 Sugar.",
    cost: 500000,
    effect: (dispatch, getState) => {
      dispatch(deductSunlight(500000)); // Deduct sugar cost
      dispatch(increaseSugar(5000)); // Add 150 water
    },
  },
];

export const MUSHROOM_ITEM_FUNCTIONS: {
  [key: string]: (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void;
} = {
  nitrogen: MUSHROOM_ITEMS.find((item) => item.id === "nitrogen")?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  buyDNA: MUSHROOM_ITEMS.find((item) => item.id === "buyDNA")?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  water_drop: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "water_drop")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  water_splash: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "water_splash")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  water_flood: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "water_flood")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  desert_night: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "desert_night")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  desert_night_2: DESERT_MUSHROOM_ITEMS.find(
    (item) => item.id === "desert_night_2"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  desert_rain: DESERT_MUSHROOM_ITEMS.find((item) => item.id === "desert_rain")
    ?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  desert_rain_2: DESERT_MUSHROOM_ITEMS.find(
    (item) => item.id === "desert_rain_2"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  shade_for_sugar: LICHEN_MUSHROOM_ITEMS.find(
    (item) => item.id === "shade_for_sugar"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
  shade_for_sugar_2: LICHEN_MUSHROOM_ITEMS.find(
    (item) => item.id === "shade_for_sugar_2"
  )?.effect as (
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>,
    getState: () => RootState
  ) => void,
};
