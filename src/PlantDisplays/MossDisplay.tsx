import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../rootReducer";
import {
  absorbSunlight,
  absorbWater,
  toggleSugarProduction,
  buyLeaves,
  buyRoots,
  toggleGeneticMarkerProduction,
  toggleRootGrowth,
  toggleLeafGrowth,
  turnOffGeneticMarkerProduction,
  setMaxResourceToSpend,
} from "../Slices/plantSlice";
import {
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Box,
  LinearProgress,
  TextField,
} from "@mui/material";
import { Add, ArrowForwardIos, Clear } from "@mui/icons-material";
import { LEAF_COST, ROOT_COST } from "../constants";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import OpacityIcon from "@mui/icons-material/Opacity";
import GrainIcon from "@mui/icons-material/Grain";
import GrassIcon from "@mui/icons-material/Grass";
import SpaIcon from "@mui/icons-material/Spa";
import ParkIcon from "@mui/icons-material/Park";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import {
  MATURITY_SUGAR_PRODUCTION_MODIFIER,
  MATURITY_WATER_CONSUMPTION_MODIFIER,
  MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER,
  BASE_WATER_CONSUMPTION,
  BASE_SUNLIGHT_CONSUMPTION,
} from "../constants";
import { Water } from "../Components/Water";
import { Sunlight } from "../Components/Sunlight";
import { Roots } from "../Components/Roots";
import { Leaves } from "../Components/Leaves";
import { Sugar } from "../Components/Sugar";
import { Maturity } from "../Components/Maturity";
import { DNAIcon } from "../icons/dna";
import { DNA } from "../Components/DNA";
import {
  calculateActualSugarProductionPerMinute,
  calculatePhotosynthesisSunlightConsumption,
  calculatePhotosynthesisWaterConsumption,
  determinePhotosynthesisSugarProduction,
  isGeneticMarkerUpgradeUnlocked,
  isSugarUpgradesUnlocked,
  itemizedReport,
} from "../formulas";
import ToggleAutoLeafButton from "../Components/Buttons/ToggleAutoLeafButton";
import ToggleAutoRootButton from "../Components/Buttons/ToggleAutoRootButton";
import MaturityTooltip from "../Components/Tooltips/MaturityTooltip";
import ResourceConversionTooltip from "../Components/Tooltips/ResourceConversionTooltip";
import SunlightTooltip from "../Components/Tooltips/SunlightTooltip";
import RootsTooltip from "../Components/Tooltips/RootsTooltip";
import LeavesTooltip from "../Components/Tooltips/LeavesTooltip";
import WaterTooltip from "../Components/Tooltips/WaterTooltip";
import MultiplierToggleButton from "../Components/Buttons/MultiplierToggleButton";

type MossDisplayProps = {
  handleOpenModal: (modalName: string) => void;
  modalName: string;
};

