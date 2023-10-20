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

export const isSugarConversionUnlocked = (plant: PlantState) =>
  plant.totalWaterAbsorbed > calculatePhotosynthesisSunlightConsumption(1) &&
  plant.totalWaterAbsorbed > calculatePhotosynthesisWaterConsumption(1);

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
}): { minutes: number; seconds: number } => {
  // Calculate total minutes left for the current season.
  const totalInGameMinutesLeft =
    (30 - plantTime.day) * 24 * 60 + // Days left
    (24 - plantTime.hour - 1) * 60 + // Hours left (-1 because we also account for the current hour)
    (60 - plantTime.update_counter); // Minutes left in the current hour

  // Convert in-game minutes to real-world seconds.
  const totalRealSecondsLeft = (totalInGameMinutesLeft * 1) / 5; // 5 in-game minutes is 1 real-world second

  // Convert the total real-world seconds to minutes and seconds.
  const minutes = Math.floor(totalRealSecondsLeft / 60);
  const seconds = Math.floor(totalRealSecondsLeft % 60);

  return { minutes, seconds };
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
  maturity_level: number
) => {
  return (
    BASE_WATER_CONSUMPTION *
    (1 + MATURITY_WATER_CONSUMPTION_MODIFIER * maturity_level)
  );
};

export const calculatePhotosynthesisSunlightConsumption = (
  maturity_level: number
) => {
  return (
    BASE_SUNLIGHT_CONSUMPTION *
    (1 + MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER * maturity_level)
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
  agaveBonus: boolean
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
  return modifiedRate * sugarModifier * agaveMultiplier;
};

export const geneticSugarConsumption = (plantState: any): number => {
  const costMultiplier = plantState.geneticMarkerUpgradeActive ? 4 : 1;
  return SUGAR_THRESHOLD * costMultiplier;
};

export const calculateWaterAndSunlight = (plantState: any, season: string) => {
  const waterModifier = getWaterModifier(season, plantState);
  const sunlightModifier = getSunlightModifier(season, plantState);

  const waterDecrease = calculateWaterDecrease(
    plantState.leaves,
    plantState.leafWaterUsage
  );
  const rootsWaterIncrease = calculateRootsWaterIncrease(
    plantState.roots,
    plantState.water_absorption_multiplier
  );
  const leavesSunlightIncrease = calculateLeavesSunlightIncrease(
    plantState.leaves,
    plantState.sunlight_absorption_multiplier
  );

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
  season: string
) => {
  const sugarProductionRate = plantState.sugar_production_rate;

  const waterNeeded = calculatePhotosynthesisWaterConsumption(
    plantState.maturity_level
  );
  const sunlightNeeded = calculatePhotosynthesisSunlightConsumption(
    plantState.maturity_level
  );

  if (
    plantState.water >= waterNeeded &&
    plantState.sunlight >= sunlightNeeded
  ) {
    let sugarsProduced = determinePhotosynthesisSugarProduction(
      sugarProductionRate,
      plantState.maturity_level,
      season,
      plantState.autumnModifier,
      plantState.winterModifier,
      plantState.agaveSugarBonus
    );

    return {
      sugarsProduced,
      sugar: plantState.sugar + sugarsProduced,
      totalSugarCreated: plantState.totalSugarCreated + sugarsProduced,
      water: plantState.water - waterNeeded,
      sunlight: plantState.sunlight - sunlightNeeded,
    };
  } else {
    return {
      sugarsProduced: 0,
      sugar: plantState.sugar,
      totalSugarCreated: plantState.totalSugarCreated,
      water: plantState.water,
      sunlight: plantState.sunlight,
    };
  }
};

export const itemizedReport = (plantState: any, season: string) => {
  // Sugar Production
  const sugarsProducedDetails = calculateSugarPhotosynthesis(
    plantState,
    season
  );

  // Water and Sunlight Changes
  const waterAndSunlightDetails = calculateWaterAndSunlight(plantState, season);

  // Photosynthesis Water and Sunlight Consumption
  const photosynthesisWaterConsumption = plantState.is_sugar_production_on
    ? calculatePhotosynthesisWaterConsumption(plantState.maturity_level)
    : 0;
  const photosynthesisSunlightConsumption = plantState.is_sugar_production_on
    ? calculatePhotosynthesisSunlightConsumption(plantState.maturity_level)
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
    waterDecrease;

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
      seasonModifiedWaterIncrease: calculateSeasonModifiedWaterIncrease(
        calculateRootsWaterIncrease(
          plantState.roots,
          plantState.water_absorption_multiplier
        ),
        getWaterModifier(season, plantState)
      ),
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
      seasonModifiedSunlightIncrease: calculateSeasonModifiedSunlightIncrease(
        calculateLeavesSunlightIncrease(
          plantState.leaves,
          plantState.sunlight_absorption_multiplier
        ),
        getSunlightModifier(season, plantState)
      ),
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
  plantTime: PlantTimeState
) => {
  // Get the limiting resource
  const limitingResourcePerSecond = Math.min(
    report.water.netWaterProductionBeforeSugar,
    report.sunlight.netSunlightProductionBeforeSugar
  );

  // Get the required resources for sugar production
  const requiredWaterPerSecond = calculatePhotosynthesisWaterConsumption(
    plant.maturity_level
  );
  const requiredSunlightPerSecond = calculatePhotosynthesisSunlightConsumption(
    plant.maturity_level
  );

  // Determine the percentage of available limiting resource in terms of requirement
  const limitingResourcePercentage =
    limitingResourcePerSecond /
    Math.min(requiredWaterPerSecond, requiredSunlightPerSecond);

  // Determine the actual sugar production per second
  const actualSugarProductionPerSecond =
    determinePhotosynthesisSugarProduction(
      plant.sugar_production_rate,
      plant.maturity_level,
      plantTime.season,
      plant.autumnModifier,
      plant.winterModifier,
      plant.agaveSugarBonus
    ) * limitingResourcePercentage;

  // Convert to per minute
  return Math.max(0, actualSugarProductionPerSecond * 60);
};
