import { time } from "console";
import { PlantState } from "./Slices/plantSlice";
import { PlantTimeState } from "./Slices/plantTimeSlice";
import {
  BASE_SUNLIGHT_CONSUMPTION,
  BASE_WATER_CONSUMPTION,
  MATURITY_SUGAR_PRODUCTION_MODIFIER,
  MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER,
  MATURITY_WATER_CONSUMPTION_MODIFIER,
  SUGAR_THRESHOLD,
} from "./constants";

export const getHalfAffordableRoots = (
  plant: PlantState,
  root_cost: number
) => {
  return Math.floor(plant.sugar / root_cost / 2);
};

export const getAffordableRoots = (plant: PlantState, root_cost: number) => {
  return Math.floor(plant.sugar / root_cost);
};

export const getAffordableLeaves = (plant: PlantState, leaf_cost: number) => {
  return Math.floor(plant.sugar / leaf_cost);
};

export const getAffordableLeavesSucculent = (
  plant: PlantState,
  leaf_cost: number
) => {
  const affordableFromSugar = Math.floor(plant.sugar / leaf_cost);
  const waterCostPerLeaf = 100 * leaf_cost;
  const affordableFromWater = Math.floor(plant.water / waterCostPerLeaf);

  return Math.min(affordableFromSugar, affordableFromWater);
};

export const getHalfAffordableLeaves = (
  plant: PlantState,
  leaf_cost: number
) => {
  return Math.floor(plant.sugar / leaf_cost / 2);
};

export const getHalfAffordableLeavesSucculent = (
  plant: PlantState,
  leaf_cost: number
) => {
  const affordableFromSugar = Math.floor(plant.sugar / leaf_cost);
  const waterCostPerLeaf = 100 * leaf_cost;
  const affordableFromWater = Math.floor(plant.water / waterCostPerLeaf);

  // Calculate the minimum of the two and then take half of it
  return Math.floor(Math.min(affordableFromSugar, affordableFromWater) / 2);
};

export const getHalfAffordableNeedles = (
  plant: PlantState,
  maturityLevelCostMultiplier: number
) => {
  const needleCost = maturityLevelCostMultiplier * 100; // Assuming this is the cost formula
  return Math.floor(plant.sugar / needleCost / 2);
};

export const getHalfAffordableFlowers = (
  plant: PlantState,
  flowerCost: number
) => {
  const halfAffordableAmount = Math.floor(plant.sugar / flowerCost / 2);
  return Math.min(halfAffordableAmount, 50); // Cap at 50 flowers
};

export const getDifficultyModifiedSunlightConsumption = (
  difficulty: number
) => {
  return BASE_SUNLIGHT_CONSUMPTION * difficulty;
};

export const getDifficultyModifiedWaterConsumption = (difficulty: number) => {
  return BASE_WATER_CONSUMPTION * difficulty;
};

export const isSugarConversionUnlocked = (
  plant: PlantState,
  difficulty: number
) =>
  plant.totalWaterAbsorbed >
    calculatePhotosynthesisSunlightConsumption(
      1,
      difficulty,
      plant.water_efficiency_multiplier
    ) &&
  plant.totalWaterAbsorbed >
    calculatePhotosynthesisWaterConsumption(
      1,
      difficulty,
      plant.sunlight_efficiency_multiplier
    );

export const isGeneticMarkerUpgradeUnlocked = (plant: PlantState) =>
  plant.totalSugarCreated > SUGAR_THRESHOLD;

export const isSugarUpgradesUnlocked = (plant: PlantState) =>
  plant.totalSugarCreated > 0;

export const getWaterModifier = (season: string, plantState: any) => {
  if (season === "Spring") {
    return plantState.springModifier;
  } else if (season === "Winter") {
    return plantState.winterModifier;
  }
  return 1;
};

export const getSunlightModifier = (season: string, plantState: any) => {
  if (season === "Summer") {
    return plantState.summerModifier;
  } else if (season === "Winter") {
    return plantState.winterModifier;
  }
  return 1;
};

export const getSugarModifier = (
  season: string,
  autumnModifier: number,
  winterModifier: number
) => {
  if (season === "Autumn") {
    return autumnModifier;
  } else if (season === "Winter") {
    return winterModifier;
  }
  return 1;
};

export const getSeasonModifier = (season: string, plantState: any) => {
  if (season === "Spring") {
    return { value: plantState.springModifier, resource: "water" };
  } else if (season === "Summer") {
    return { value: plantState.summerModifier, resource: "sunlight" };
  } else if (season === "Autumn") {
    return { value: plantState.autumnModifier, resource: "sugar" };
  } else if (season === "Winter") {
    return { value: plantState.winterModifier, resource: "all" }; // Assuming Winter uses water as well
  }
  return { value: 1, resource: "none" };
};

