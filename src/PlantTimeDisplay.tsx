// PlantTimeDisplay.tsx

import React from 'react';
import { Grid, Typography } from '@mui/material';

interface PlantTimeProps {
  plantTime: {
    year: number;
    season: string;
    day: number;
    hour: number;
    update_counter: number;
  };
}

const PlantTimeDisplay: React.FC<PlantTimeProps> = ({ plantTime }) => {
  return (
    <div className="plant-time-display">
      <Grid container spacing={2} alignItems="center">
        <Grid item><Typography>Year: {plantTime.year}</Typography></Grid>
        <Grid item><Typography>Season: {plantTime.season}</Typography></Grid>
        <Grid item><Typography>Day: {plantTime.day}</Typography></Grid>
        <Grid item><Typography>Hour: {plantTime.hour}:{plantTime.update_counter}</Typography></Grid>
      </Grid>
    </div>
  );
};

export default PlantTimeDisplay;
