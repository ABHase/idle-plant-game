import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PlantState } from "./plantSlice"; // Import this for typing
import { UPGRADES } from "../upgrades";

type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export interface UpgradesState {
  available: Upgrade[];
  purchased: string[]; // array of upgrade IDs
}

export const initialState: UpgradesState = {
  available: UPGRADES.Fern,
  purchased: [],
};

const upgradesSlice = createSlice({
  name: "upgrades",
  initialState,
  reducers: {
    purchaseUpgrade: (state, action: PayloadAction<string>) => {
      const upgradeId = action.payload;
      if (!state.purchased.includes(upgradeId)) {
        state.purchased.push(upgradeId);
      }
    },
    sellUpgrade: (state, action: PayloadAction<string>) => {
      const upgradeId = action.payload;
      const index = state.purchased.indexOf(upgradeId);
      if (index > -1) {
        state.purchased.splice(index, 1);
      }
    },
    changeAvailableUpgrades: (
      state,
      action: PayloadAction<{ plantType: string }>
    ) => {
      state.available = UPGRADES[action.payload.plantType];
    },
    resetUpgrades: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is PayloadAction<{ upgrades: UpgradesState }> =>
        action.type === "REPLACE_STATE",
      (state, action) => {
        if (action.payload.upgrades !== undefined) {
          return action.payload.upgrades;
        }
        return state;
      }
    );
  },
});

export const {
  purchaseUpgrade,
  resetUpgrades,
  sellUpgrade,
  changeAvailableUpgrades,
} = upgradesSlice.actions;
export default upgradesSlice.reducer;
