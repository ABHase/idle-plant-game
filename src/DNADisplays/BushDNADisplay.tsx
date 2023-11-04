import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../rootReducer"; // Adjust the import path if needed
import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { DNA } from "../Components/DNA";
import { isGeneticMarkerUpgradeUnlocked } from "../formulas";
import { createSeed } from "../Slices/gameStateSlice";
import { buttonStyle } from "../buttonStyles";

const BushDNADisplay: React.FC = () => {
  const {
    geneticMarkerProgressBush,
    geneticMarkerThresholdBush,
    geneticMarkersBush,
    fulvic,
    tannins,
    silica,
    calcium,
  } = useSelector((state: RootState) => state.globalState);
  const plant = useSelector((state: RootState) => state.plant);

  const percentage = Math.floor(
    (geneticMarkerProgressBush / geneticMarkerThresholdBush) * 100
  );

  const dispatch = useDispatch();

  const handleCreateTimeSeed = () => {
    dispatch(createSeed());
  };

  return (
    <div className="bush-dna-display">
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
            <DNA amount={geneticMarkersBush} />
          </Grid>
          <Grid item xs={9}>
            {fulvic >= 1 && tannins >= 1 && silica >= 1 && calcium >= 1 ? (
              <Button
                variant="contained"
                onClick={handleCreateTimeSeed}
                sx={buttonStyle}
              >
                Create a Time Seed?
              </Button>
            ) : (
              <Typography variant="h5">You are a Berry Bush</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default BushDNADisplay;
