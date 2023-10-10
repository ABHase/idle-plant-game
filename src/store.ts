import { configureStore } from '@reduxjs/toolkit';
import plantTimeReducer from './plantTimeSlice';
import biomesReducer from './biomesSlice';  // Adjust the path if necessary
import appReducer from './appSlice';  // Import the app slice reducer
import plantReducer from './plantSlice';  // Import the plant slice reducer

const store = configureStore({
    reducer: {
        app: appReducer,
        plantTime: plantTimeReducer,
        biomes: biomesReducer,
        plant: plantReducer,
    }
});

export default store;
export type RootState = ReturnType<typeof store.getState>; // Useful for typing the state in components
