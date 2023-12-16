import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../rootReducer";
import {
  toggleSugarProduction,
  buyLeaves,
  buyRoots,
  toggleGeneticMarkerProduction,
  toggleRootGrowth,
  toggleLeafGrowth,
  setMaxResourceToSpend,
} from "../Slices/plantSlice";
import {
  Grid,
  Typography,
  Button,
  Tooltip,
  Box,
  TextField,
} from "@mui/material";
import { LEAF_COST, ROOT_COST } from "../constants";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Water } from "../Components/Water";
import { Sunlight } from "../Components/Sunlight";
import { Sugar } from "../Components/Sugar";
import { DNA } from "../Components/DNA";
import {
  calculateActualSugarProductionPerMinute,
  calculatePhotosynthesisSunlightConsumption,
  calculatePhotosynthesisWaterConsumption,
  itemizedReport,
} from "../formulas";
import ResourceConversionTooltip from "../Components/Tooltips/ResourceConversionTooltip";
import SunlightTooltip from "../Components/Tooltips/SunlightTooltip";
import WaterTooltip from "../Components/Tooltips/WaterTooltip";

type VineDisplayProps = {
  handleOpenModal: (modalName: string) => void;
  modalName: string;
};

const VineDisplay: React.FC<VineDisplayProps> = ({
  handleOpenModal,
  modalName,
}) => {
  const dispatch = useDispatch();
  const plant = useSelector((state: RootState) => state.plant);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const [multiplier, setMultiplier] = useState<number>(1);

  const { geneticMarkerThresholdVine } = useSelector(
    (state: RootState) => state.globalState
  );

  const difficulty = useSelector(
    (state: RootState) => state.globalState.difficulty
  );

  const globalBoostedTicks = useSelector(
    (state: RootState) => state.globalState.globalBoostedTicks
  );

  const timeScale =
    globalBoostedTicks > 1000 ? 200 : globalBoostedTicks > 0 ? 40 : 1;

  // Extract season from state (Assuming you have access to the state here)
  const { season } = useSelector((state: RootState) => state.plantTime);
  const report = itemizedReport(plant, season, difficulty, timeScale);

  const sugarInfo = calculateActualSugarProductionPerMinute(
    plant,
    report,
    plantTime,
    difficulty
  );

  const handleToggleSugarProduction = () => {
    dispatch(toggleSugarProduction());
  };

  const handleToggleGeneticMarkerProduction = () => {
    dispatch(toggleGeneticMarkerProduction());
  };

  return (
    <div key={plant.id} className="plant-container">
      <Box
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        width="320px"
        padding={1}
        margin="0 auto"
        bgcolor="rgba(0, 0, 0, 0.75)"
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={4}>
            <WaterTooltip
              productionRate={report.water.netWaterProduction}
              amount={plant.water}
              displayMode="amount"
            />
          </Grid>

          <Grid item xs={4}>
            <SunlightTooltip
              productionRate={report.sunlight.netSunlightProduction}
              amount={plant.sunlight}
              displayMode="amount"
            />
          </Grid>
          <Grid item xs={4}>
            <ResourceConversionTooltip
              maturityLevel={plant.maturity_level}
              sugarProductionRate={plant.sugar_production_rate}
              season={season}
              autumnModifier={plant.autumnModifier}
              winterModifier={plant.winterModifier}
              agaveSugarBonus={plant.agaveSugarBonus}
              sugar={plant.sugar}
              difficulty={difficulty}
              waterEfficiency={plant.water_efficiency_multiplier}
              sunlightEfficiency={plant.sunlight_efficiency_multiplier}
              baseSugarProductionRate={plant.sugar_production_rate}
              plantType={plant.type}
            />
          </Grid>

          <Grid item xs={12}>
            <Tooltip
              title={
                plant.is_sugar_production_on
                  ? "Turn off Sugar Production"
                  : "Turn on Sugar Production"
              }
            >
              <Button
                fullWidth
                sx={{
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                  backgroundColor: "#424532",
                  color: "#B5D404",
                  "&:active, &:focus": {
                    backgroundColor: "#424532",
                  },
                  padding: "1px", // Add some padding for spacing
                  display: "flex",
                  justifyContent: "space-between", // This will spread out the main axis items
                }}
                onClick={() => handleToggleSugarProduction()}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column", // Stack items vertically
                    alignItems: "flex-start", // Align items to the start of the cross axis
                  }}
                >
                  <Water
                    amount={calculatePhotosynthesisWaterConsumption(
                      plant.maturity_level,
                      difficulty,
                      plant.water_efficiency_multiplier
                    )}
                  />
                  <Sunlight
                    amount={calculatePhotosynthesisSunlightConsumption(
                      plant.maturity_level,
                      difficulty,
                      plant.sunlight_efficiency_multiplier
                    )}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center", // Center items on the cross axis
                    justifyContent: "center", // Center items on the main axis
                    flexWrap: "wrap",
                  }}
                >
                  {sugarInfo.usingReserves && (
                    <Typography variant="subtitle2" sx={{ color: "#eb6d2f" }}>
                      Using Reserves
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Sugar amount={sugarInfo.sugarProduction} size="large" />

                    <Typography variant="caption">/MIN</Typography>
                  </Box>
                </Box>
                <ArrowForwardIcon
                  sx={{
                    color: plant.is_sugar_production_on ? "inherit" : "red",
                  }}
                />
              </Button>
            </Tooltip>
          </Grid>

          <Grid item xs={6}>
            <Tooltip
              title={
                plant.is_genetic_marker_production_on
                  ? "Turn off Genetic Marker Production"
                  : "Turn on Genetic Marker Production"
              }
            >
              <Button
                fullWidth
                sx={{
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                  backgroundColor: "#332932",
                  padding: "12px",
                  color: "#DEA4FC",
                  "&:active, &:focus": {
                    backgroundColor: "#332932", // Or any other style reset
                  },
                }}
                onClick={() => handleToggleGeneticMarkerProduction()}
              >
                <Sugar
                  amount={
                    plant.geneticMarkerUpgradeActive
                      ? geneticMarkerThresholdVine * 4
                      : geneticMarkerThresholdVine
                  }
                />
                <ArrowForwardIcon
                  sx={{
                    color: plant.is_genetic_marker_production_on ? "" : "red",
                  }}
                />{" "}
                <DNA amount={plant.geneticMarkerUpgradeActive ? 2 : 1} />
              </Button>
            </Tooltip>
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="number"
              value={plant.maxResourceToSpend}
              onChange={(e) => {
                const value = e.target.value;
                dispatch(
                  setMaxResourceToSpend(value === "" ? null : parseFloat(value))
                );
              }}
              label="Max Resource to Spend"
              inputProps={{ step: "1000" }}
            />
          </Grid>
        </Grid>
      </Box>
      {/* ... [Rest of the code for displaying other plant info] */}
    </div>
  );
};

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K";
  } else {
    return Math.round(value).toString();
  }
}

export function formatNumberWithDecimals(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "K";
  } else {
    return value.toFixed(2);
  }
}

export default VineDisplay;
