import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../rootReducer";
import {
  absorbSunlight,
  absorbWater,
  toggleSugarProduction,
  buyLeaves,
  buyRoots,
  toggleGeneticMarkerProduction,
  buyNeedles,
  toggleLeafGrowth,
  toggleRootGrowth,
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
} from "@mui/material";
import { LEAF_COST, ROOT_COST } from "../constants";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
  calculateSugarPhotosynthesis,
  determinePhotosynthesisSugarProduction,
  isGeneticMarkerUpgradeUnlocked,
  isSugarConversionUnlocked,
  isSugarUpgradesUnlocked,
  itemizedReport,
} from "../formulas";
import ToggleAutoLeafButton from "../Components/Buttons/ToggleAutoLeafButton";
import ToggleAutoRootButton from "../Components/Buttons/ToggleAutoRootButton";
import ResourceConversionTooltip from "../Components/Tooltips/ResourceConversionTooltip";
import LeavesTooltip from "../Components/Tooltips/LeavesTooltip";
import SunlightTooltip from "../Components/Tooltips/SunlightTooltip";
import RootsTooltip from "../Components/Tooltips/RootsTooltip";
import WaterTooltip from "../Components/Tooltips/WaterTooltip";
import MaturityTooltip from "../Components/Tooltips/MaturityTooltip";
import ProtectionInfo from "../Components/ProtectionInfo";
import MultiplierToggleButton from "../Components/Buttons/MultiplierToggleButton";

type SucculentDisplayProps = {
  handleOpenModal: (modalName: string) => void;
  modalName: string;
};

const SucculentDisplay: React.FC<SucculentDisplayProps> = ({
  handleOpenModal,
  modalName,
}) => {
  const dispatch = useDispatch();
  const plant = useSelector((state: RootState) => state.plant);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const [multiplier, setMultiplier] = useState<number>(1);

  const { geneticMarkerProgress, geneticMarkerThresholdSucculent } =
    useSelector((state: RootState) => state.globalState);
  const plantState = useSelector((state: RootState) => state.plant);

  // Extract season from state (Assuming you have access to the state here)
  const { season } = useSelector((state: RootState) => state.plantTime);
  const report = itemizedReport(plant, season);

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
    plantTime
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

  const handleBuyNeedles = () => {
    for (let i = 0; i < multiplier; i++) {
      dispatch(buyNeedles({ cost: plantState.maturity_level * 100 }));
    }
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
                <Typography variant="h5">You Have Aphids!</Typography>
              </Button>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h5">You are a Desert Succulent</Typography>
            </Box>
          </Grid>
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
            />
            <MaturityTooltip maturityLevel={plant.maturity_level} />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              visibility: isSugarConversionUnlocked(plant)
                ? "visible"
                : "hidden",
            }}
          >
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
                      plant.maturity_level
                    )}
                  />
                  /s +{" "}
                  <Sunlight
                    amount={calculatePhotosynthesisSunlightConsumption(
                      plant.maturity_level
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

          <Grid
            item
            xs={12}
            sx={{
              visibility: isGeneticMarkerUpgradeUnlocked(plant)
                ? "visible"
                : "hidden",
            }}
          >
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
                <Sugar amount={100} />
                /s{" "}
                <ArrowForwardIcon
                  sx={{
                    color: plant.is_genetic_marker_production_on ? "" : "red",
                  }}
                />{" "}
                <DNA amount={(1 / geneticMarkerThresholdSucculent) * 100} /> %{" "}
                {plant.is_genetic_marker_production_on ? "Stop" : "Start"}
              </Button>
            </Tooltip>
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
          {/*Section for toggling root automatic production */}
          <ToggleAutoRootButton
            isOn={plant.rootGrowthToggle}
            onClick={handleToggleAutoRoots}
            rootCost={ROOT_COST}
            multiplier={plant.rootAutoGrowthMultiplier}
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
                value={100000}
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
            <Tooltip title="Grow Leaves">
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
                onClick={() => handleBuyLeaves()}
              >
                Leaves: <Leaves amount={multiplier} />
                &nbsp;for <Sugar amount={LEAF_COST * multiplier} />
                <Water amount={LEAF_COST * multiplier * 100} />
              </Button>
            </Tooltip>
          </Grid>

          {/* Roots Section */}
          <Grid
            item
            xs={12}
            sx={{
              visibility: isSugarUpgradesUnlocked(plant) ? "visible" : "hidden",
            }}
          >
            <Tooltip title="Grow Roots">
              <Button
                fullWidth
                sx={{
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                  backgroundColor: "#363534",
                  color: "#C7B08B",
                  "&:active, &:focus": {
                    backgroundColor: "#363534", // Or any other style reset
                  },
                }}
                onClick={() => handleBuyRoots()}
              >
                Grow Roots: <Roots amount={multiplier} />
                &nbsp;for <Sugar amount={ROOT_COST * multiplier} />
              </Button>
            </Tooltip>
          </Grid>
          {/* Needles Section */}
          <Grid
            item
            xs={12}
            sx={{
              visibility: isSugarUpgradesUnlocked(plant) ? "visible" : "hidden",
            }}
          >
            <Tooltip title="Grow Needles">
              <Button
                fullWidth
                sx={{
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                  backgroundColor: "#252b36",
                  color: "#d0d4db",
                  "&:active, &:focus": {
                    backgroundColor: "#252b36", // Or any other style reset
                  },
                }}
                onClick={() => handleBuyNeedles()}
              >
                Grow Needles: {multiplier}
                &nbsp;for{" "}
                <Sugar amount={plant.maturity_level * 100 * multiplier} />
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: "white" }} />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              sx={{
                border: "1px solid #aaa",
                borderRadius: "4px",
                backgroundColor: "#0F4A52",
                color: "#34F7E1",
                "&:active, &:focus": {
                  backgroundColor: "#0F4A52", // Or any other style reset
                },
              }}
              onClick={() => handleWaterAbsorption()}
            >
              + <Water amount={plant.water_absorption_rate} />
            </Button>
            <Button
              sx={{
                border: "1px solid #aaa",
                borderRadius: "4px",
                backgroundColor: "#633912",
                color: "#FFC64D",
                "&:active, &:focus": {
                  backgroundColor: "#633912", // Or any other style reset
                },
              }}
              onClick={() => handleSunlightAbsorption()}
            >
              + <Sunlight amount={plant.sunlight_absorption_rate} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: "white" }} />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <ProtectionInfo
                needles={plant.needles}
                needleProtection={plant.needleProtection}
                rabbitImmunity={plant.rabbitImmunity}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
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

export default SucculentDisplay;
