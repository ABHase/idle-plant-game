// localStorage.ts

import { RootState } from './rootReducer';

export const loadState = (): RootState | undefined => {
    try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState) as RootState;
    } catch (err) {
      console.error('Failed to load state from localStorage:', err);
      return undefined;
    }
  };
  
  export const saveState = (state: RootState): void => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('reduxState', serializedState);
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  };
  
  export const clearState = () => {
    try {
        localStorage.removeItem('reduxState');
    } catch (err) {
        console.error('Failed to clear state from localStorage:', err);
    }
};
