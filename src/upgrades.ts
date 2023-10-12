// upgrades.ts

import { PlantState } from "./plantSlice";

export type Upgrade = {
    id: string;
    name: string;
    description: string;
    cost: number;
  };
  
  export const UPGRADES: Upgrade[] = [
    {
      id: 'boost_sugar',
      name: 'Sugar Boost',
      description: 'Increase base sugar production by 50%',
      cost: 1,
    },
    {
        id: 'boost_sunlight_absorption',
        name: 'Sunlight Absorption Boost',
        description: 'Increase manual sunlight absorption by 50%',
        cost: 1,
      },
      {
        id: 'boost_water_absorption',
        name: 'Water Absorption Boost',
        description: 'Increase manual water absorption by 50%',
        cost: 1,
      },
      {
        id: 'boost_sunlight_multiplier',
        name: 'Efficient Leaves',
        description: 'Increase passive sunlight absorption efficiency by 20%',
        cost: 3,
    },
    {
        id: 'boost_water_multiplier',
        name: 'Efficient Roots',
        description: 'Increase passive water absorption efficiency by 20%',
        cost: 3,
    },
    {
        id: 'boost_sunlight_efficiency_multiplier',
        name: 'Efficient Leaves',
        description: 'Reduce the base sunlight to sugar ratio by 10%',
        cost: 7,
    },
    {
        id: 'boost_water_efficiency_multiplier',
        name: 'Efficient Roots',
        description: 'Reduce the base water to sugar ratio by 10%',
        cost: 7,
    },
    {
        id: 'boost_sugar_tier_2',
        name: 'Sugar Boost Tier 2',
        description: 'Increase base sugar production by 100%',
        cost: 10,
    },
    {
        id: 'boost_sunlight_absorption_tier_2',
        name: 'Sunlight Absorption Boost Tier 2',
        description: 'Increase manual sunlight absorption by 100%',
        cost: 10,
    },
    {
        id: 'toggle_genetic_marker_upgrade',
        name: 'Turbo DNA',
        description: 'Double the rate of genetic marker production, and quadruple the sugar cost',
        cost: 10,
    },
    {
        id: 'boost_water_absorption_tier_2',
        name: 'Water Absorption Boost Tier 2',
        description: 'Increase manual water absorption by 100%',
        cost: 10,
    },
    {
        id: 'boost_sunlight_multiplier_tier_2',
        name: 'Efficient Leaves Tier 2',
        description: 'Increase passive sunlight absorption efficiency by 40%',
        cost: 20,
    },
    {
        id: 'boost_water_multiplier_tier_2',
        name: 'Efficient Roots Tier 2',
        description: 'Increase passive water absorption efficiency by 40%',
        cost: 20,
    },
    {
        id: 'boost_sunlight_efficiency_multiplier_tier_2',
        name: 'Efficient Leaves Tier 2',
        description: 'Reduce the base sunlight to sugar ratio by 20%',
        cost: 50,
    },
    {
        id: 'boost_water_efficiency_multiplier_tier_2',
        name: 'Efficient Roots Tier 2',
        description: 'Reduce the base water to sugar ratio by 20%',
        cost: 50,
    },
    // ... other upgrades
  ];
  
  export const UPGRADE_FUNCTIONS: { [key: string]: (plant: PlantState) => void } = {
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

    
    // ... other upgrade functions
  };
  