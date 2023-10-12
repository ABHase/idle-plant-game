import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlantState } from './plantSlice';  // Import this for typing
import { UPGRADES } from './upgrades';

type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export interface UpgradesState {
  available: Upgrade[];
  purchased: string[];  // array of upgrade IDs
}

const initialState: UpgradesState = {
  available: UPGRADES,
  purchased: [],
};

const upgradesSlice = createSlice({
  name: 'upgrades',
  initialState,
  reducers: {
    purchaseUpgrade: (state, action: PayloadAction<string>) => {
      const upgradeId = action.payload;
      if (!state.purchased.includes(upgradeId)) {
        state.purchased.push(upgradeId);
      }
    },
    resetUpgrades: () => initialState,
  },
});

export const { purchaseUpgrade, resetUpgrades } = upgradesSlice.actions;
export default upgradesSlice.reducer;
