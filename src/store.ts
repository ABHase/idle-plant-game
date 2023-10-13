//store.ts

import { configureStore, Action } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import thunk from "redux-thunk";
import plantTimeReducer from "./plantTimeSlice";
import appReducer from "./appSlice";
import plantReducer from "./plantSlice";
import upgradesReducer from "./upgradesSlice";
import globalStateSlice from "./gameStateSlice";
import { loadState, saveState } from "./localStorage";
import { RootState } from "./rootReducer";
import plantHistoryReducer from "./plantHistorySlice";
import timeBoostReducer from "./timeBoostSlice"; // Adjust the path if it's located elsewhere

const persistedState: RootState | undefined = loadState();

const store = configureStore({
  ...(persistedState ? { preloadedState: persistedState } : {}),
  reducer: {
    app: appReducer,
    plantTime: plantTimeReducer,
    plant: plantReducer,
    globalState: globalStateSlice,
    upgrades: upgradesReducer,
    plantHistory: plantHistoryReducer,
    timeBoost: timeBoostReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
