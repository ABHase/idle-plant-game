import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { SUGAR_THRESHOLD, SECONDARY_SUGAR_THRESHOLD } from "../constants";
import { UPGRADE_FUNCTIONS, UPGRADES } from "../upgrades"; // Assuming you have UPGRADES defined in an 'upgrades.ts' file
import {
  calculateWaterAndSunlight,
  calculateSugarPhotosynthesis,
  geneticSugarConsumption,
} from "../formulas";
import { PLANT_CONFIGS } from "../plantConfigs";
import { type } from "os";

type EvolvePlantPayload = {
  plantType: string;
  upgrades: string[];
};

export interface PlantState {
  id: string; //Unique ID for the plant
  type: string; //Plant type Fern, Moss, Flower, Grass
  maturity_level: number; //Plant maturity level
  sugar_production_rate: number; //Sugar production rate, base
  genetic_marker_production_rate: number; //Genetic marker production rate, base
  is_sugar_production_on: boolean; //Is sugar production on?
  is_genetic_marker_production_on: boolean; //Is genetic marker production on?
  is_secondary_resource_production_on: boolean; //Is secondary resource production on?
  sunlight: number; //Sunlight level
  sunlight_absorption_rate: number; //Sunlight absorption rate, base
  sunlight_efficiency_multiplier: number; //Sunlight efficiency multiplier, base
  water: number; //Water level
  water_absorption_rate: number; //Water absorption rate, base
  water_efficiency_multiplier: number; //Water efficiency multiplier, base
  sunlight_absorption_multiplier: number; //Sunlight absorption multiplier, base
  water_absorption_multiplier: number; //Water absorption multiplier, base
  sugar: number; //Sugar level
  ladybugs: number; //Ladybugs this is the number that is making the tax, so it should be 1 by default and less when the tax is on
  ladybugTax: number; //Ladybug tax this is the number that is multiplied by the ladybugs number to change the tax rate
  roots: number; //Roots level
  leaves: number; //Leaves level
  resin: number; //Resin level not used yet
  sugarProduced: number; //Sugar produced
  lastProductionTimestamp: number; //Last production timestamp, not used currently
  totalWaterAbsorbed: number; //Total water absorbed by the plant since creation
  totalSunlightAbsorbed: number; //Total sunlight absorbed by the plant since creation
  totalSugarCreated: number; //Total sugar created by the plant since creation
  geneticMarkerUpgradeActive: boolean; //Is the genetic marker upgrade active? This is for the upgrade that increases the genetic marker production rate and prices
  rootRot: number; //Root rot level, this is the number that is used to determine if roots are rotting from fungus
  rootRotThreshold: number; //Root rot threshold, this is the number that is used to determine if roots are rotting from fungus
  springModifier: number; //Spring modifier, this is the number that is used to determine how much water is absorbed in spring
  summerModifier: number; //Summer modifier, this is the number that is used to determine how much sunlight is absorbed in summer
  autumnModifier: number; //Autumn modifier, this is the number that is used to determine how much sugar is produced in autumn
  winterModifier: number; //Winter modifier, this is the number that is used to determine the winter penalty
  aphids: number; //Aphids level, this is the number that is used to determine how much sugar is consumed by aphids
  leafWaterUsage: boolean; //Leaf water usage, this is the boolean that is used to determine if leaves use water, meta perk for moss
  agaveSugarBonus: boolean; //Agave sugar bonus, this is the boolean that is used to determine if agave has a sugar bonus, meta perk for succulent
  needles: number; //Needles, protect against rabbit attacks
  needleProtection: number; //Needle protection, this is the number that is used to determine how much protection is provided by needles
  rabbitAttack: boolean; //Rabbit attack, this is the boolean that is used to determine if the plant is being attacked by rabbits
  grassGrowthToggle: boolean; //Grass growth toggle, this is the boolean that is used to determine if the plant can passively grow
  leafGrowthToggle: boolean; //Leaf growth toggle, this is the boolean that is used to determine if the plant is passively growing leaves
  leafAutoGrowthMultiplier: number; //Leaf auto growth, leaf cost multiplied by this number to auto grow leaves
  rootGrowthToggle: boolean; //Root growth toggle, this is the boolean that is used to determine if the plant is passively growing roots
  rootAutoGrowthMultiplier: number; //Root auto growth, root cost multiplied by this number to auto grow roots
}

export const initialState: PlantState = PLANT_CONFIGS.Fern; // Setting Fern as the default plant

const plantSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    resetPlant: () => initialState,

    initializeNewPlant: (
      state,
      action: PayloadAction<{ plantType: string }>
    ) => {
      // This function can now initialize plants based on a provided plantType
      if (PLANT_CONFIGS[action.payload.plantType]) {
        return {
          ...PLANT_CONFIGS[action.payload.plantType],
          id: uuidv4(),
        };
      } else {
        return {
          ...PLANT_CONFIGS.Fern,
          id: uuidv4(),
        };
      }
    },
    evolvePlant: (state, action: PayloadAction<EvolvePlantPayload>) => {
      const { plantType, upgrades } = action.payload;
      const plantConfig = PLANT_CONFIGS[plantType];

      if (!plantConfig) {
        console.error(`Unknown plant type: ${plantType}`);
        return;
      }

      const availableUpgrades = { ...UPGRADES.Meta, ...UPGRADES[plantType] }; // Combine meta and specific plant upgrades

      if (!availableUpgrades) {
        console.error(`No upgrades available for plant type: ${plantType}`);
        return;
      }

      Object.assign(state, plantConfig);
      state.id = uuidv4();

      // Apply meta upgrades first
      upgrades.forEach((upgradeId) => {
        const metaUpgradeFunction = UPGRADE_FUNCTIONS["Meta"][upgradeId];
        if (metaUpgradeFunction) {
          metaUpgradeFunction(state);
        }
      });

      // Then apply plant specific upgrades
      upgrades.forEach((upgradeId) => {
        const upgradeFunction = UPGRADE_FUNCTIONS[plantType][upgradeId];
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
      if (state.type === "Moss") {
        state.roots += 1;
      } else if (state.sugar >= action.payload.cost) {
        state.sugar -= action.payload.cost;
        state.roots += 1;
      }
    },

    buyLeaves: (state, action: PayloadAction<{ cost: number }>) => {
      if (state.sugar >= action.payload.cost) {
        if (state.type === "Succulent") {
          const waterCost = 100 * action.payload.cost;
          if (state.water >= waterCost) {
            state.sugar -= action.payload.cost;
            state.water -= waterCost;
            state.leaves += 1;
          }
        } else {
          state.sugar -= action.payload.cost;
          state.leaves += 1;
        }
      }
    },

    //Reducer to decrease leaves by payload
    removeLeaves: (state, action: PayloadAction<number>) => {
      state.leaves = Math.max(0, state.leaves - action.payload);
    },
    produceGeneticMarkers: (state) => {
      const neededResource = geneticSugarConsumption(state);

      if (state.type === "Grass") {
        // Consume leaves for grass
        const neededLeaves = neededResource / 5; // 1/5 the sugar amount
        if (state.leaves >= neededLeaves) {
          state.leaves -= neededLeaves;
        }
      } else {
        // Consume sugar for other plants
        if (state.sugar >= neededResource) {
          state.sugar -= neededResource;
        }
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
    //Reducer to reset ladybugs to 1
    resetLadybugs: (state) => {
      state.ladybugs = 1;
    },
    //Reducer to add an amount of water to the plant from the payload
    addWater: (state, action: PayloadAction<number>) => {
      state.water += action.payload;
    },
    //Reducer to simulate a rabbit attack, lose 10% water, 1 leaf and then set rabbit attack back to false
    rabbitAttack: (state) => {
      state.rabbitAttack = true;
      state.water = Math.max(0, state.water - state.water * 0.1);
      state.leaves = Math.max(0, state.leaves - 1);
    },
    // Set Rabbit Attack to false
    resetRabbitAttack: (state) => {
      state.rabbitAttack = false;
    },
    //Reducer to buy needles
    buyNeedles: (state, action: PayloadAction<{ cost: number }>) => {
      if (state.sugar >= action.payload.cost) {
        state.sugar -= action.payload.cost;
        state.needles += 1;
      }
    },
    //Reducer to toggle leaf growth to the opposite of its current state
    toggleLeafGrowth: (state) => {
      state.leafGrowthToggle = !state.leafGrowthToggle;
    },
    //Reducer to toggle root growth to the opposite of its current state
    toggleRootGrowth: (state) => {
      state.rootGrowthToggle = !state.rootGrowthToggle;
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
  deductAllAphids,
  removeLeaves,
  resetLadybugs,
  addWater,
  rabbitAttack,
  resetRabbitAttack,
  buyNeedles,
  toggleLeafGrowth,
  toggleRootGrowth,
} = plantSlice.actions;
export default plantSlice.reducer;