const MossDisplay: React.FC<MossDisplayProps> = ({
  handleOpenModal,
  modalName,
}) => {
  const dispatch = useDispatch();
  const plant = useSelector((state: RootState) => state.plant);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const [multiplier, setMultiplier] = useState<number>(1);

  const { geneticMarkerProgressMoss, geneticMarkerThresholdMoss } = useSelector(
    (state: RootState) => state.globalState
  );
  const plantState = useSelector((state: RootState) => state.plant);

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

  // Sugar Modifier
  let sugarModifier = 1; // default
  if (season === "Autumn") {
    sugarModifier = plantState.autumnModifier;
  } else if (season === "Winter") {
    sugarModifier = plantState.winterModifier;
  }

  // Water Modifier
  let waterModifier = 1; // default
  if (season === "Spring") {
    waterModifier = plantState.springModifier;
  } else if (season === "Winter") {
    waterModifier = plantState.winterModifier;
  }

  // Sunlight Modifier
  let sunlightModifier = 1; // default
  if (season === "Summer") {
    sunlightModifier = plantState.summerModifier;
  } else if (season === "Winter") {
    sunlightModifier = plantState.winterModifier;
  }

  const baseRate = plantState.sugar_production_rate;
  const modifiedRate =
    baseRate *
    (1 + MATURITY_SUGAR_PRODUCTION_MODIFIER * plantState.maturity_level) *
    sugarModifier;
  const waterConsumption =
    BASE_WATER_CONSUMPTION *
    (1 + MATURITY_WATER_CONSUMPTION_MODIFIER * plantState.maturity_level);
  const sunlightConsumption =
    BASE_SUNLIGHT_CONSUMPTION *
    (1 + MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER * plantState.maturity_level);

  const isSugarProductionPossible =
    plantState.is_sugar_production_on &&
    plantState.water > waterConsumption &&
    plantState.sunlight > sunlightConsumption;

  const netSunlightRate = isSugarProductionPossible
    ? (plantState.leaves - sunlightConsumption) *
      plantState.sunlight_absorption_multiplier *
      sunlightModifier *
      plant.ladybugs
    : plantState.leaves *
      plantState.sunlight_absorption_multiplier *
      sunlightModifier *
      plant.ladybugs;

  const actualSugarPerMinute = calculateActualSugarProductionPerMinute(
    plant,
    report,
    plantTime,
    difficulty
  );

  const handleSunlightAbsorption = () => {
    dispatch(absorbSunlight());
  };

  const handleWaterAbsorption = () => {
    dispatch(absorbWater());
  };

  const handleToggleSugarProduction = () => {
    dispatch(toggleSugarProduction());
  };

  const handleBuyRoots = () => {
    dispatch(buyRoots({ cost: ROOT_COST, multiplier: multiplier }));
  };

  const handleBuyLeaves = () => {
    dispatch(buyLeaves({ cost: LEAF_COST, multiplier: multiplier }));
  };

  const handleToggleGeneticMarkerProduction = () => {
    dispatch(toggleGeneticMarkerProduction());
  };

  const handleToggleAutoLeaves = () => {
    dispatch(toggleLeafGrowth());
  };

  const handleToggleAutoRoots = () => {
    dispatch(toggleRootGrowth());
  };

  const toggleMultiplier = (value: number) => {
    if (multiplier === value) {
      setMultiplier(1); // If the clicked multiplier is the same as the current multiplier, reset to 1
    } else {
      setMultiplier(value); // Otherwise, set to the clicked value
    }
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
      >
        <Grid container spacing={1} alignItems="center">
          {plant.aphids > 1 ? (
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="medium"
                fullWidth
                sx={{
                  backgroundColor: "#e6842e",
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "#ba671e", // This is a lighter shade of orange
                  },
                  "&:active, &:focus": {
                    backgroundColor: "#e6842e", // Or any other style reset
                  },
                }}
                onClick={() => handleOpenModal(modalName)}
              >
                <Typography variant="h5" align="center">
                  You Have Aphids!
                </Typography>
              </Button>
            </Grid>
          ) : null}

          <Grid item xs={4}>
            <WaterTooltip
              productionRate={report.water.netWaterProduction}
              amount={plant.water}
            />
            <RootsTooltip amount={plant.roots} />
          </Grid>

          <Grid item xs={4}>
            <SunlightTooltip
              productionRate={report.sunlight.netSunlightProduction}
              amount={plant.sunlight}
            />
            <LeavesTooltip amount={plant.leaves} />
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
            />
            <MaturityTooltip maturityLevel={plant.maturity_level} />
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
                    backgroundColor: "#424532", // Or any other style reset
                  },
                }}
                onClick={() => handleToggleSugarProduction()}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Water
                    amount={calculatePhotosynthesisWaterConsumption(
                      plant.maturity_level,
                      difficulty
                    )}
                  />
                  /s +{" "}
                  <Sunlight
                    amount={calculatePhotosynthesisSunlightConsumption(
                      plant.maturity_level,
                      difficulty
                    )}
                  />
                  /s{" "}
                  <ArrowForwardIcon
                    sx={{ color: plant.is_sugar_production_on ? "" : "red" }}
                  />{" "}
                  <Sugar amount={actualSugarPerMinute} />
                  /MIN
                </Box>
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
                      ? geneticMarkerThresholdMoss * 4
                      : geneticMarkerThresholdMoss
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
              onChange={(e) =>
                dispatch(setMaxResourceToSpend(parseFloat(e.target.value)))
              }
              label="Max Resource to Spend"
              inputProps={{ step: "1000" }}
            />
          </Grid>

          {/*Section for toggling leaf automatic production */}
          <ToggleAutoLeafButton
            isOn={plant.leafGrowthToggle}
            onClick={handleToggleAutoLeaves}
            leafCost={LEAF_COST}
            multiplier={plant.leafAutoGrowthMultiplier}
            isVisible={plant.grassGrowthToggle}
            plant={plant}
          />

          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: "white" }} />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              visibility: isSugarUpgradesUnlocked(plant) ? "visible" : "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MultiplierToggleButton
                currentMultiplier={multiplier}
                value={1}
                onClick={toggleMultiplier}
              />
              <MultiplierToggleButton
                currentMultiplier={multiplier}
                value={10}
                onClick={toggleMultiplier}
              />
              <MultiplierToggleButton
                currentMultiplier={multiplier}
                value={100}
                onClick={toggleMultiplier}
              />
              <MultiplierToggleButton
                currentMultiplier={multiplier}
                value={1000}
                onClick={toggleMultiplier}
              />
              <MultiplierToggleButton
                currentMultiplier={multiplier}
                value={1000000000000000}
                onClick={toggleMultiplier}
              />
            </Box>
          </Grid>

          {/* Leaves Section */}
          <Grid
            item
            xs={12}
            sx={{
              visibility: isSugarUpgradesUnlocked(plant) ? "visible" : "hidden",
            }}
          >
            <Tooltip title="Grow Leaves and Roots">
              <Button
                fullWidth
                sx={{
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                  backgroundColor: "#424532",
                  color: "#B5D404",
                  "&:active, &:focus": {
                    backgroundColor: "#424532", // Or any other style reset
                  },
                }}
                onClick={() => {
                  handleBuyLeaves();
                }}
              >
                Grow: <Leaves amount={multiplier} />&
                <Roots amount={multiplier} />
                &nbsp;for <Sugar amount={LEAF_COST * multiplier} />
              </Button>
            </Tooltip>
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

export default MossDisplay;