export const getNextSeason = (currentSeason: string): string => {
  switch (currentSeason) {
    case "Winter":
      return "Spring";
    case "Spring":
      return "Summer";
    case "Summer":
      return "Autumn";
    case "Autumn":
      return "Winter";
    default:
      return currentSeason;
  }
};

export const getTimeToNextSeason = (plantTime: {
  day: number;
  hour: number;
  update_counter: number;
}): { hours: number; minutes: number; seconds: number } => {
  const totalInGameMinutesLeft =
    (30 - plantTime.day) * 24 * 60 + // Days left
    (24 - plantTime.hour - 1) * 60 + // Hours left (-1 because we also account for the current hour)
    (60 - plantTime.update_counter); // Minutes left in the current hour

  const totalRealSecondsLeft = (totalInGameMinutesLeft * 1) / 5;

  const hours = Math.floor(totalRealSecondsLeft / 3600);
  const minutes = Math.floor((totalRealSecondsLeft % 3600) / 60);
  const seconds = Math.floor(totalRealSecondsLeft % 60);

  return { hours, minutes, seconds };
};

export const calculateModifiedRate = (
  baseRate: number,
  maturity_level: number,
  sugarModifier: number
) => {
  return (
    baseRate *
    (1 + MATURITY_SUGAR_PRODUCTION_MODIFIER * maturity_level) *
    sugarModifier
  );
};

export const calculatePhotosynthesisWaterConsumption = (
  maturity_level: number,
  difficulty: number,
  efficiency: number
) => {
  const modifiedWaterConsumption =
    getDifficultyModifiedWaterConsumption(difficulty);
  return (
    modifiedWaterConsumption *
    (1 + MATURITY_WATER_CONSUMPTION_MODIFIER * maturity_level) *
    efficiency
  );
};

export const calculatePhotosynthesisSunlightConsumption = (
  maturity_level: number,
  difficulty: number,
  efficiency: number
) => {
  const modifiedSunlightConsumption =
    getDifficultyModifiedSunlightConsumption(difficulty);
  return (
    modifiedSunlightConsumption *
    (1 + MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER * maturity_level) *
    efficiency
  );
};

export const calculateWaterDecrease = (
  leaves: number,
  leafWaterUsage: boolean
) => {
  return leafWaterUsage ? leaves : 0;
};

export const agaveSugarBonus = (agave: boolean) => {
  return agave ? 10 : 1;
};

export const calculateRootsWaterIncrease = (
  roots: number,
  water_absorption_multiplier: number
) => {
  return roots * water_absorption_multiplier;
};

export const calculateLeavesSunlightIncrease = (
  leaves: number,
  sunlight_absorption_multiplier: number
) => {
  return leaves * sunlight_absorption_multiplier;
};

export const calculateSeasonModifiedWaterIncrease = (
  rootsWaterIncrease: number,
  waterModifier: number
) => {
  return rootsWaterIncrease * waterModifier;
};

export const calculateSeasonModifiedSunlightIncrease = (
  leavesSunlightIncrease: number,
  sunlightModifier: number
) => {
  return leavesSunlightIncrease * sunlightModifier;
};

export const calculateLadybugsTaxWater = (
  ladybugs: number,
  seasonModifiedWaterIncrease: number
) => {
  return ladybugs * seasonModifiedWaterIncrease;
};

export const calculateLadybugsTaxSunlight = (
  ladybugs: number,
  seasonModifiedSunlightIncrease: number
) => {
  return ladybugs * seasonModifiedSunlightIncrease;
};

export const determinePhotosynthesisSugarProduction = (
  sugarProductionRate: number,
  maturity_level: number,
  season: string,
  autumnModifier: number,
  winterModifier: number,
  agaveBonus: boolean,
  resourceRatio: number,
  timeScale: number
) => {
  const sugarModifier = getSugarModifier(
    season,
    autumnModifier,
    winterModifier
  );
  const modifiedRate =
    sugarProductionRate *
    (1 + MATURITY_SUGAR_PRODUCTION_MODIFIER * maturity_level);

  const agaveMultiplier = agaveSugarBonus(agaveBonus);

  // Adjusting resourceRatio by multiplying it with timeScale
  const adjustedResourceRatio = resourceRatio * timeScale;

  return modifiedRate * sugarModifier * agaveMultiplier * adjustedResourceRatio;
};

