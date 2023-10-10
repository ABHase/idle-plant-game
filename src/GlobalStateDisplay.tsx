//GlobalStateDisplay.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';  // Adjust the import path if needed

const GlobalStateDisplay: React.FC = () => {
    const {
        geneticMarkerProgress,
        geneticMarkerThreshold,
        geneticMarkers,
        seeds,
        silica,
        tannins,
        calcium,
        fulvic,
        costModifier,
    } = useSelector((state: RootState) => state.globalState);

    return (
        <div className="global-state-display">
            <h3>Global State</h3>
            <p>Genetic Marker Progress: {geneticMarkerProgress}/{geneticMarkerThreshold}</p>
            <p>Genetic Markers: {geneticMarkers}</p>
            <p>Seeds: {seeds}</p>
            <p>Silica: {silica}</p>
            <p>Tannins: {tannins}</p>
            <p>Calcium: {calcium}</p>
            <p>Fulvic: {fulvic}</p>
            <p>Cost Modifier: {costModifier}</p>
        </div>
    );
};

export default GlobalStateDisplay;
