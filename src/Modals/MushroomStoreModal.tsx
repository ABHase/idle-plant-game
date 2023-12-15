import React, { useCallback, useEffect, useState } from "react";
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
} from "../mushroomItems";
import { RootState } from "../rootReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Sugar } from "../Components/Sugar";
import { Sunlight } from "../Components/Sunlight";
import { Water } from "../Components/Water";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

interface MushroomStoreModalProps {
  open: boolean;
  onClose: () => void;
}

const MushroomStoreModal: React.FC<MushroomStoreModalProps> = ({
  open,
  onClose,
}) => {
  const [currentMultiplier, setCurrentMultiplier] = useState(1);

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
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
    // Calculate the total cost based on the multiplier
    const totalCost = itemCost * currentMultiplier;

    // Check if the player can afford the total cost
    if (resource >= totalCost) {
      for (let i = 0; i < currentMultiplier; i++) {
        handlePurchase(itemEffect);
      }
    } else {
      // If the player cannot afford the total cost, purchase as many as possible
      const maxAffordable = Math.floor(resource / itemCost);
      for (let i = 0; i < maxAffordable; i++) {
        handlePurchase(itemEffect);
      }
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
          <Box key={item.id} mt={2}>
            <Typography variant="body1">{item.name}</Typography>
            <Typography variant="body2">{item.description}</Typography>
            <Typography variant="body2" sx={{ display: "flex" }}>
              Buying up to: {currentMultiplier}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex" }}>
              Cost: <Sugar amount={item.cost * currentMultiplier} />
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleButtonClick(sugar, item.cost, item.effect)}
              disabled={sugar < item.cost}
              sx={{
                bgcolor: "#b8732e",
                border: "1px solid #e8a766",
                "&.Mui-disabled": {
                  bgcolor: "secondary.light", // Disabled background color
                  color: "#6c6c6c", // Disabled text color
                  border: "1px solid #c0c0c0", // Disabled border color
                },
              }}
            >
              Buy
            </Button>
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
        ));
      case "Moss":
        if (lichenStore) {
          return (
            <>
              <Typography mt={2}>The Lichen</Typography>
              {LICHEN_MUSHROOM_ITEMS.map((item) => {
                const costType = getCostType(item);
                return (
                  <Box key={item.id} mt={2}>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    <Typography variant="body2" sx={{ display: "flex" }}>
                      Buying up to: {currentMultiplier}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex" }}>
                      Cost:
                      {costType === "sunlight" && (
                        <Sunlight amount={item.cost * currentMultiplier} />
                      )}
                      {costType === "water" && (
                        <Water amount={item.cost * currentMultiplier} />
                      )}
                      {costType === "sugar" && (
                        <Sugar amount={item.cost * currentMultiplier} />
                      )}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
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
                      disabled={
                        (costType === "sugar" && sugar < item.cost) ||
                        (costType === "sunlight" && sunlight < item.cost) ||
                        (costType === "water" && water < item.cost)
                      }
                      sx={{
                        bgcolor: "#b8732e",
                        border: "1px solid #e8a766",
                        "&.Mui-disabled": {
                          bgcolor: "secondary.light", // Disabled background color
                          color: "#6c6c6c", // Disabled text color
                          border: "1px solid #c0c0c0", // Disabled border color
                        },
                      }}
                    >
                      Buy
                    </Button>
                  </Box>
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
        return (
          <>
            <Typography mt={2}>
              Welcome to the Desert Mushroom Store, water available for sugar at
              a discount! Watch out for rabbits out there.
            </Typography>
            {DESERT_MUSHROOM_ITEMS.map((item) => {
              const costType = getCostType(item);
              return (
                <Box key={item.id} mt={2}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="body2" sx={{ display: "flex" }}>
                    Buying up to: {currentMultiplier}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex" }}>
                    Cost:
                    {costType === "sunlight" && (
                      <Sunlight amount={item.cost * currentMultiplier} />
                    )}
                    {costType === "water" && (
                      <Water amount={item.cost * currentMultiplier} />
                    )}
                    {costType === "sugar" && (
                      <Sugar amount={item.cost * currentMultiplier} />
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
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
                    disabled={
                      (costType === "sugar" && sugar < item.cost) ||
                      (costType === "sunlight" && sunlight < item.cost) ||
                      (costType === "water" && water < item.cost)
                    }
                    sx={{
                      bgcolor: "#b8732e",
                      border: "1px solid #e8a766",
                      "&.Mui-disabled": {
                        bgcolor: "secondary.light", // Disabled background color
                        color: "#6c6c6c", // Disabled text color
                        border: "1px solid #c0c0c0", // Disabled border color
                      },
                    }}
                  >
                    Buy
                  </Button>
                </Box>
              );
            })}
          </>
        );
      case "Grass":
        return (
          <>
            <Typography mt={2}>The Fire</Typography>
            {GRASS_MUSHROOM_ITEMS.map((item) => (
              <Box key={item.id} mt={2}>
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body2">{item.description}</Typography>
                <Typography variant="body2" sx={{ display: "flex" }}>
                  Cost: <Sunlight amount={item.cost} />
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePurchase(item.effect)}
                  disabled={sunlight < item.cost}
                  sx={{
                    bgcolor: "#b8732e",
                    border: "1px solid #e8a766",
                    "&.Mui-disabled": {
                      bgcolor: "secondary.light", // Disabled background color
                      color: "#6c6c6c", // Disabled text color
                      border: "1px solid #c0c0c0", // Disabled border color
                    },
                  }}
                >
                  Buy
                </Button>
              </Box>
            ))}
          </>
        );

      default:
        // This can be a placeholder or remain empty until you have other plant types
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="mushroom-store-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          maxWidth: "80%",
          maxHeight: "80%",
          bgcolor: "#3b0a01",
          border: "4px solid #857471",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          overflow: "auto",
          color: "text.primary",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 8, // Adjust this value as needed
            right: 8, // Adjust this value as needed
            color: (theme) => theme.palette.grey[500],
            border: "1px solid #857471",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, my: 4 }}>
          <Typography id="mushroom-store-modal-title" variant="h6">
            Mushroom Store:
          </Typography>

          {plantType !== "Grass" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                Multiplier:
              </Typography>
              <Select
                labelId="multiplier-select-label"
                id="multiplier-select"
                value={currentMultiplier}
                label="Multiplier"
                onChange={(e) => setCurrentMultiplier(Number(e.target.value))}
                sx={{ mr: 1, border: "1px solid #857471" }}
              >
                {[1, 5, 10, 50, 100].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Box>

        {renderContent()}
      </Box>
    </Modal>
  );
};

export default MushroomStoreModal;
