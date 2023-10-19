// gameActions.ts

import { ThunkAction } from "redux-thunk";
import { RootState } from "./rootReducer";
import { Action } from "@reduxjs/toolkit"; // Import Action
import { updateTime } from "./Slices/appSlice";
import {
  evolvePlant,
  produceGeneticMarkers,
  produceSecondaryResource,
  produceSugar,
  updateMaturityLevel,
  updateWaterAndSunlight,
  resetRootRot,
  removeRoots,
  buyLeaves,
  buyRoots,
} from "./Slices/plantSlice";
import {
  increaseGeneticMarkers,
  updateGeneticMarkerProgress,
} from "./Slices/gameStateSlice";
import {
  LEAF_COST,
  ROOT_COST,
  SECONDARY_SUGAR_THRESHOLD,
  SUGAR_THRESHOLD,
} from "./constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UPGRADES } from "./upgrades";
import {
  PlantHistoryEntry,
  addPlantToHistory,
} from "./Slices/plantHistorySlice";

//... [other imports]

let ticksSinceLadybugActivation = 0;

export const updateGame = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => {
  return (dispatch, getState) => {
    const currentTotalTime = getState().app.totalTime;
    const newTotalTime = currentTotalTime + 1;
    const currentSeason = getState().plantTime.season;
    const currentMinute = getState().plantTime.update_counter;
    const currentSugar = getState().plant.sugar;
    const plantType = getState().plant.type;

    // Dispatch updateTime with newTotalTime
    dispatch(updateTime(newTotalTime));

    const plant = getState().plant;

    // Check if the plant has the the LEAF_COST for a leaf, if so dispatch buyLeaves with the payload of LEAF_COST
    if (
      currentSugar >= LEAF_COST * plant.leafAutoGrowthMultiplier &&
      plant.leafGrowthToggle
    ) {
      dispatch(buyLeaves({ cost: LEAF_COST * plant.leafAutoGrowthMultiplier }));
    }

    //Check if the plant has the ROOT_COST for a root, if so dispatch buyRoots with the payload of ROOT_COST
    if (
      currentSugar >= ROOT_COST * plant.rootAutoGrowthMultiplier &&
      plant.rootGrowthToggle
    ) {
      dispatch(buyRoots({ cost: ROOT_COST * plant.rootAutoGrowthMultiplier }));
    }

    // Check if ladybugs are less than 1
    if (plant.ladybugs < 1) {
      // Increment the local tick count for ladybug activation
      ticksSinceLadybugActivation++;
      //dispatch deductAllAphids
      dispatch({ type: "plant/deductAllAphids" });

      // Check if 7 days (2016 ticks) have passed
      if (ticksSinceLadybugActivation >= 2016) {
        dispatch({ type: "plant/resetLadybugs" });
        // Reset the local tick count
        ticksSinceLadybugActivation = 0;
      }
    }

    //Genetic Marker (DNA) Production Dispatches

    const requiredResource =
      plant.type === "Grass" ? plant.leaves : plant.sugar;
    const resourceThreshold =
      plant.type === "Grass" ? SUGAR_THRESHOLD / 5 : SUGAR_THRESHOLD;

    if (
      plant.is_genetic_marker_production_on &&
      requiredResource >= resourceThreshold
    ) {
      dispatch(produceGeneticMarkers());
      dispatch(
        updateGeneticMarkerProgress({
          geneticMarkerUpgradeActive: plant.geneticMarkerUpgradeActive,
          plantType: plant.type,
        })
      );
    }

    //Check if the plant has zero water and if so dispatch resetRootRot
    if (plant.water <= 0) {
      dispatch(resetRootRot());
    }

    // If the plant has 0 water dispatch removeLeaves with a payload of 1 every time the currentMinute is 0
    if (plant.leafWaterUsage && plant.water <= 0 && currentMinute % 30 === 0) {
      dispatch({ type: "plant/removeLeaves", payload: 1 });
    }

    // Check if the plant has more root rot than root rot threshold, if so dispatch removeRoots
    if (plant.rootRot >= plant.rootRotThreshold) {
      dispatch(removeRoots());
    }

    // If plant type is Succulent, and plant water * 100 is greater than plant needles, dispatch rabbit attack
    if (
      plant.type === "Succulent" &&
      plant.water > plant.needles * 100 * plant.needleProtection
    ) {
      dispatch({ type: "plant/rabbitAttack" });
    }

    // If the plant has more than 1000 sugar add one aphid every 12th cycle but only if ladybugs are not less than 1, and plant.type is not Succulent
    if (
      plant.type !== "Succulent" &&
      plant.type !== "Moss" &&
      plant.ladybugs === 1 &&
      plant.sugar >= 1000 &&
      currentMinute % 15 === 0
    ) {
      dispatch({ type: "plant/increaseAphids", payload: 1 });
    }

    // Dispatch deduct sugar with a payload equal to the number of aphids and if the plant has 0 sugar dispatch deduct aphids with payload equal to the number of aphids
    if (plant.aphids > 0) {
      dispatch({ type: "plant/deductSugar", payload: plant.aphids });
      if (plant.sugar <= 0) {
        dispatch({ type: "plant/deductAllAphids" });
      }
    }

    //Plant Production Dispatches
    dispatch(updateMaturityLevel());
    dispatch(updateWaterAndSunlight({ season: currentSeason }));
    dispatch(produceSugar({ season: currentSeason }));

    // ... [other logic and dispatches as needed]
  };
};

