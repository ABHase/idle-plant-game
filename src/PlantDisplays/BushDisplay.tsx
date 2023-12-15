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
  buyFlower,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Add, ArrowForwardIos, Clear } from "@mui/icons-material";
import { FLOWER_COST, LEAF_COST, ROOT_COST } from "../constants";
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
  getHalfAffordableFlowers,
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
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { Flower } from "../Components/Flower";
import springSong from "../assets/music/Spring_-_Berry_Bush.mp3";
import summerSong from "../assets/music/Summer_-_Berry_Bush.mp3";
import autumnSong from "../assets/music/Autumn_-_Berry_Bush.mp3";
import winterSong from "../assets/music/Winter_-_Berry_Bush.mp3";
import MusicPlayer from "../Components/MusicPlayer";
import SugarProductionRate from "../Components/Tooltips/SugarProductionRate";
import Jukebox from "../Components/Jukebox";

type BushDisplayProps = {
  handleOpenModal: (modalName: string) => void;
  modalName: string;
  isMobile: boolean;
};

const BushDisplay: React.FC<BushDisplayProps> = ({
  handleOpenModal,
  modalName,
  isMobile,
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

  const jukeboxUnlocked = useSelector(
    (state: RootState) => state.app.jukeboxUnlocked
  );

  const timeScale =
    globalBoostedTicks > 1000 ? 200 : globalBoostedTicks > 0 ? 40 : 1;

  // Extract season from state (Assuming you have access to the state here)
  const { season } = useSelector((state: RootState) => state.plantTime);
  const songSeason = useSelector((state: RootState) => state.plantTime.season);
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

  const handleBuyFlower = () => {
    const actualMultiplier =
      multiplier === -1
        ? getHalfAffordableFlowers(plantState, FLOWER_COST)
        : Math.min(multiplier, 100); // Caps the multiplier at 100 for regular purchases
    dispatch(buyFlower(FLOWER_COST, actualMultiplier));
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
            xs={12}
            sx={{
              visibility: isGeneticMarkerUpgradeUnlocked(plant)
                ? "visible"
                : "hidden",
            }}
          >
            <Button
              fullWidth
              sx={{
                border: "1px solid #aaa",
                borderRadius: "4px",
                backgroundColor: "#332932",
                color: "#DEA4FC",
                "&:active, &:focus": {
                  backgroundColor: "#332932",
                },
              }}
              onClick={() => handleBuyFlower()}
            >
              <Sugar
                amount={
                  FLOWER_COST *
                  (multiplier === -1
                    ? getHalfAffordableFlowers(plantState, FLOWER_COST)
                    : Math.min(multiplier, 100))
                }
              />
              <ArrowForwardIcon sx={{ color: "green" }} />
              <Flower
                amount={
                  multiplier === -1
                    ? getHalfAffordableFlowers(plantState, FLOWER_COST)
                    : Math.min(multiplier, 100)
                }
              />
            </Button>
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

          {isMobile && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                <Box sx={{ display: "column", justifyContent: "left" }}>
                  <Typography variant="h6">Flowers:</Typography>
                  <Typography variant="caption">
                    {plant.flowers.length} / 100
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "left" }}>
                  <Water amount={plant.flowerWaterConsumptionRate} />
                  /s per Flower
                </Box>
                <Box sx={{ display: "flex", justifyContent: "left" }}>
                  <Sugar amount={plant.flowerSugarConsumptionRate} />
                  /s per Flower
                </Box>
              </Box>
              <Box
                sx={{
                  height: "140px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                <List>
                  {plant.flowers.map((flower, index) => {
                    const remainingWater =
                      plant.flowerWaterThreshold - flower.water;
                    const remainingSugar =
                      plant.flowerSugarThreshold - flower.sugar;

                    const timeForWater = formatTime(
                      remainingWater / plant.flowerWaterConsumptionRate
                    );
                    const timeForSugar = formatTime(
                      remainingSugar / plant.flowerSugarConsumptionRate
                    );

                    return (
                      <ListItem
                        key={index}
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          marginBottom: "4px",
                        }}
                      >
                        <ListItemIcon style={{ color: "white" }}>
                          <LocalFloristIcon style={{ color: flower.color }} />
                          <DNA amount={plant.flowerDNA} />
                        </ListItemIcon>

                        <Box sx={{ width: "100%", marginLeft: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (flower.water / plant.flowerWaterThreshold) * 100
                            }
                          />
                          <Typography variant="caption">
                            {timeForWater}
                          </Typography>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </Grid>
          )}
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
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + "B";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "K";
  } else {
    return value.toFixed(2);
  }
}

export function formatTime(seconds: number) {
  // Ensure seconds is never negative
  const positiveSeconds = Math.max(0, seconds);

  const hours = Math.floor(positiveSeconds / 3600);
  const minutes = Math.floor((positiveSeconds - hours * 3600) / 60);
  const secs = Math.round(positiveSeconds - hours * 3600 - minutes * 60);

  return (
    (hours ? hours + "h " : "") + (minutes ? minutes + "m " : "") + secs + "s"
  );
}

export default BushDisplay;
