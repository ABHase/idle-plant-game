// gameActions.ts

import { ThunkAction } from "redux-thunk";
import { RootState } from "./rootReducer";
import { Action } from "@reduxjs/toolkit"; // Import Action
import {
  incrementScore,
  incrementTotalCellsCompleted,
  updateTime,
  updateTimeWithScale,
} from "./Slices/appSlice";
import {
  evolvePlant,
  produceGeneticMarkers,
  produceSugar,
  updateMaturityLevel,
  updateWaterAndSunlight,
  resetRootRot,
  removeRoots,
  autoGrowLeaves,
  autoGrowRoots,
  deductSugar,
  addSugarToFlower,
  addWaterToFlower,
  removeFlower,
  deductWater,
  increaseFlowerThreshold,
  resetPlant,
  setPlantType,
  setHasReceivedPoint,
} from "./Slices/plantSlice";
import {
  addGeneticMarkersBush,
  reduceGlobalBoostedTicks,
  resetGlobalState,
  setCurrentCell,
  setVineGeneticMarkers,
  updateGeneticMarkerProgress,
} from "./Slices/gameStateSlice";
import { LEAF_COST, ROOT_COST } from "./constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UPGRADES } from "./upgrades";
import {
  PlantHistoryEntry,
  addPlantToHistory,
} from "./Slices/plantHistorySlice";
import { completeCell } from "./Slices/cellCompletionSlice";
import {
  purchaseUpgrade,
  resetUpgrades,
  setPurchasedUpgrades,
} from "./Slices/upgradesSlice";
import { calculateAdjacencyUpgrades } from "./calculateAdjacencyUpgrades";
import { time } from "console";

let ticksSinceLadybugActivation = 0;

