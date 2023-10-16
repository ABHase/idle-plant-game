import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer"; // Adjust the import path if needed
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { DNA } from "../Components/DNA";

const GrassDNADisplay: React.FC = () => {
  const {
    geneticMarkerProgressGrass,
    geneticMarkerThresholdGrass,
    geneticMarkersGrass,
  } = useSelector((state: RootState) => state.globalState);

  const percentage = Math.floor(
    (geneticMarkerProgressGrass / geneticMarkerThresholdGrass) * 100
  );

  return (
    <div className="grass-dna-display">
      <Box
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        width="320px"
        padding={1}
        margin="0 auto"
      >
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={3}>
            <DNA amount={geneticMarkersGrass} />
          </Grid>
          <Grid item xs={9}>
            <Box position="relative" display="inline-flex" width="100%">
              <LinearProgress
                variant="determinate"
                value={
                  (geneticMarkerProgressGrass / geneticMarkerThresholdGrass) *
                  100
                }
                sx={{ width: "100%", height: "12px", marginTop: "4px" }}
              />

              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  color: "white",
                }}
              >
                <Typography variant="caption" color="black">
                  {percentage}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default GrassDNADisplay;
