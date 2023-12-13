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
  buyNeedles,
  toggleLeafGrowth,
  toggleRootGrowth,
  setMaxResourceToSpend,
} from "../Slices/plantSlice";
import {
  Grid,
  Typography,
  Button,
  Divider,
  Tooltip,
  Box,
  TextField,
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
  getHalfAffordableNeedles,
  getHalfAffordableRoots,
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
import MusicPlayer from "../Components/MusicPlayer";
import springSong from "../assets/music/Spring_-_Succulent.mp3";
import summerSong from "../assets/music/Summer_-_Succulent.mp3";
import autumnSong from "../assets/music/Autumn_-_Succulent.mp3";
import winterSong from "../assets/music/Winter_-_Succulent.mp3";
import SugarProductionRate from "../Components/Tooltips/SugarProductionRate";

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

  ///

  const paused = useSelector((state: RootState) => state.app.paused);

  const { geneticMarkerThresholdSucculent } = useSelector(
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

  const handleBuyNeedles = () => {
    const actualMultiplier =
      multiplier === -1
        ? getHalfAffordableNeedles(plantState, plantState.maturity_level)
        : multiplier;
    dispatch(
      buyNeedles({
        cost: plantState.maturity_level * 100,
        multiplier: actualMultiplier,
      })
    );
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
            {/* Music Player Component */}
            <MusicPlayer song={songToPlay} />
          </Grid>

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
                <Sugar
                  amount={
                    plant.geneticMarkerUpgradeActive
                      ? geneticMarkerThresholdSucculent * 4
                      : geneticMarkerThresholdSucculent
                  }
                />{" "}
                <ArrowForwardIcon
                  sx={{
                    color: plant.is_genetic_marker_production_on ? "" : "red",
                  }}
                />{" "}
                <DNA amount={plant.geneticMarkerUpgradeActive ? 2 : 1} />{" "}
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
            waterCost={LEAF_COST * 100}
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
            <Tooltip title="Grow Leaves">
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
                    Leaves:{" "}
                    <Leaves
                      amount={
                        multiplier === -1
                          ? plantState.type === "Succulent"
                            ? getHalfAffordableLeavesSucculent(
                                plantState,
                                LEAF_COST
                              )
                            : getHalfAffordableLeaves(plantState, LEAF_COST)
                          : multiplier
                      }
                    />
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
                          ? plantState.type === "Succulent"
                            ? getHalfAffordableLeavesSucculent(
                                plantState,
                                LEAF_COST
                              )
                            : getHalfAffordableLeaves(plantState, LEAF_COST)
                          : multiplier)
                      }
                    />{" "}
                    {plantState.type === "Succulent" && multiplier !== -1 && (
                      <Water amount={LEAF_COST * multiplier * 100} />
                    )}
                    {plantState.type === "Succulent" && multiplier === -1 && (
                      <Water
                        amount={
                          getHalfAffordableLeavesSucculent(
                            plantState,
                            LEAF_COST
                          ) *
                          LEAF_COST *
                          100
                        }
                      />
                    )}
                  </>
                )}
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
          {/* Needles Section */}
          <Grid
            item
            xs={12}
            sx={{
              visibility: isSugarUpgradesUnlocked(plant) ? "visible" : "hidden",
            }}
          >
            {/* Needles Section */}
            <Grid
              item
              xs={12}
              sx={{
                visibility: isSugarUpgradesUnlocked(plant)
                  ? "visible"
                  : "hidden",
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
                      backgroundColor: "#252b36",
                    },
                    "&.Mui-disabled": {
                      color: "#d0d4db",
                      opacity: 1, // This resets the reduced opacity of the disabled button.
                    },
                  }}
                  onClick={() => handleBuyNeedles()}
                  disabled={plant.rabbitImmunity}
                >
                  {plant.rabbitImmunity ? (
                    "Rabbits are afraid of your needles!"
                  ) : multiplier > 1000 ? (
                    "Grow Max Needles"
                  ) : (
                    <>
                      Grow Needles:{" "}
                      {multiplier === -1
                        ? getHalfAffordableNeedles(
                            plantState,
                            plantState.maturity_level
                          )
                        : multiplier}
                      &nbsp;for{" "}
                      <Sugar
                        amount={
                          plantState.maturity_level *
                          100 *
                          (multiplier === -1
                            ? getHalfAffordableNeedles(
                                plantState,
                                plantState.maturity_level
                              )
                            : multiplier)
                        }
                      />
                    </>
                  )}
                </Button>
              </Tooltip>
            </Grid>
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