export const updateGame = (
  timeScale: number
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return (dispatch, getState) => {
    const currentTotalTime = getState().app.totalTime;
    const newTotalTime = currentTotalTime + 1 * timeScale;
    const gameState = getState().globalState;
    const plant = getState().plant;
    const currentSeason = getState().plantTime.season;

    const currentSugar = getState().plant.sugar;
    const maxResourceToSpend = getState().plant.maxResourceToSpend;
    // Dispatch updateTime with newTotalTime
    dispatch(updateTimeWithScale({ totalTime: newTotalTime, timeScale }));

    // If the plant has 0 water dispatch removeLeaves with a payload of 1 every time the currentMinute is 0
    if (plant.leafWaterUsage && plant.water <= 0) {
      const leavesToDeduct = Math.ceil(plant.leaves * 0.01);
      dispatch({
        type: "plant/removeLeaves",
        payload: { count: leavesToDeduct, reason: "noWater" },
      });
    }

    // If the plant has more than 1000 sugar add one aphid every 12th cycle but only if ladybugs are not less than 1, and plant.type is not Succulent
    if (
      !plant.aphidImmunity &&
      plant.type === "Fern" &&
      plant.ladybugs === 1 &&
      plant.sugar >= 1000
    ) {
      dispatch({ type: "plant/increaseAphids", payload: timeScale });
    }

    // Check if ladybugs are less than 1
    if (plant.ladybugs < 1) {
      // Increment the local tick count for ladybug activation by the timeScale
      ticksSinceLadybugActivation += timeScale;

      //dispatch deductAllAphids
      dispatch({ type: "plant/deductAllAphids" });

      // Check if 7 days (2016 ticks) have passed
      if (ticksSinceLadybugActivation >= 2016) {
        dispatch({ type: "plant/resetLadybugs" });
        // Reset the local tick count
        ticksSinceLadybugActivation = 0;
      }
    }

    // Determine the required resource type based on the plant type
    const requiredResource =
      plant.type === "Grass" ? plant.leaves : plant.sugar;

    type PlantType = "Fern" | "Moss" | "Succulent" | "Grass" | "Vine";
    type Thresholds = {
      [key in PlantType]?: number;
    };

    const thresholds: Thresholds = {
      Fern: gameState.geneticMarkerThreshold,
      Moss: gameState.geneticMarkerThresholdMoss,
      Succulent: gameState.geneticMarkerThresholdSucculent,
      Grass: gameState.geneticMarkerThresholdGrass,
      Vine: gameState.geneticMarkerThresholdVine,
    };

    let resourceThreshold =
      thresholds[plant.type as PlantType] || gameState.geneticMarkerThreshold;

    // If the geneticMarkerUpgradeActive flag is true, quadruple the resource threshold
    if (plant.geneticMarkerUpgradeActive) {
      resourceThreshold *= 4;
    }

    // Calculate potential consumption based on timeScale
    const potentialConsumption = calculateTotalPotentialConsumption(
      resourceThreshold,
      timeScale
    );

    // Determine the actual consumption
    let actualConsumption = Math.min(potentialConsumption, requiredResource);

    // If potential consumption is greater than the available resource, adjust the actual consumption
    if (potentialConsumption > requiredResource) {
      actualConsumption = requiredResource;
    }

    // Calculate the resource ratio
    let resourceRatio: number;
    if (actualConsumption === potentialConsumption) {
      resourceRatio = 1; // If we can afford the entire resource, the ratio is 1
    } else {
      resourceRatio = actualConsumption / potentialConsumption;
    }

    // Modify the timeScale based on the resourceRatio
    const adjustedTimeScale = Math.max(
      1,
      Math.floor(timeScale * resourceRatio)
    );

    const accurateTimeScale = calculateAdjustedTimeScale(
      resourceThreshold,
      timeScale,
      actualConsumption
    );

    // Check conditions:
    // 1. Genetic marker production is on
    // 2. Required resource is above or equals the threshold
    // 3. The resource is below the maxResourceToSpend or it's not set

    if (
      plant.is_genetic_marker_production_on &&
      actualConsumption >= resourceThreshold &&
      (maxResourceToSpend === null || resourceThreshold < maxResourceToSpend)
    ) {
      dispatch(produceGeneticMarkers(actualConsumption));
      dispatch(
        updateGeneticMarkerProgress({
          geneticMarkerUpgradeActive: plant.geneticMarkerUpgradeActive,
          plantType: plant.type,
          timeScale: accurateTimeScale, // <-- Use the adjusted timeScale
        })
      );
    }

    //Check if the plant has zero water and if so dispatch resetRootRot
    if (plant.water <= 0) {
      dispatch(resetRootRot());
    }

    // Check if the plant has more root rot than root rot threshold, if so dispatch removeRoots
    if (plant.rootRot >= plant.rootRotThreshold) {
      dispatch(removeRoots(timeScale));
    }

    // If plant type is Succulent, and plant water * 100 is greater than plant needles, dispatch rabbit attack
    if (
      plant.type === "Succulent" &&
      plant.water > plant.needles * 100 * plant.needleProtection &&
      !plant.rabbitImmunity
    ) {
      dispatch({ type: "plant/rabbitAttack", payload: timeScale });
    }

    // Dispatch deduct sugar with a payload equal to the number of aphids and if the plant has 0 sugar dispatch deduct aphids with payload equal to the number of aphids
    if (plant.aphids > 0) {
      dispatch({
        type: "plant/deductSugar",
        payload: plant.aphids * timeScale,
      });
      if (plant.sugar <= 0) {
        dispatch({ type: "plant/deductAllAphids" });
      }
    }

    const difficulty = gameState.difficulty;

    // Check if sugar hits a billion and has not received point yet
    if (plant.sugar >= 1000000000 && !plant.hasReceivedPoint) {
      dispatch(setHasReceivedPoint());
      dispatch(incrementScore(difficulty));
    }

    //Plant Production Dispatches
    dispatch(updateMaturityLevel());
    dispatch(
      updateWaterAndSunlight({ season: currentSeason, timeScale: timeScale })
    );

    dispatch(
      produceSugar({
        season: currentSeason,
        difficulty: difficulty,
        timeScale: timeScale,
      })
    );

    dispatch(updateFlowers(timeScale));

    // Calculate the maximum number of growth units that can be afforded
    const maxLeafGrowthUnits = Math.floor(
      currentSugar / (LEAF_COST * plant.leafAutoGrowthMultiplier)
    );
    const maxRootGrowthUnits = Math.floor(
      currentSugar / (ROOT_COST * plant.rootAutoGrowthMultiplier)
    );

    // Calculate actual number of growth units, considering timeScale
    const actualLeafGrowthUnits = Math.min(maxLeafGrowthUnits, timeScale);
    const actualRootGrowthUnits = Math.min(maxRootGrowthUnits, timeScale);

    // Check if the plant has at least the LEAF_COST for a leaf
    if (actualLeafGrowthUnits > 0 && plant.leafGrowthToggle) {
      dispatch(
        autoGrowLeaves({
          cost:
            LEAF_COST * plant.leafAutoGrowthMultiplier * actualLeafGrowthUnits,
          multiplier: plant.autoGrowthMultiplier * actualLeafGrowthUnits,
        })
      );
    }

    // Check if the plant has at least the ROOT_COST for a root
    if (actualRootGrowthUnits > 0 && plant.rootGrowthToggle) {
      dispatch(
        autoGrowRoots({
          cost:
            ROOT_COST * plant.rootAutoGrowthMultiplier * actualRootGrowthUnits,
          multiplier: plant.autoGrowthMultiplier * actualRootGrowthUnits,
        })
      );
    }

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
    case "Bush":
      availableGeneticMarkers = state.globalState.geneticMarkersBush;
      break;
    case "Vine":
      availableGeneticMarkers = state.globalState.geneticMarkersVine;
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
  let upgrade = UPGRADES[plantType]?.find((u) => u.id === upgradeId);

  // Also check in Meta upgrades if not found
  if (!upgrade) {
    upgrade = UPGRADES["Meta"]?.find((u) => u.id === upgradeId);
  }

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
    const plantHistoryEntries = getState().plantHistory.entries;

    // If there's a previous history entry, use its dayReplaced as datePlanted for current plant
    const lastPlantDayReplaced =
      plantHistoryEntries.length > 0
        ? plantHistoryEntries[plantHistoryEntries.length - 1].dayReplaced
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

    let bestSizeReached = 0;
    let bestWaterAbsorbed = 0;
    let bestSunlightAbsorbed = 0;
    let bestSugarCreated = 0;

    plantHistoryEntries.forEach((entry) => {
      if (entry.sizeReached > bestSizeReached) {
        bestSizeReached = entry.sizeReached;
      }
      if (entry.totalWaterAbsorbed > bestWaterAbsorbed) {
        bestWaterAbsorbed = entry.totalWaterAbsorbed;
      }
      if (entry.totalSunlightAbsorbed > bestSunlightAbsorbed) {
        bestSunlightAbsorbed = entry.totalSunlightAbsorbed;
      }
      if (entry.totalSugarCreated > bestSugarCreated) {
        bestSugarCreated = entry.totalSugarCreated;
      }
    });

    const shouldAddToHistory =
      plant.maturity_level > bestSizeReached ||
      plant.totalWaterAbsorbed > bestWaterAbsorbed ||
      plant.totalSunlightAbsorbed > bestSunlightAbsorbed ||
      plant.totalSugarCreated > bestSugarCreated;

    if (shouldAddToHistory) {
      // Dispatch the action to add the current state of the plant to history
      dispatch(addPlantToHistory(historyEntry));
    }

    // Dispatch the action to evolve the plant with the passed upgrades
    dispatch(
      evolvePlant({
        plantType: plantType,
        upgrades: upgrades,
      })
    );
  };
};