export const geneticSugarConsumption = (plantState: any): number => {
  const costMultiplier = plantState.geneticMarkerUpgradeActive ? 4 : 1;
  return SUGAR_THRESHOLD * costMultiplier;
};

export const calculateWaterAndSunlight = (
  plantState: any,
  season: string,
  timeScale: number
) => {
  const waterModifier = getWaterModifier(season, plantState);
  const sunlightModifier = getSunlightModifier(season, plantState);

  const waterDecrease =
    calculateWaterDecrease(plantState.leaves, plantState.leafWaterUsage) *
    timeScale; // Adjusted for timeScale
  const rootsWaterIncrease =
    calculateRootsWaterIncrease(
      plantState.roots,
      plantState.water_absorption_multiplier
    ) * timeScale; // Adjusted for timeScale
  const leavesSunlightIncrease =
    calculateLeavesSunlightIncrease(
      plantState.leaves,
      plantState.sunlight_absorption_multiplier
    ) * timeScale; // Adjusted for timeScale

  const seasonModifiedWaterIncrease = calculateSeasonModifiedWaterIncrease(
    rootsWaterIncrease,
    waterModifier
  );
  const seasonModifiedSunlightIncrease =
    calculateSeasonModifiedSunlightIncrease(
      leavesSunlightIncrease,
      sunlightModifier
    );

  const ladybugsTaxWater = calculateLadybugsTaxWater(
    plantState.ladybugs,
    seasonModifiedWaterIncrease
  );
  const ladybugsTaxSunlight = calculateLadybugsTaxSunlight(
    plantState.ladybugs,
    seasonModifiedSunlightIncrease
  );

  return {
    water: Math.max(0, plantState.water + ladybugsTaxWater - waterDecrease),
    totalWaterAbsorbed: plantState.totalWaterAbsorbed + ladybugsTaxWater,
    sunlight: plantState.sunlight + ladybugsTaxSunlight,
    totalSunlightAbsorbed:
      plantState.totalSunlightAbsorbed + ladybugsTaxSunlight,
  };
};

export const calculateSugarPhotosynthesis = (
  plantState: any,
  season: string,
  difficulty: number,
  timeScale: number
) => {
  const sugarProductionRate = plantState.sugar_production_rate;

  // Calculate potential water and sunlight needed based on timeScale
  const potentialWaterNeeded =
    calculatePhotosynthesisWaterConsumption(
      plantState.maturity_level,
      difficulty,
      plantState.water_efficiency_multiplier
    ) * timeScale;

  const potentialSunlightNeeded =
    calculatePhotosynthesisSunlightConsumption(
      plantState.maturity_level,
      difficulty,
      plantState.sunlight_efficiency_multiplier
    ) * timeScale;

  // Minimum resources needed for any photosynthesis to occur
  const lowestPossibleWaterNeeded = calculatePhotosynthesisWaterConsumption(
    plantState.maturity_level,
    difficulty,
    plantState.water_efficiency_multiplier
  );

  const lowestPossibleSunlightNeeded =
    calculatePhotosynthesisSunlightConsumption(
      plantState.maturity_level,
      difficulty,
      plantState.sunlight_efficiency_multiplier
    );

  // Check if the plant has at least the minimum resources needed
  if (
    plantState.water >= lowestPossibleWaterNeeded &&
    plantState.sunlight >= lowestPossibleSunlightNeeded
  ) {
    // Calculate the individual ratios of available to needed resources
    const waterRatio = plantState.water / potentialWaterNeeded;
    const sunlightRatio = plantState.sunlight / potentialSunlightNeeded;

    // Determine the limiting resource ratio
    const limitingRatio = Math.min(1, Math.min(waterRatio, sunlightRatio));

    // Assuming that sugar production is linearly related to the limiting resource ratio
    const sugarsProduced = determinePhotosynthesisSugarProduction(
      sugarProductionRate,
      plantState.maturity_level,
      season,
      plantState.autumnModifier,
      plantState.winterModifier,
      plantState.agaveSugarBonus,
      limitingRatio,
      timeScale
    );

    // Calculate the actual amounts of resources consumed based on the limiting resource
    const actualWaterConsumed = potentialWaterNeeded * limitingRatio;
    const actualSunlightConsumed = potentialSunlightNeeded * limitingRatio;

    // Subtract the actual resources consumed
    return {
      sugarsProduced,
      sugar: plantState.sugar + sugarsProduced,
      totalSugarCreated: plantState.totalSugarCreated + sugarsProduced,
      water: plantState.water - actualWaterConsumed,
      sunlight: plantState.sunlight - actualSunlightConsumed,
    };
  } else {
    // If the plant doesn't have the minimum resources needed, no photosynthesis occurs
    return {
      sugarsProduced: 0,
      sugar: plantState.sugar,
      totalSugarCreated: plantState.totalSugarCreated,
      water: plantState.water,
      sunlight: plantState.sunlight,
    };
  }
};

