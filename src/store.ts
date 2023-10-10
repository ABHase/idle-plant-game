import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import thunk from 'redux-thunk';  // Ensure you import thunk

import plantTimeReducer from './plantTimeSlice';
import biomesReducer from './biomesSlice';
import appReducer from './appSlice';
import plantReducer from './plantSlice';
import globalStateSlice from './gameStateSlice';

const store = configureStore({
    reducer: {
        app: appReducer,
        plantTime: plantTimeReducer,
        biomes: biomesReducer,
        plant: plantReducer,
        globalState: globalStateSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk) // Add thunk to the list of middlewares
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // This line will be useful for dispatching thunks from components
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;