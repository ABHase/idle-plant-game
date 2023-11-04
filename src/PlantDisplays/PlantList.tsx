import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../rootReducer";
import {
  absorbSunlight,
  absorbWater,
  toggleSugarProduction,
  buyLeaves,
  buyRoots,
  toggleGeneticMarkerProduction,
  toggleLeafGrowth,
  toggleRootGrowth,
  turnOffGeneticMarkerProduction,
  setMaxResourceToSpend,
  removeAllWater,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  isSugarConversionUnlocked,
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

type PlantListProps = {
  handleOpenModal: (modalName: string) => void;
  modalName: string;
};

const PlantList: React.FC<PlantListProps> = ({
  handleOpenModal,
  modalName,
}) => {
  const dispatch = useDispatch();
  const plant = useSelector((state: RootState) => state.plant);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const [multiplier, setMultiplier] = useState<number>(1);

  //Handle long pressing

  const [pressTimer, setPressTimer] = useState<number | null>(null);

  const handleButtonPress = useCallback((action: () => void) => {
    action();
    // Cast the return value of setInterval directly to number
    const id = window.setInterval(action, 100) as number;
    setPressTimer(id);
  }, []);

  const handleButtonRelease = useCallback(() => {
    if (pressTimer !== null) {
      clearInterval(pressTimer);
      setPressTimer(null);
    }
  }, [pressTimer]);

  useEffect(() => {
    return () => {
      if (pressTimer !== null) {
        clearInterval(pressTimer);
      }
    };
  }, [pressTimer]); // Cleans up the interval when the component unmounts

  /////////////////////////////

  const paused = useSelector((state: RootState) => state.app.paused);

  const { geneticMarkerProgress, geneticMarkerThreshold } = useSelector(
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

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleRemoveAllWater = () => {
    // dispatch the removeAllWater action
    dispatch(removeAllWater());
    handleClose(); // Optionally close the dialog after the action
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

          <Grid
            item
            xs={12}
            sx={{
              visibility: isSugarConversionUnlocked(plant, difficulty)
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
                  /Min
                </Box>
              </Button>
            </Tooltip>
          </Grid>

          <Grid
            item
            xs={6}
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
                <Sugar
                  amount={
                    plant.geneticMarkerUpgradeActive
                      ? geneticMarkerThreshold * 4
                      : geneticMarkerThreshold
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

          <Grid
            item
            xs={6}
            sx={{
              visibility: isGeneticMarkerUpgradeUnlocked(plant)
                ? "visible"
                : "hidden",
            }}
          >
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
                Grow Leaves: <Leaves amount={multiplier} />
                &nbsp;for <Sugar amount={LEAF_COST * multiplier} />
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

          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: "white" }} />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              disabled={paused}
              sx={{
                border: "1px solid #aaa",
                borderRadius: "4px",
                backgroundColor: "#0F4A52",
                color: "#34F7E1",
                "&:active, &:focus": {
                  backgroundColor: "#0F4A52", // Or any other style reset
                },
              }}
              onTouchStart={() => handleButtonPress(handleWaterAbsorption)}
              onTouchEnd={handleButtonRelease}
              onMouseDown={() => handleButtonPress(handleWaterAbsorption)} // for mouse devices
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease} // in case the cursor leaves the button while pressing
            >
              + <Water amount={plant.water_absorption_rate} />
            </Button>
            <Button
              disabled={paused}
              sx={{
                border: "1px solid #aaa",
                borderRadius: "4px",
                backgroundColor: "#633912",
                color: "#FFC64D",
                "&:active, &:focus": {
                  backgroundColor: "#633912", // Or any other style reset
                },
              }}
              onTouchStart={() => handleButtonPress(handleSunlightAbsorption)}
              onTouchEnd={handleButtonRelease}
              onMouseDown={() => handleButtonPress(handleSunlightAbsorption)} // for mouse devices
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease} // in case the cursor leaves the button while pressing
            >
              + <Sunlight amount={plant.sunlight_absorption_rate} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: "white" }} />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              visibility: plant.rootRot > 0 ? "visible" : "hidden",
            }}
          >
            <Tooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">
                    Remove Root Rot By Having
                  </Typography>
                  <Water amount={0} />
                </React.Fragment>
              }
              arrow
            >
              <Box
                position="relative"
                display="inline-flex"
                width="100%"
                onClick={handleClickOpen} // making the box clickable
                sx={{ cursor: "pointer" }} // changing the cursor to indicate it's clickable
              >
                <LinearProgress
                  variant="determinate"
                  value={(plant.rootRot / plant.rootRotThreshold) * 100}
                  sx={{
                    width: "100%",
                    height: "22px",
                    marginTop: "4px",
                    backgroundColor: "#f0a6a2",
                    "& .MuiLinearProgress-barColorPrimary": {
                      backgroundColor: "#942e25",
                    },
                  }}
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
                  <Typography color="black">Root Rot from Fungus</Typography>
                </Box>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog Component */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            border: "1px solid #ccc",
          },
        }}
      >
        <DialogTitle>{"Remove Root Rot"}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This dialog can contain information or actions to remove the root
            rot.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRemoveAllWater}
            color="primary"
            autoFocus
            sx={{
              border: "1px solid #ccc",
              backgroundColor: "#240000",
              color: "#fff",
            }}
          >
            Empty all water to cleanse roots
          </Button>
          <Button
            onClick={handleClose}
            sx={{
              border: "1px solid #ccc",
              backgroundColor: "#090924",
              color: "#fff",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
  const absValue = Math.abs(value);

  let formattedValue;

  if (absValue >= 1_000_000_000_000_000) {
    formattedValue = (absValue / 1_000_000_000_000_000).toFixed(2) + "Q";
  } else if (absValue >= 1_000_000_000_000) {
    formattedValue = (absValue / 1_000_000_000_000).toFixed(2) + "T";
  } else if (absValue >= 1_000_000_000) {
    formattedValue = (absValue / 1_000_000_000).toFixed(2) + "B";
  } else if (absValue >= 1_000_000) {
    formattedValue = (absValue / 1_000_000).toFixed(2) + "M";
  } else if (absValue >= 1_000) {
    formattedValue = (absValue / 1_000).toFixed(2) + "K";
  } else {
    formattedValue = absValue.toFixed(2);
  }

  // Apply the sign
  return value < 0 ? "-" + formattedValue : formattedValue;
}

export function formatNumberWithoutDecimals(value: number): string {
  const absValue = Math.abs(value);

  let formattedValue;

  if (absValue >= 1_000_000_000_000_000) {
    formattedValue = (absValue / 1_000_000_000_000_000).toFixed(0) + "Q";
  } else if (absValue >= 1_000_000_000_000) {
    formattedValue = (absValue / 1_000_000_000_000).toFixed(0) + "T";
  } else if (absValue >= 1_000_000_000) {
    formattedValue = (absValue / 1_000_000_000).toFixed(0) + "B";
  } else if (absValue >= 1_000_000) {
    formattedValue = (absValue / 1_000_000).toFixed(0) + "M";
  } else if (absValue >= 1_000) {
    formattedValue = (absValue / 1_000).toFixed(0) + "K";
  } else {
    formattedValue = absValue.toFixed(0);
  }

  // Apply the sign
  return value < 0 ? "-" + formattedValue : formattedValue;
}

export default PlantList;
