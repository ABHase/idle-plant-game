import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { SECONDARY_SUGAR_THRESHOLD } from "../constants";
import { UPGRADE_FUNCTIONS, UPGRADES } from "../upgrades"; // Assuming you have UPGRADES defined in an 'upgrades.ts' file
import {
  calculateWaterAndSunlight,
  calculateSugarPhotosynthesis,
} from "../formulas";
import { PLANT_CONFIGS } from "../plantConfigs";
import { getRandomColor } from "../randomColors";

// Action to add water to a specific flower
export const addWaterToFlower = createAction(
  "plant/addWaterToFlower",
  (index: number, amount: number) => ({ payload: { index, amount } })
);

// Action to add sugar to a specific flower
export const addSugarToFlower = createAction(
  "plant/addSugarToFlower",
  (index: number, amount: number) => ({ payload: { index, amount } })
);

// Action to remove a flower by index
export const removeFlower = createAction(
  "plant/removeFlower",
  (flowerIndex: number) => ({
    payload: flowerIndex,
  })
);
// Action to add a flower to the plant
export const addFlower = createAction(
  "plant/addFlower",
  (newFlower: Flower) => ({
    payload: {
      newFlower,
    },
  })
);

interface Flower {
  water: number;
  sugar: number;
  color: string;
}

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
  rabbitImmunity: boolean; //Rabbit immunity, this is the boolean that is used to determine if the plant is immune to rabbit attacks
  grassGrowthToggle: boolean; //Grass growth toggle, this is the boolean that is used to determine if the plant can passively grow
  leafGrowthToggle: boolean; //Leaf growth toggle, this is the boolean that is used to determine if the plant is passively growing leaves
  leafAutoGrowthMultiplier: number; //Leaf auto growth, leaf cost multiplied by this number to auto grow leaves
  rootGrowthToggle: boolean; //Root growth toggle, this is the boolean that is used to determine if the plant is passively growing roots
  rootAutoGrowthMultiplier: number; //Root auto growth, root cost multiplied by this number to auto grow roots
  lichenStoreAvailable: boolean; //Lichen store available, this is the boolean that is used to determine if the lichen store is available to moss
  autoGrowthMultiplier: number; //Auto growth multiplier, this is the number that is used to determine how many plant parts grow when auto growing
  aphidImmunity: boolean; //Aphid immunity, this is the boolean that is used to determine if the plant is immune to aphids
  flowers: Flower[]; //Flowers, this is the number that is used to determine how many flowers the plant has
  flowerSugarConsumptionRate: number; //Flower sugar consumption rate, this is the number that is used to determine how much sugar is consumed by flowers
  flowerWaterConsumptionRate: number; //Flower water consumption rate, this is the number that is used to determine how much water is consumed by flowers
  flowerSugarThreshold: number; //Flower sugar threshold, this is the number that is used to determine how much sugar is needed to grow a flower in a fruit
  flowerWaterThreshold: number; //Flower water threshold, this is the number that is used to determine how much water is needed to grow a flower in a fruit
  flowerDNA: number; //Flower DNA, this is the number that is used to determine how much DNA is gained from a flower
  maxResourceToSpend: number | null;
}

export const initialState: PlantState = PLANT_CONFIGS.Fern; // Setting Fern as the default plant

// Add water to a specific flower
const addWaterToFlowerReducer = (
  state: PlantState,
  action: PayloadAction<{ index: number; amount: number }>
) => {
  const { index, amount } = action.payload;
  state.flowers[index].water += amount;
};

// Add sugar to a specific flower
const addSugarToFlowerReducer = (
  state: PlantState,
  action: PayloadAction<{ index: number; amount: number }>
) => {
  const { index, amount } = action.payload;
  state.flowers[index].sugar += amount;
};

// Remove a specific flower
const removeFlowerReducer = (
  state: PlantState,
  action: PayloadAction<number> // index of flower to remove
) => {
  state.flowers.splice(action.payload, 1);
};

// Add a new flower
const addFlowerReducer = (
  state: PlantState,
  action: PayloadAction<{ newFlower: Flower }>
) => {
  const { newFlower } = action.payload;
  state.flowers.push(newFlower);
};

export const buyFlower = createAction(
  "plant/buyFlower",
  (cost: number, multiplier: number) => ({
    payload: {
      cost,
      multiplier,
    },
  })
);

