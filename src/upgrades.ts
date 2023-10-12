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
    }
    
    // ... other upgrade functions
  };
  