export const itemizedReport = (
  plantState: any,
  season: string,
  difficulty: number,
  timeScale: number
) => {
  // Sugar Production
  const sugarsProducedDetails = calculateSugarPhotosynthesis(
    plantState,
    season,
    difficulty,
    timeScale
  );

  const totalFlowerWaterConsumption =
    plantState.flowers.length * plantState.flowerWaterConsumptionRate || 0;

  // Water and Sunlight Changes
  const waterAndSunlightDetails = calculateWaterAndSunlight(
    plantState,
    season,
    timeScale
  );

  // Photosynthesis Water and Sunlight Consumption
  const photosynthesisWaterConsumption = plantState.is_sugar_production_on
    ? calculatePhotosynthesisWaterConsumption(
        plantState.maturity_level,
        difficulty,
        plantState.water_efficiency_multiplier
      )
    : 0;
  const photosynthesisSunlightConsumption = plantState.is_sugar_production_on
    ? calculatePhotosynthesisSunlightConsumption(
        plantState.maturity_level,
        difficulty,
        plantState.sunlight_efficiency_multiplier
      )
    : 0;

  const waterDecrease = calculateWaterDecrease(
    plantState.leaves,
    plantState.leafWaterUsage
  );

  const netWaterProduction =
    calculateLadybugsTaxWater(
      plantState.ladybugs,
      calculateSeasonModifiedWaterIncrease(
        calculateRootsWaterIncrease(
          plantState.roots,
          plantState.water_absorption_multiplier
        ),
        getWaterModifier(season, plantState)
      )
    ) -
    photosynthesisWaterConsumption -
    waterDecrease -
    totalFlowerWaterConsumption;

  const netWaterProductionBeforeSugar =
    calculateLadybugsTaxWater(
      plantState.ladybugs,
      calculateSeasonModifiedWaterIncrease(
        calculateRootsWaterIncrease(
          plantState.roots,
          plantState.water_absorption_multiplier
        ),
        getWaterModifier(season, plantState)
      )
    ) - waterDecrease;

  const netSunlightProduction =
    calculateLadybugsTaxSunlight(
      plantState.ladybugs,
      calculateSeasonModifiedSunlightIncrease(
        calculateLeavesSunlightIncrease(
          plantState.leaves,
          plantState.sunlight_absorption_multiplier
        ),
        getSunlightModifier(season, plantState)
      )
    ) - photosynthesisSunlightConsumption;

  const netSunlightProductionBeforeSugar = calculateLadybugsTaxSunlight(
    plantState.ladybugs,
    calculateSeasonModifiedSunlightIncrease(
      calculateLeavesSunlightIncrease(
        plantState.leaves,
        plantState.sunlight_absorption_multiplier
      ),
      getSunlightModifier(season, plantState)
    )
  );

  // Compute base water and sunlight increase without seasonal modifiers
  const baseWaterIncrease = calculateRootsWaterIncrease(
    plantState.roots,
    plantState.water_absorption_multiplier
  );

  const baseSunlightIncrease = calculateLeavesSunlightIncrease(
    plantState.leaves,
    plantState.sunlight_absorption_multiplier
  );

  // Define the types for season-specific calculations
  type SeasonalIncreases = {
    [key: string]: number;
  };

  let seasonSpecificWaterIncreases: SeasonalIncreases = {};
  let seasonSpecificSunlightIncreases: SeasonalIncreases = {};

  const seasons: string[] = ["Spring", "Summer", "Autumn", "Winter"];

  seasons.forEach((seasonName) => {
    seasonSpecificWaterIncreases[seasonName] =
      calculateSeasonModifiedWaterIncrease(
        baseWaterIncrease,
        getWaterModifier(seasonName, plantState)
      );

    seasonSpecificSunlightIncreases[seasonName] =
      calculateSeasonModifiedSunlightIncrease(
        baseSunlightIncrease,
        getSunlightModifier(seasonName, plantState)
      );
  });

  // Itemized breakdown
  const report = {
    sugar: {
      productionRate: plantState.sugar_production_rate,
      sugarsProduced: sugarsProducedDetails.sugarsProduced,
      totalSugar: sugarsProducedDetails.sugar,
      totalSugarCreated: sugarsProducedDetails.totalSugarCreated,
    },
    water: {
      waterDecrease: calculateWaterDecrease(
        plantState.leaves,
        plantState.leafWaterUsage
      ),
      rootsWaterIncrease: calculateRootsWaterIncrease(
        plantState.roots,
        plantState.water_absorption_multiplier
      ),
      baseWaterIncrease: baseWaterIncrease,
      currentSeasonModifiedWaterIncrease: calculateSeasonModifiedWaterIncrease(
        baseWaterIncrease,
        getWaterModifier(season, plantState)
      ),
      seasonSpecificWaterIncreases: seasonSpecificWaterIncreases,
      ladybugsTaxWater: calculateLadybugsTaxWater(
        plantState.ladybugs,
        calculateSeasonModifiedWaterIncrease(
          calculateRootsWaterIncrease(
            plantState.roots,
            plantState.water_absorption_multiplier
          ),
          getWaterModifier(season, plantState)
        )
      ),
      totalWater: waterAndSunlightDetails.water,
      totalWaterAbsorbed: waterAndSunlightDetails.totalWaterAbsorbed,
      photosynthesisWaterConsumption: photosynthesisWaterConsumption,
      netWaterProductionBeforeSugar: netWaterProductionBeforeSugar,
      netWaterProduction: netWaterProduction,
    },
    sunlight: {
      leavesSunlightIncrease: calculateLeavesSunlightIncrease(
        plantState.leaves,
        plantState.sunlight_absorption_multiplier
      ),
      baseSunlightIncrease: baseSunlightIncrease,
      currentSeasonModifiedSunlightIncrease:
        calculateSeasonModifiedSunlightIncrease(
          baseSunlightIncrease,
          getSunlightModifier(season, plantState)
        ),
      seasonSpecificSunlightIncreases: seasonSpecificSunlightIncreases,
      ladybugsTaxSunlight: calculateLadybugsTaxSunlight(
        plantState.ladybugs,
        calculateSeasonModifiedSunlightIncrease(
          calculateLeavesSunlightIncrease(
            plantState.leaves,
            plantState.sunlight_absorption_multiplier
          ),
          getSunlightModifier(season, plantState)
        )
      ),
      totalSunlight: waterAndSunlightDetails.sunlight,
      totalSunlightAbsorbed: waterAndSunlightDetails.totalSunlightAbsorbed,
      photosynthesisSunlightConsumption: photosynthesisSunlightConsumption,
      netSunlightProductionBeforeSugar: netSunlightProductionBeforeSugar,
      netSunlightProduction: netSunlightProduction,
    },
  };

  return report;
};

