import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer"; // Adjust the import path if needed
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { DNA } from "../Components/DNA";
import { isGeneticMarkerUpgradeUnlocked } from "../formulas";

const SucculentDNADisplay: React.FC = () => {
  const {
    geneticMarkerProgressSucculent,
    geneticMarkerThresholdSucculent,
    geneticMarkersSucculent,
  } = useSelector((state: RootState) => state.globalState);

  const plant = useSelector((state: RootState) => state.plant);

  const percentage = Math.floor(
    (geneticMarkerProgressSucculent / geneticMarkerThresholdSucculent) * 100
  );

  return (
    <div className="succulent-dna-display">
      <Box
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        width="320px"
        padding={1}
        margin="0 auto"
      >
        <Grid container spacing={0} alignItems="center">
          <Grid
            item
            xs={3}
            sx={{
              visibility: isGeneticMarkerUpgradeUnlocked(plant)
                ? "visible"
                : "hidden",
            }}
          >
            <DNA amount={geneticMarkersSucculent} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default SucculentDNADisplay;