export const updateFlowers = (
  timeScale: number = 1
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return (dispatch, getState) => {
    const plant = getState().plant;
    const flowersToUpdate: { index: number; sugar?: number; water?: number }[] =
      [];
    const flowersToRemove: number[] = [];

    for (let i = plant.flowers.length - 1; i >= 0; i--) {
      const flower = plant.flowers[i];
      let availableSugar = plant.sugar;
      let availableWater = plant.water;

      const sugarThresholdMet = flower.sugar >= plant.flowerSugarThreshold;
      const waterThresholdMet = flower.water >= plant.flowerWaterThreshold;

      let sugarAcquired = false;
      let waterAcquired = false;

      const scaledFlowerSugarRate =
        plant.flowerSugarConsumptionRate * timeScale;
      const scaledFlowerWaterRate =
        plant.flowerWaterConsumptionRate * timeScale;

      if (!sugarThresholdMet && availableSugar >= scaledFlowerSugarRate) {
        dispatch(deductSugar(scaledFlowerSugarRate));
        flowersToUpdate.push({ index: i, sugar: scaledFlowerSugarRate });
        sugarAcquired = true;
        availableSugar -= scaledFlowerSugarRate;
      }

      if (!waterThresholdMet && availableWater >= scaledFlowerWaterRate) {
        dispatch(deductWater(scaledFlowerWaterRate));
        flowersToUpdate.push({ index: i, water: scaledFlowerWaterRate });
        waterAcquired = true;
        availableWater -= scaledFlowerWaterRate;
      }

      if (sugarThresholdMet && waterThresholdMet) {
        dispatch(addGeneticMarkersBush({ amount: plant.flowerDNA }));
        dispatch(increaseFlowerThreshold());
        flowersToRemove.push(i);
      } else if (
        availableSugar < scaledFlowerSugarRate ||
        availableWater < scaledFlowerWaterRate ||
        !(sugarAcquired && waterAcquired)
      ) {
        flowersToRemove.push(i);
      }
    }

    // After the loop completes
    for (const { index, sugar, water } of flowersToUpdate) {
      if (sugar) dispatch(addSugarToFlower(index, sugar));
      if (water) dispatch(addWaterToFlower(index, water));
    }
    for (const index of flowersToRemove) {
      dispatch(removeFlower(index));
    }
  };
};

