// PlantTimeDisplay.tsx

import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

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
                      <Box 
                    border={1} 
                    borderColor="grey.300" 
                    borderRadius={2}
                    width="320px"
                    padding={1}
                    margin= "0 auto"
                >
      <Grid container spacing={0.5} alignItems="center">
        <Grid item><Typography>Year: {plantTime.year}|</Typography></Grid>
        <Grid item><Typography>Season: {plantTime.season}|</Typography></Grid>
        <Grid item><Typography>Day: {plantTime.day}|</Typography></Grid>
        
        <Grid item>
            <Typography>
                Hour: {plantTime.hour.toString().padStart(2, '0')}:{plantTime.update_counter.toString().padStart(2, '0')}
            </Typography>
        </Grid>

      </Grid>
      </Box>
    </div>
  );
};

export default PlantTimeDisplay;
