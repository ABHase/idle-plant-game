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
  setMaxResourceToSpend,
  removeAllWater,
  resetRootRot,
} from "../Slices/plantSlice";
import {
  Grid,
  Typography,
  Button,
  Divider,
  Tooltip,
  Box,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LEAF_COST, ROOT_COST } from "../constants";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Water } from "../Components/Water";
import { Sunlight } from "../Components/Sunlight";
import { Roots } from "../Components/Roots";
import { Leaves } from "../Components/Leaves";
import { Sugar } from "../Components/Sugar";
import { DNA } from "../Components/DNA";
import {
  calculateActualSugarProductionPerMinute,
  calculatePhotosynthesisSunlightConsumption,
  calculatePhotosynthesisWaterConsumption,
  getHalfAffordableLeaves,
  getHalfAffordableLeavesSucculent,
  getHalfAffordableRoots,
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
import MusicPlayer from "../Components/MusicPlayer";
import springSong from "../assets/music/Spring_-_Fern.mp3";
import summerSong from "../assets/music/Summer_-_Fern.mp3";
import autumnSong from "../assets/music/Autumn_-_Fern.mp3";
import winterSong from "../assets/music/Winter_-_Fern.mp3";
import { formatTime } from "./BushDisplay";
import SugarProductionRate from "../Components/Tooltips/SugarProductionRate";
import Jukebox from "../Components/Jukebox";
import LeafTooltip from "../Components/Tooltips/LeafButtonTooltip";

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

  const { geneticMarkerThreshold } = useSelector(
    (state: RootState) => state.globalState
  );
  const plantState = useSelector((state: RootState) => state.plant);

  const rootRotConfirm = useSelector(
    (state: RootState) => state.plantTime.rootRotConfirm
  );

  const difficulty = useSelector(
    (state: RootState) => state.globalState.difficulty
  );

  const globalBoostedTicks = useSelector(
    (state: RootState) => state.globalState.globalBoostedTicks
  );

  const jukeboxUnlocked = useSelector(
    (state: RootState) => state.app.jukeboxUnlocked
  );

  const timeScale =
    globalBoostedTicks > 1000 ? 200 : globalBoostedTicks > 0 ? 40 : 1;

  // Extract season from state (Assuming you have access to the state here)
  const { season } = useSelector((state: RootState) => state.plantTime);
  const songSeason = useSelector((state: RootState) => state.plantTime.season);
  const report = itemizedReport(plant, season, difficulty, timeScale);

  const sugarInfo = calculateActualSugarProductionPerMinute(
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
    const actualMultiplier =
      multiplier === -1
        ? getHalfAffordableRoots(plantState, ROOT_COST)
        : multiplier;
    dispatch(buyRoots({ cost: ROOT_COST, multiplier: actualMultiplier }));
  };

  const handleBuyLeaves = () => {
    let actualMultiplier;
    if (multiplier === -1) {
      if (plantState.type === "Succulent") {
        actualMultiplier = getHalfAffordableLeavesSucculent(
          plantState,
          LEAF_COST
        );
      } else {
        actualMultiplier = getHalfAffordableLeaves(plantState, LEAF_COST);
      }
    } else {
      actualMultiplier = multiplier;
    }
    dispatch(buyLeaves({ cost: LEAF_COST, multiplier: actualMultiplier }));
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
    dispatch(resetRootRot());
    dispatch(removeAllWater());
    handleClose(); // Optionally close the dialog after the action
  };

  type Season = "Spring" | "Summer" | "Autumn" | "Winter";

  const songs: Record<Season, typeof springSong> = {
    Spring: springSong,
    Summer: summerSong,
    Autumn: autumnSong,
    Winter: winterSong,
  };

  const songToPlay = songs[songSeason as Season];

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
          <Grid item xs={12}>
            {jukeboxUnlocked ? <Jukebox /> : <MusicPlayer song={songToPlay} />}
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: "white" }} />
          </Grid>
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

          {plant.ladyBugTicks > 0 ? (
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="medium"
                fullWidth
                sx={{
                  backgroundColor: "#630200",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#940300", // This is a lighter shade of orange
                  },
                  "&:active, &:focus": {
                    backgroundColor: "#630200", // Or any other style reset
                  },
                }}
                onClick={() => handleOpenModal(modalName)}
              >
                <Typography>
                  Protection Remaining: {formatTime(plant.ladyBugTicks)}
                </Typography>
              </Button>
            </Grid>
          ) : null}

          <Grid item xs={4}>
            <WaterTooltip
              productionRate={report.water.netWaterProduction}
              amount={plant.water}
              displayMode="productionRate"
            />
          </Grid>
          <Grid item xs={4}>
            <SunlightTooltip
              productionRate={report.sunlight.netSunlightProduction}
              amount={plant.sunlight}
              displayMode="productionRate"
            />
          </Grid>

          <Grid item xs={4}>
            <SugarProductionRate
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
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: "white" }} />
          </Grid>

          <Grid item xs={4}>
            <WaterTooltip
              productionRate={report.water.netWaterProduction}
              amount={plant.water}
              displayMode="amount"
            />
            <RootsTooltip amount={plant.roots} />
          </Grid>

          <Grid item xs={4}>
            <SunlightTooltip
              productionRate={report.sunlight.netSunlightProduction}
              amount={plant.sunlight}
              displayMode="amount"
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
              waterEfficiency={plant.water_efficiency_multiplier}
              sunlightEfficiency={plant.sunlight_efficiency_multiplier}
              baseSugarProductionRate={plant.sugar_production_rate}
              plantType={plant.type}
            />
            <MaturityTooltip
              leaves={plant.leaves}
              roots={plant.roots}
              maturityLevel={plant.maturity_level}
            />
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
                  padding: "12px",
                  color: "#DEA4FC",
                  "&:active, &:focus": {
                    backgroundColor: "#332932", // Or any other style reset
                  },
                }}
                onClick={() => handleToggleGeneticMarkerProduction()}
              >
                <Sugar amount={geneticMarkerThreshold} />
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
                value={-1}
                onClick={() => toggleMultiplier(-1)}
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
            <LeafTooltip leafWaterUsage={plant.leafWaterUsage}>
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
                }}
                onClick={() => handleBuyLeaves()}
              >
                {multiplier > 1000 ? (
                  "Grow Max Leaves"
                ) : (
                  <>
                    Grow Leaves:{" "}
                    {multiplier === -1 ? (
                      <Leaves
                        amount={
                          plantState.type === "Succulent"
                            ? getHalfAffordableLeavesSucculent(
                                plantState,
                                LEAF_COST
                              )
                            : getHalfAffordableLeaves(plantState, LEAF_COST)
                        }
                      />
                    ) : (
                      <Leaves amount={multiplier} />
                    )}
                  </>
                )}
                {multiplier <= 1000 && (
                  <>
                    {" "}
                    &nbsp;for{" "}
                    <Sugar
                      amount={
                        LEAF_COST *
                        (multiplier === -1
                          ? getHalfAffordableLeaves(plantState, LEAF_COST)
                          : multiplier)
                      }
                    />
                  </>
                )}
              </Button>
            </LeafTooltip>
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
                    backgroundColor: "#363534",
                  },
                }}
                onClick={() => handleBuyRoots()}
              >
                {multiplier > 1000 ? (
                  "Grow Max Roots"
                ) : (
                  <>
                    Grow Roots:{" "}
                    {multiplier === -1 ? (
                      <Roots
                        amount={getHalfAffordableRoots(plantState, ROOT_COST)}
                      />
                    ) : (
                      <Roots amount={multiplier} />
                    )}
                  </>
                )}
                {multiplier <= 1000 && (
                  <>
                    {" "}
                    &nbsp;for{" "}
                    <Sugar
                      amount={
                        ROOT_COST *
                        (multiplier === -1
                          ? getHalfAffordableRoots(plantState, ROOT_COST)
                          : multiplier)
                      }
                    />
                  </>
                )}
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
                onClick={
                  rootRotConfirm ? handleClickOpen : handleRemoveAllWater
                }
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

  if (absValue >= 1e15) {
    // For numbers greater than or equal to a quadrillion, use scientific notation
    return value.toExponential(2);
  }

  // Use Intl.NumberFormat for other ranges for better precision and locale formatting
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let formattedValue;

  if (absValue >= 1e12) {
    formattedValue = formatter.format(absValue / 1e12) + "T";
  } else if (absValue >= 1e9) {
    formattedValue = formatter.format(absValue / 1e9) + "B";
  } else if (absValue >= 1e6) {
    formattedValue = formatter.format(absValue / 1e6) + "M";
  } else if (absValue >= 1e3) {
    formattedValue = formatter.format(absValue / 1e3) + "K";
  } else {
    formattedValue = formatter.format(absValue);
  }

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
