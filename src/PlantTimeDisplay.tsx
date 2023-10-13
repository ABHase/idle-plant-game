import React from "react";
import { Box, Typography } from "@mui/material";

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
        margin="0 auto"
        display="flex"
        justifyContent="space-between"
      >
        <Typography>Year: {plantTime.year}</Typography>
        <Typography>Season: {plantTime.season}</Typography>
        <Typography>Day: {plantTime.day}</Typography>
        <Typography>
          Hour: {plantTime.hour.toString().padStart(2, "0")}:
          {plantTime.update_counter.toString().padStart(2, "0")}
        </Typography>
      </Box>
    </div>
  );
};

export default PlantTimeDisplay;