export const completeCellAndDeductSugar = (
  targetCellIndex: number
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return (dispatch, getState) => {
    // Get the current state
    const state = getState();
    const currentCell = state.globalState.currentCell;
    const vineDNA = state.globalState.geneticMarkersVine;
    const currentPlantType = state.plant.type;
    const currentSugar = state.plant.sugar;
    const vineUpgrades = state.upgrades.purchased.filter((upgrade) =>
      upgrade.toLowerCase().startsWith("vine_")
    );

    // Complete the cell with the current plant type
    dispatch(
      completeCell({ cellNumber: currentCell, plantType: currentPlantType })
    );

    dispatch(resetGlobalState());

    // Set the current cell
    dispatch(setCurrentCell({ cellNumber: targetCellIndex }));

    // Calculate adjacency upgrades (assuming a function for this)
    const adjacencyUpgrades = calculateAdjacencyUpgrades(
      state,
      targetCellIndex,
      currentPlantType,
      currentCell
    );

    // Set the new adjacency upgrades
    dispatch(setPurchasedUpgrades([...adjacencyUpgrades, ...vineUpgrades]));

    dispatch(setVineGeneticMarkers(vineDNA));

    dispatch(evolveAndRecordPlant(currentPlantType, adjacencyUpgrades));
    dispatch(incrementTotalCellsCompleted());
  };
};

// Calculate the total potential consumption considering the exponential increase in cost
const calculateTotalPotentialConsumption = (
  threshold: number,
  timeScale: number
) => {
  let totalCost = 0;
  let currentThreshold = threshold;

  for (let i = 0; i < timeScale; i++) {
    totalCost += currentThreshold;
    currentThreshold = Math.floor(currentThreshold * 1.1); // Apply the exponential increase
  }

  return totalCost;
};

const calculateAdjustedTimeScale = (
  threshold: number,
  timeScale: number,
  actualConsumption: number
) => {
  let totalCost = 0;
  let currentThreshold = threshold;
  let adjustedTimeScale = 0;

  for (let i = 0; i < timeScale; i++) {
    if (totalCost + currentThreshold > actualConsumption) {
      // If the next iteration exceeds the actualConsumption, break the loop
      break;
    }
    totalCost += currentThreshold;
    currentThreshold = Math.floor(currentThreshold * 1.1); // Apply the exponential increase
    adjustedTimeScale++; // Increment the adjustedTimeScale for each iteration that's within the budget
  }

  return adjustedTimeScale; // This value will be more accurate for determining iterations
};
