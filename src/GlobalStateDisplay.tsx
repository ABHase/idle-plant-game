import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';  // Adjust the import path if needed
import { Grid, Typography } from '@mui/material';

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
            <Grid container spacing={2} alignItems="center">
                <Grid item><Typography>Genetic Markers: {geneticMarkers}</Typography></Grid>
            </Grid>
        </div>
    );
};

export default GlobalStateDisplay;