const buyFlowerReducer = (
  state: PlantState,
  action: PayloadAction<{ cost: number; multiplier: number }>
) => {
  const { cost, multiplier } = action.payload;

  // Check if the plant can afford to buy the multiplied number of flowers
  if (state.sugar >= cost * multiplier) {
    // Deduct the cost for multiple flowers and add the new flowers with initial values
    state.sugar -= cost * multiplier;

    // Calculate how many flowers we can actually add based on the 100 limit
    const flowersToAdd = Math.min(multiplier, 100 - state.flowers.length);

    for (let i = 0; i < flowersToAdd; i++) {
      const newFlower = {
        sugar: 0,
        water: 0,
        color: getRandomColor(),
        // ... any other flower properties
      };
      state.flowers.push(newFlower);
    }
  } else {
    // Handle case when not enough resources to buy the multiplied number of flowers
  }
};

const plantSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    resetPlant: () => initialState,

    // Reducer for setting a specific plant type
    setPlantType: (
      state,
      action: PayloadAction<{ plantType: keyof typeof PLANT_CONFIGS }>
    ) => {
      return PLANT_CONFIGS[action.payload.plantType] || initialState;
    },

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

      const availableUpgrades = {
        ...UPGRADES.Meta,
        ...UPGRADES[plantType],
        ...UPGRADES.Adjacency,
      }; // Combine adjacency, meta, and specific plant upgrades

      if (!availableUpgrades) {
        console.error(`No upgrades available for plant type: ${plantType}`);
        return;
      }

      Object.assign(state, plantConfig);
      state.id = uuidv4();

      // Apply upgrades in order: adjacency, meta, and then plant-specific
      ["Adjacency", "Meta", plantType].forEach((upgradeCategory) => {
        upgrades.forEach((upgradeId) => {
          const upgradeFunction = UPGRADE_FUNCTIONS[upgradeCategory][upgradeId];
          if (upgradeFunction) {
            upgradeFunction(state);
          }
        });
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
    turnOffGeneticMarkerProduction: (state) => {
      state.is_genetic_marker_production_on = false;
    },
    buyRoots: (
      state,
      action: PayloadAction<{ cost: number; multiplier: number }>
    ) => {
      const totalCost = action.payload.cost * action.payload.multiplier;
      const affordableRoots = Math.floor(state.sugar / action.payload.cost); // maximum affordable roots with current sugar

      const actualMultiplier = Math.min(
        affordableRoots,
        action.payload.multiplier
      ); // take the smaller of the two

      if (state.type === "Moss") {
        state.roots += actualMultiplier;
      } else {
        state.sugar -= actualMultiplier * action.payload.cost;
        state.roots += actualMultiplier;
      }
    },
    buyLeaves: (
      state,
      action: PayloadAction<{ cost: number; multiplier: number }>
    ) => {
      const affordableLeavesFromSugar = Math.floor(
        state.sugar / action.payload.cost
      );
      let actualMultiplier = Math.min(
        affordableLeavesFromSugar,
        action.payload.multiplier
      );

      // Base deduction of sugar and addition of leaves
      const makePurchase = () => {
        state.sugar -= actualMultiplier * action.payload.cost;
        state.leaves += actualMultiplier;
      };

      if (state.type === "Succulent") {
        const waterCostPerLeaf = 100 * action.payload.cost;
        const affordableLeavesFromWater = Math.floor(
          state.water / waterCostPerLeaf
        );

        // Adjust actualMultiplier based on water availability
        actualMultiplier = Math.min(
          actualMultiplier,
          affordableLeavesFromWater
        );

        if (actualMultiplier > 0) {
          makePurchase();
          state.water -= actualMultiplier * waterCostPerLeaf;
        }
      } else if (state.type === "Moss") {
        if (actualMultiplier > 0) {
          makePurchase();
          state.roots += actualMultiplier; // For Moss, buying leaves also adds roots
        }
      } else {
        if (actualMultiplier > 0) {
          makePurchase();
        }
      }
    },

    autoGrowRoots: (
      state,
      action: PayloadAction<{ cost: number; multiplier: number }>
    ) => {
      if (state.sugar >= action.payload.cost) {
        state.sugar -= action.payload.cost;
        state.roots += action.payload.multiplier;
      }
    },

    autoGrowLeaves: (
      state,
      action: PayloadAction<{ cost: number; multiplier: number }>
    ) => {
      const totalCost = action.payload.cost;
      if (state.sugar >= totalCost) {
        if (state.type === "Succulent") {
          const waterCost = 100 * totalCost;
          if (state.water >= waterCost) {
            state.sugar -= totalCost;
            state.water -= waterCost;
            state.leaves += action.payload.multiplier;
          }
        } else if (state.type === "Moss") {
          state.sugar -= totalCost;
          state.leaves += action.payload.multiplier;
          state.roots += action.payload.multiplier;
        } else {
          state.sugar -= totalCost;
          state.leaves += action.payload.multiplier;
        }
      }
    },

    //Reducer to decrease leaves by payload
    removeLeaves: (state, action: PayloadAction<number>) => {
      state.leaves = Math.max(0, state.leaves - action.payload);
    },
    produceGeneticMarkers: (state, action: PayloadAction<number>) => {
      let neededResource = action.payload;

      // If the geneticMarkerUpgradeActive flag is true, quadruple the needed resources
      if (state.geneticMarkerUpgradeActive) {
        neededResource *= 4;
      }

      if (state.type === "Grass") {
        // Consume leaves for grass
        if (state.leaves >= neededResource) {
          state.leaves -= neededResource;
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
    deductSunlight: (state, action: PayloadAction<number>) => {
      const deductionAmount = action.payload;
      state.sunlight = Math.max(0, state.sunlight - deductionAmount);
    },
    deductWater: (state, action: PayloadAction<number>) => {
      const deductionAmount = action.payload;
      state.water = Math.max(0, state.water - deductionAmount);
    },
    increaseSugar: (state, action: PayloadAction<number>) => {
      const increaseAmount = action.payload;
      state.sugar += increaseAmount;
    },
    increaseRootRot: (state, action: PayloadAction<number>) => {
      state.rootRot += action.payload;
      if (state.rootRot > state.rootRotThreshold) {
        state.rootRot = state.rootRotThreshold;
      }
    },
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
    //Reducer to buy needles
    buyNeedles: (
      state,
      action: PayloadAction<{ cost: number; multiplier: number }>
    ) => {
      const totalCost = action.payload.cost * action.payload.multiplier;
      const affordableNeedles = Math.floor(state.sugar / action.payload.cost); // maximum affordable needles with current sugar

      const actualMultiplier = Math.min(
        affordableNeedles,
        action.payload.multiplier
      ); // take the smaller of the two

      state.sugar -= actualMultiplier * action.payload.cost;
      state.needles += actualMultiplier;
    },

    //Reducer to toggle leaf growth to the opposite of its current state
    toggleLeafGrowth: (state) => {
      state.leafGrowthToggle = !state.leafGrowthToggle;
    },
    //Reducer to toggle root growth to the opposite of its current state
    toggleRootGrowth: (state) => {
      state.rootGrowthToggle = !state.rootGrowthToggle;
    },
    setMaxResourceToSpend: (state, action: PayloadAction<number>) => {
      state.maxResourceToSpend = action.payload;
    },
    //Reducer to increase flower threshold by 1 %
    increaseFlowerThreshold: (state) => {
      console.log("increaseFlowerThreshold");
      state.flowerSugarThreshold *= 1.01;
      state.flowerWaterThreshold *= 1.01;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(buyFlower, buyFlowerReducer);
    builder.addCase(addWaterToFlower, addWaterToFlowerReducer);
    builder.addCase(addSugarToFlower, addSugarToFlowerReducer);
    builder.addCase(removeFlower, removeFlowerReducer);
    builder.addCase(addFlower, addFlowerReducer);
    builder.addMatcher(
      (action): action is PayloadAction<{ plant: PlantState }> =>
        action.type === "REPLACE_STATE",
      (state, action) => {
        if (action.payload.plant !== undefined) {
          return action.payload.plant;
        }
        return state;
      }
    );
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
  deductSunlight,
  increaseSugar,
  autoGrowLeaves,
  autoGrowRoots,
  deductWater,
  turnOffGeneticMarkerProduction,
  setMaxResourceToSpend,
  increaseFlowerThreshold,
  setPlantType,
} = plantSlice.actions;
export default plantSlice.reducer;
