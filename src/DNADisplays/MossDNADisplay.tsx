import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer"; // Adjust the import path if needed
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { DNA } from "../Components/DNA";
import { isGeneticMarkerUpgradeUnlocked } from "../formulas";

const MossDNADisplay: React.FC = () => {
  const {
    geneticMarkerProgressMoss,
    geneticMarkerThresholdMoss,
    geneticMarkersMoss,
  } = useSelector((state: RootState) => state.globalState);

  const plant = useSelector((state: RootState) => state.plant);

  const percentage = Math.floor(
    (geneticMarkerProgressMoss / geneticMarkerThresholdMoss) * 100
  );

  return (
    <div className="moss-dna-display">
      <Box
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        width="320px"
        padding={1}
        margin="0 auto"
        bgcolor="rgba(0, 0, 0, 0.9)"
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
            <DNA amount={geneticMarkersMoss} />
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h6">You are a clump of Moss</Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default MossDNADisplay;
