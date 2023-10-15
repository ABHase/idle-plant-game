import {
  BASE_SUNLIGHT_CONSUMPTION,
  BASE_WATER_CONSUMPTION,
  MATURITY_SUGAR_PRODUCTION_MODIFIER,
  MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER,
  MATURITY_WATER_CONSUMPTION_MODIFIER,
  SUGAR_THRESHOLD,
} from "./constants";

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
  winterModifier: number
) => {
  const sugarModifier = getSugarModifier(
    season,
    autumnModifier,
    winterModifier
  );
  const modifiedRate =
    sugarProductionRate *
    (1 + MATURITY_SUGAR_PRODUCTION_MODIFIER * maturity_level);
  return modifiedRate * sugarModifier;
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
  const sugarProductionRate = plantState.sugar_production_rate; // Corrected this line

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
    const sugarsProduced = determinePhotosynthesisSugarProduction(
      sugarProductionRate,
      plantState.maturity_level,
      season,
      plantState.autumnModifier, // Assuming this is in plantState, modify if needed
      plantState.winterModifier // Assuming this is in plantState, modify if needed
    );

    return {
      sugarsProduced, // Corrected this line
      sugar: plantState.sugar + sugarsProduced,
      totalSugarCreated: plantState.totalSugarCreated + sugarsProduced,
      water: plantState.water - waterNeeded,
      sunlight: plantState.sunlight - sunlightNeeded,
    };
  } else {
    return {
      sugarsProduced: 0, // Corrected this line
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
      netSunlightProduction: netSunlightProduction,
    },
  };

  return report;
};
