import { PlantState } from "./Slices/plantSlice";
import { v4 as uuidv4 } from "uuid";

export const FERN_INITIAL_CONFIG: PlantState = {
  id: uuidv4(), // Will be overridden when initialized
  maturity_level: 1,
  type: "Fern",
  sugar_production_rate: 1,
  genetic_marker_production_rate: 1,
  is_sugar_production_on: false,
  is_genetic_marker_production_on: false,
  is_secondary_resource_production_on: false,
  sunlight: 0,
  sunlight_absorption_rate: 10,
  water: 1,
  water_absorption_rate: 10,
  sunlight_efficiency_multiplier: 1,
  water_efficiency_multiplier: 1,
  sunlight_absorption_multiplier: 1,
  water_absorption_multiplier: 1,
  sugar: 0,
  ladybugs: 1,
  ladybugTax: 0.5,
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
  aphids: 0,
  leafWaterUsage: true,
  agaveSugarBonus: false,
  needles: 0,
  needleProtection: 1,
  rabbitAttack: false,
  grassGrowthToggle: false,
  leafGrowthToggle: false,
  leafAutoGrowthMultiplier: 5,
  rootGrowthToggle: false,
  rootAutoGrowthMultiplier: 5,
};

export const MOSS_INITIAL_CONFIG: PlantState = {
  id: uuidv4(), // Will be overridden when initialized
  maturity_level: 1,
  type: "Moss",
  sugar_production_rate: 0.1,
  genetic_marker_production_rate: 1,
  is_sugar_production_on: false,
  is_genetic_marker_production_on: false,
  is_secondary_resource_production_on: false,
  sunlight: 0,
  sunlight_absorption_rate: 1,
  water: 1,
  water_absorption_rate: 1,
  sunlight_efficiency_multiplier: 2,
  water_efficiency_multiplier: 2,
  sunlight_absorption_multiplier: 0.1,
  water_absorption_multiplier: 0.1,
  sugar: 0,
  ladybugs: 1,
  ladybugTax: 0.5,
  roots: 5,
  leaves: 5,
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
  winterModifier: 1,
  aphids: 0,
  leafWaterUsage: false,
  agaveSugarBonus: false,
  needles: 0,
  needleProtection: 1,
  rabbitAttack: false,
  grassGrowthToggle: false,
  leafGrowthToggle: false,
  leafAutoGrowthMultiplier: 5,
  rootGrowthToggle: false,
  rootAutoGrowthMultiplier: 5,
};

export const SUCCULENT_INITIAL_CONFIG: PlantState = {
  id: uuidv4(), // Will be overridden when initialized
  maturity_level: 1,
  type: "Succulent",
  sugar_production_rate: 5,
  genetic_marker_production_rate: 1,
  is_sugar_production_on: false,
  is_genetic_marker_production_on: false,
  is_secondary_resource_production_on: false,
  sunlight: 0,
  sunlight_absorption_rate: 10,
  water: 1,
  water_absorption_rate: 1,
  sunlight_efficiency_multiplier: 1,
  water_efficiency_multiplier: 1,
  sunlight_absorption_multiplier: 2,
  water_absorption_multiplier: 0.1,
  sugar: 0,
  ladybugs: 1,
  ladybugTax: 0.5,
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
  aphids: 0,
  leafWaterUsage: true,
  agaveSugarBonus: true,
  needles: 1,
  needleProtection: 1,
  rabbitAttack: false,
  grassGrowthToggle: false,
  leafGrowthToggle: false,
  leafAutoGrowthMultiplier: 5,
  rootGrowthToggle: false,
  rootAutoGrowthMultiplier: 5,
};

export const GRASS_INITIAL_CONFIG: PlantState = {
  id: uuidv4(), // Will be overridden when initialized
  maturity_level: 1,
  type: "Grass",
  sugar_production_rate: 1,
  genetic_marker_production_rate: 1,
  is_sugar_production_on: false,
  is_genetic_marker_production_on: false,
  is_secondary_resource_production_on: false,
  sunlight: 0,
  sunlight_absorption_rate: 10,
  water: 1,
  water_absorption_rate: 10,
  sunlight_efficiency_multiplier: 1,
  water_efficiency_multiplier: 1,
  sunlight_absorption_multiplier: 1,
  water_absorption_multiplier: 1,
  sugar: 0,
  ladybugs: 1,
  ladybugTax: 0.5,
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
  aphids: 0,
  leafWaterUsage: true,
  agaveSugarBonus: false,
  needles: 0,
  needleProtection: 1,
  rabbitAttack: false,
  grassGrowthToggle: true,
  leafGrowthToggle: true,
  leafAutoGrowthMultiplier: 5,
  rootGrowthToggle: false,
  rootAutoGrowthMultiplier: 5,
};

export const PLANT_CONFIGS: Record<string, PlantState> = {
  Fern: FERN_INITIAL_CONFIG,
  Moss: MOSS_INITIAL_CONFIG,
  Succulent: SUCCULENT_INITIAL_CONFIG,
  Grass: GRASS_INITIAL_CONFIG,
};
