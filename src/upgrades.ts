// upgrades.ts

import { PlantState } from "./Slices/plantSlice";

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export const UPGRADES: Record<string, Upgrade[]> = {
  Meta: [
    {
      id: "Moss_leaf_bonus",
      name: "Absorbent Leaves (All Species)",
      description:
        "Leaves are water neutral and no longer lost due to dehydration.",
      cost: 10,
    },
    // ... other meta progression traits
  ],
  Fern: [
    {
      id: "boost_sugar",
      name: "Cam Pathway",
      description: "Increase base sugar production by 50%",
      cost: 1,
    },
    {
      id: "boost_sunlight_absorption",
      name: "Trichomes",
      description: "Increase manual sunlight absorption by 50%",
      cost: 1,
    },
    {
      id: "boost_water_absorption",
      name: "Aquaporins",
      description: "Increase manual water absorption by 50%",
      cost: 1,
    },
    {
      id: "boost_sunlight_multiplier",
      name: "Heliotropism",
      description: "Increase passive sunlight absorption efficiency by 20%",
      cost: 3,
    },
    {
      id: "boost_water_multiplier",
      name: "Root Hairs",
      description: "Increase passive water absorption efficiency by 20%",
      cost: 3,
    },
    {
      id: "boost_sunlight_efficiency_multiplier",
      name: "Extra Chlorophyll",
      description: "Reduce the base sunlight to sugar ratio by 10%",
      cost: 7,
    },
    {
      id: "boost_water_efficiency_multiplier",
      name: "Stomatal Regulation",
      description: "Reduce the base water to sugar ratio by 10%",
      cost: 7,
    },
    {
      id: "boost_sugar_tier_2",
      name: "Cam Pathway Tier 2",
      description: "Increase base sugar production by 100%",
      cost: 10,
    },
    {
      id: "boost_sunlight_absorption_tier_2",
      name: "Trichomes Tier 2",
      description: "Increase manual sunlight absorption by 100%",
      cost: 10,
    },
    {
      id: "toggle_genetic_marker_upgrade",
      name: "Nutrient Recycling",
      description:
        "Double the rate of genetic marker production, and quadruple the sugar cost",
      cost: 10,
    },
    {
      id: "boost_water_absorption_tier_2",
      name: "Aquaporins Tier 2",
      description: "Increase manual water absorption by 100%",
      cost: 10,
    },
    {
      id: "boost_sunlight_multiplier_tier_2",
      name: "Heliotropism Tier 2",
      description: "Increase passive sunlight absorption efficiency by 40%",
      cost: 20,
    },
    {
      id: "boost_water_multiplier_tier_2",
      name: "Root Hairs Tier 2",
      description: "Increase passive water absorption efficiency by 40%",
      cost: 20,
    },
    {
      id: "boost_sunlight_efficiency_multiplier_tier_2",
      name: "Extra Chlorophyll Tier 2",
      description: "Reduce the base sunlight to sugar ratio by 20%",
      cost: 50,
    },
    {
      id: "boost_water_efficiency_multiplier_tier_2",
      name: "Stomatal Regulation Tier 2",
      description: "Reduce the base water to sugar ratio by 20%",
      cost: 50,
    },
    {
      id: "increase_root_rot_threshold",
      name: "Symboisis",
      description: "Increase the root rot threshold by 100%",
      cost: 100,
    },
    {
      id: "bloom",
      name: "Spring Bloom",
      description: "Double Spring Bonus",
      cost: 250,
    },
    {
      id: "thermophilic",
      name: "Thermophilic",
      description: "Double Summer Bonus",
      cost: 250,
    },
    {
      id: "bountiful_harvest",
      name: "Bountiful Harvest",
      description: "Double Autumn Bonus",
      cost: 500,
    },
    {
      id: "coniferous",
      name: "Coniferous",
      description: "Reduce Winter penalty by 50%",
      cost: 1000,
    },
  ],
  Moss: [
    {
      id: "bromeliad",
      name: "Bromeliad",
      description: "Doubles the amount of sunlight absorbed by Moss",
      cost: 1,
    },
  ],
};

export const UPGRADE_FUNCTIONS: Record<
  string,
  { [key: string]: (plant: PlantState) => void }
> = {
  Meta: {
    moss_leaf_bonus: (plant) => {
      plant.leafWaterUsage = false;
    },
  },
  Fern: {
    boost_sugar: (plant) => {
      plant.sugar_production_rate *= 1.5;
    },
    boost_sunlight_absorption: (plant) => {
      plant.sunlight_absorption_rate *= 1.5;
    },
    boost_water_absorption: (plant) => {
      plant.water_absorption_rate *= 1.5;
    },
    boost_sunlight_multiplier: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.2;
    },
    boost_water_multiplier: (plant) => {
      plant.water_absorption_multiplier *= 1.2;
    },
    boost_sunlight_efficiency_multiplier: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.9;
    },
    boost_water_efficiency_multiplier: (plant) => {
      plant.water_efficiency_multiplier *= 0.9;
    },
    boost_sugar_tier_2: (plant) => {
      plant.sugar_production_rate *= 2;
    },
    boost_sunlight_absorption_tier_2: (plant) => {
      plant.sunlight_absorption_rate *= 2;
    },
    boost_water_absorption_tier_2: (plant) => {
      plant.water_absorption_rate *= 2;
    },
    boost_sunlight_multiplier_tier_2: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.4;
    },
    boost_water_multiplier_tier_2: (plant) => {
      plant.water_absorption_multiplier *= 1.4;
    },
    boost_sunlight_efficiency_multiplier_tier_2: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.8;
    },
    boost_water_efficiency_multiplier_tier_2: (plant) => {
      plant.water_efficiency_multiplier *= 0.8;
    },
    toggle_genetic_marker_upgrade: (plant) => {
      plant.geneticMarkerUpgradeActive = !plant.geneticMarkerUpgradeActive;
    },
    increase_root_rot_threshold: (plant) => {
      plant.rootRotThreshold *= 2;
    },
    bloom: (plant) => {
      plant.springModifier *= 2;
    },
    thermophilic: (plant) => {
      plant.summerModifier *= 2;
    },
    bountiful_harvest: (plant) => {
      plant.autumnModifier *= 2;
    },
    coniferous: (plant) => {
      plant.winterModifier *= 2;
    },
  },
  Moss: {
    bromeliad: (plant) => {
      plant.sunlight_absorption_multiplier *= 2;
    },
  },
  // ... other upgrade functions
};