export const calculateActualSugarProductionPerMinute = (
  plant: PlantState,
  report: any,
  plantTime: PlantTimeState,
  difficulty: number
) => {
  // Get the required resources for sugar production per second
  const requiredWaterPerSecond = calculatePhotosynthesisWaterConsumption(
    plant.maturity_level,
    difficulty,
    plant.water_efficiency_multiplier
  );
  const requiredSunlightPerSecond = calculatePhotosynthesisSunlightConsumption(
    plant.maturity_level,
    difficulty,
    plant.sunlight_efficiency_multiplier
  );

  // Calculate total sugar consumed by flowers per minute
  const totalFlowerSugarConsumptionPerMinute =
    plant.flowers.length * plant.flowerSugarConsumptionRate * 60 || 0;

  // Determine the actual sugar production per second without considering reserves
  const actualSugarProductionPerSecond = determinePhotosynthesisSugarProduction(
    plant.sugar_production_rate,
    plant.maturity_level,
    plantTime.season,
    plant.autumnModifier,
    plant.winterModifier,
    plant.agaveSugarBonus,
    1,
    1
  );

  // Calculate sugar production per minute, considering flower consumption
  const sugarProduction = Math.max(
    0,
    actualSugarProductionPerSecond * 60 - totalFlowerSugarConsumptionPerMinute
  );

  // Determine if using reserves. This is true if either water or sunlight is less than required
  // but there are enough reserves to maintain sugar production for at least a minute.
  const usingReserves =
    (report.water.netWaterProductionBeforeSugar < requiredWaterPerSecond ||
      report.sunlight.netSunlightProductionBeforeSugar <
        requiredSunlightPerSecond) &&
    (plant.water >= requiredWaterPerSecond * 1 ||
      plant.sunlight >= requiredSunlightPerSecond * 1);

  // If there are not enough reserves to maintain production for a minute, production is zero
  if (
    plant.water < requiredWaterPerSecond * 1 ||
    plant.sunlight < requiredSunlightPerSecond * 1
  ) {
    return { sugarProduction: 0, usingReserves: false };
  }

  // Return the sugar production and the reserve usage status
  return { sugarProduction, usingReserves };
};
