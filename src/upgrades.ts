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
      description: 'Increase sugar production by 50%',
      cost: 1,
    },
    // ... other upgrades
  ];
  
  export const UPGRADE_FUNCTIONS: { [key: string]: (plant: PlantState) => void } = {
    boost_sugar: (plant) => {
      plant.sugar_production_rate *= 1.5;
    },
    // ... other upgrade functions
  };
  