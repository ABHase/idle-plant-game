import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  DESERT_MUSHROOM_ITEMS,
  GRASS_MUSHROOM_ITEMS,
  LICHEN_MUSHROOM_ITEMS,
  MUSHROOM_ITEMS,
  MushroomItem,
} from "./mushroomItems";
import { RootState } from "./rootReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Sugar } from "./Components/Sugar";
import { Sunlight } from "./Components/Sunlight";
import {
  ButtonBase,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { Water } from "./Components/Water";
import { formatTime } from "./PlantDisplays/BushDisplay";
import { DNA } from "./Components/DNA";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { Flower } from "./Components/Flower";

const getCostType = (item: MushroomItem): string => {
  switch (item.id) {
    case "desert_night":
    case "desert_night_2":
    case "shade_for_sugar":
    case "shade_for_sugar_2":
      return "sunlight";
    case "desert_rain":
    case "desert_rain_2":
    case "moss_rain":
      return "water";
    default:
      return "sugar";
  }
};

const MushroomStoreDesktopDisplay = () => {
  const buttonBaseStyle = (resource: number, itemCost: number) => ({
    width: "100%",
    display: "block",
    borderRadius: 2,
    border: "1px solid #ccc",
    textAlign: "left",
    mt: 2,
    p: 1,
    bgcolor: resource < itemCost ? "secondary.light" : "secondary.main",
    pointerEvents: resource < itemCost ? "none" : "auto",
    opacity: resource < itemCost ? 0.5 : 1,
    "&:hover": {
      bgcolor: resource < itemCost ? "secondary.light" : "#38200f",
      color: "text.primary",
    },
  });
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const plant = useSelector((state: RootState) => state.plant);
  const sugar = useSelector((state: RootState) => state.plant.sugar);
  const sunlight = useSelector((state: RootState) => state.plant.sunlight);
  const water = useSelector((state: RootState) => state.plant.water);
  const lichenStore = useSelector(
    (state: RootState) => state.plant.lichenStoreAvailable
  );
  const currentState = useSelector((state: RootState) => state); // Retrieve the whole state here
  const [showWarning, setShowWarning] = React.useState(false);

  const handleButtonClick = (
    resource: number,
    itemCost: number,
    itemEffect: any
  ) => {
    if (resource >= itemCost) {
      handlePurchase(itemEffect);
    }
  };

  const handlePurchase = (itemEffect: any) => {
    itemEffect(dispatch, () => currentState);
    setShowWarning(true); // Show the warning after making a purchase
  };

  const plantType = useSelector((state: RootState) => state.plant.type); // Extract plant type

  const renderContent = () => {
    switch (plantType) {
      case "Fern":
        return MUSHROOM_ITEMS.map((item) => (
          <ButtonBase
            onClick={() => handleButtonClick(sugar, item.cost, item.effect)}
            sx={buttonBaseStyle(sugar, item.cost)}
          >
            <Box key={item.id} mt={2}>
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="body2">{item.description}</Typography>
              <Typography variant="body2" sx={{ display: "flex" }}>
                Cost: <Sugar amount={item.cost} />
              </Typography>
              <Snackbar
                open={showWarning}
                autoHideDuration={3000}
                onClose={() => setShowWarning(false)}
              >
                <Alert
                  onClose={() => setShowWarning(false)}
                  severity="warning"
                  sx={{ width: "100%" }}
                >
                  Watch your Root Rot!
                </Alert>
              </Snackbar>
            </Box>
          </ButtonBase>
        ));
      case "Moss":
        // Check if the lichen store is available
        if (lichenStore) {
          return (
            <>
              <Typography mt={2}>The Lichen</Typography>
              {LICHEN_MUSHROOM_ITEMS.map((item) => {
                const costType = getCostType(item);
                return (
                  <ButtonBase
                    key={item.id}
                    onClick={() => {
                      switch (costType) {
                        case "sunlight":
                          handleButtonClick(sunlight, item.cost, item.effect);
                          break;
                        case "water":
                          handleButtonClick(water, item.cost, item.effect);
                          break;
                        default:
                          handleButtonClick(sugar, item.cost, item.effect);
                          break;
                      }
                    }}
                    sx={buttonBaseStyle(
                      costType === "sunlight"
                        ? sunlight
                        : costType === "water"
                        ? water
                        : sugar,
                      item.cost
                    )}
                  >
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    <Typography variant="body2" sx={{ display: "flex" }}>
                      Cost:
                      {costType === "sunlight" && (
                        <Sunlight amount={item.cost} />
                      )}
                      {costType === "water" && <Water amount={item.cost} />}
                      {costType === "sugar" && <Sugar amount={item.cost} />}
                    </Typography>
                  </ButtonBase>
                );
              })}
            </>
          );
        } else {
          return (
            <Typography mt={2}>
              No inventory available for Moss. Check back when you've unlocked
              the Lichen trait!
            </Typography>
          );
        }

      case "Succulent":
        return DESERT_MUSHROOM_ITEMS.map((item) => {
          const costType = getCostType(item);
          return (
            <ButtonBase
              key={item.id}
              onClick={() => {
                switch (costType) {
                  case "sunlight":
                    handleButtonClick(sunlight, item.cost, item.effect);
                    break;
                  case "water":
                    handleButtonClick(water, item.cost, item.effect);
                    break;
                  default:
                    handleButtonClick(sugar, item.cost, item.effect);
                    break;
                }
              }}
              sx={buttonBaseStyle(
                costType === "sunlight"
                  ? sunlight
                  : costType === "water"
                  ? water
                  : sugar,
                item.cost
              )}
            >
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="body2">{item.description}</Typography>
              <Typography variant="body2" sx={{ display: "flex" }}>
                Cost:
                {costType === "sunlight" && <Sunlight amount={item.cost} />}
                {costType === "water" && <Water amount={item.cost} />}
                {costType === "sugar" && <Sugar amount={item.cost} />}
              </Typography>
            </ButtonBase>
          );
        });

      case "Grass":
        return (
          <>
            <Typography mt={2}>The Flame</Typography>
            {GRASS_MUSHROOM_ITEMS.map((item) => (
              <ButtonBase
                onClick={() =>
                  handleButtonClick(sunlight, item.cost, item.effect)
                }
                sx={buttonBaseStyle(sunlight, item.cost)}
              >
                <Box key={item.id} mt={2}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="body2" sx={{ display: "flex" }}>
                    Cost: <Sunlight amount={item.cost} />
                  </Typography>
                </Box>
              </ButtonBase>
            ))}
          </>
        );

      case "Bush":
        return (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "left" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                }}
              >
                <Typography variant="h6">Flowers:</Typography>
                <Typography variant="caption">
                  {plant.flowers.length} / 100
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}
              >
                {" "}
                {/* Added marginLeft for spacing */}
                <Water amount={plant.flowerWaterConsumptionRate} />
                /s per Flower
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}
              >
                {" "}
                {/* Added marginLeft for spacing */}
                <Sugar amount={plant.flowerSugarConsumptionRate} />
                /s per Flower
              </Box>
            </Box>

            <Box
              sx={{
                height: "auto",
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

                  const timeForWater = formatTime(remainingWater / 10);

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
          </Box>
        );

      default:
        // This can be a placeholder or remain empty until you have other plant types
        return null;
    }
  };

  // Similar logic as the modal but without modal wrapping.
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      bgcolor="background.default"
      color="text.primary"
      overflow="auto"
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      padding={1}
      margin="0 auto"
      width="auto"
    >
      {plantType !== "Bush" && (
        <Typography id="mushroom-store-modal-title" variant="h6">
          Mushroom Store:
        </Typography>
      )}
      {renderContent()}
    </Box>
  );
};

export default MushroomStoreDesktopDisplay;