export const purchaseUpgradeThunk = createAsyncThunk<
  void,
  { plantType: string; upgradeId: string },
  { state: RootState }
>("upgrades/purchase", async ({ plantType, upgradeId }, thunkAPI) => {
  const state = thunkAPI.getState();

  const metaUpgradesForPlant = UPGRADES["Meta"].filter((upgrade) =>
    upgrade.id.includes(plantType)
  );
  const specificUpgrades = UPGRADES[plantType];
  const availableUpgrades = [...metaUpgradesForPlant, ...specificUpgrades];

  // Find the right upgrade using the combined array of upgrades
  const upgrade = availableUpgrades.find((u) => u.id === upgradeId);

  if (!upgrade) {
    throw new Error("Upgrade not found");
  }

  // Use switch statement to check for the correct genetic marker based on plant type
  let availableGeneticMarkers: number;

  switch (plantType) {
    case "Fern":
      availableGeneticMarkers = state.globalState.geneticMarkers;
      break;
    case "Moss":
      availableGeneticMarkers = state.globalState.geneticMarkersMoss;
      break;
    case "Succulent":
      availableGeneticMarkers = state.globalState.geneticMarkersSucculent;
      break;
    case "Grass":
      availableGeneticMarkers = state.globalState.geneticMarkersGrass;
      break;
    default:
      throw new Error("Invalid plant type");
  }

  if (availableGeneticMarkers < upgrade.cost) {
    throw new Error("Not enough genetic markers");
  }

  thunkAPI.dispatch({
    type: "gameState/deductGeneticMarkers",
    payload: {
      amount: upgrade.cost,
      plantType: plantType,
    },
  });
  thunkAPI.dispatch({ type: "upgrades/purchaseUpgrade", payload: upgradeId });
});

export const sellUpgradeThunk = createAsyncThunk<
  void,
  { plantType: string; upgradeId: string },
  { state: RootState }
>("upgrades/sell", async ({ plantType, upgradeId }, thunkAPI) => {
  const state = thunkAPI.getState();

  // Find the right upgrade using the plant type
  const upgrade = UPGRADES[plantType]?.find((u) => u.id === upgradeId);

  if (!upgrade) {
    throw new Error("Upgrade not found");
  }

  // Check if the player owns this upgrade
  if (!state.upgrades.purchased.includes(upgradeId)) {
    throw new Error("Upgrade not owned");
  }

  const refundAmount = upgrade.cost;

  thunkAPI.dispatch({
    type: "gameState/increaseGeneticMarkers",
    payload: {
      amount: refundAmount,
      plantType: plantType,
    },
  });
  thunkAPI.dispatch({ type: "upgrades/sellUpgrade", payload: upgradeId });
});

export const evolveAndRecordPlant = (
  plantType: string,
  upgrades: string[]
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return (dispatch, getState) => {
    // Get the current state of the plant and other relevant states
    const plant = getState().plant;
    const plantTime = getState().plantTime;
    const plantHistory = getState().plantHistory.entries;

    // If there's a previous history entry, use its dayReplaced as datePlanted for current plant
    const lastPlantDayReplaced =
      plantHistory.length > 0
        ? plantHistory[plantHistory.length - 1].dayReplaced
        : null;
    const datePlanted = lastPlantDayReplaced || `Year 1-Spring-1`;

    // Create a history entry for the current plant
    const historyEntry: PlantHistoryEntry = {
      plantID: plant.id,
      datePlanted: datePlanted,
      dayReplaced: `Year ${plantTime.year}-${plantTime.season}-${plantTime.day}`,
      sizeReached: plant.maturity_level,
      totalWaterAbsorbed: plant.totalWaterAbsorbed,
      totalSunlightAbsorbed: plant.totalSunlightAbsorbed,
      totalSugarCreated: plant.totalSugarCreated,
    };

    // Dispatch the action to add the current state of the plant to history
    dispatch(addPlantToHistory(historyEntry));

    // Dispatch the action to evolve the plant with the passed upgrades
    dispatch(
      evolvePlant({
        plantType: plantType,
        upgrades: upgrades,
      })
    );
  };
};
