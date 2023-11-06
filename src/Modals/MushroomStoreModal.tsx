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
} from "../mushroomItems";
import { RootState } from "../rootReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Sugar } from "../Components/Sugar";
import { Sunlight } from "../Components/Sunlight";
import { Water } from "../Components/Water";

const getCostType = (item: MushroomItem): string => {
  if (item.id === "desert_night") return "sunlight";
  if (item.id === "desert_night_2") return "sunlight";
  if (item.id === "desert_rain") return "water";
  if (item.id === "desert_rain_2") return "water";
  return "sugar";
};

interface MushroomStoreModalProps {
  open: boolean;
  onClose: () => void;
}

const MushroomStoreModal: React.FC<MushroomStoreModalProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const sugar = useSelector((state: RootState) => state.plant.sugar);
  const sunlight = useSelector((state: RootState) => state.plant.sunlight);
  const water = useSelector((state: RootState) => state.plant.water);
  const lichenStore = useSelector(
    (state: RootState) => state.plant.lichenStoreAvailable
  );
  const currentState = useSelector((state: RootState) => state); // Retrieve the whole state here
  const [showWarning, setShowWarning] = React.useState(false);

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
              Cost: <Sugar amount={item.cost} />
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePurchase(item.effect)}
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
        // Display the below if the lichen store is available otherwise display "No inventory available for Moss.  Check back later!"
        if (lichenStore) {
          return (
            <>
              <Typography mt={2}>The Lichen</Typography>
              {LICHEN_MUSHROOM_ITEMS.map((item) => (
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
                    Cost:
                    {costType === "sunlight" && <Sunlight amount={item.cost} />}
                    {costType === "water" && <Water amount={item.cost} />}
                    {costType === "sugar" && <Sugar amount={item.cost} />}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePurchase(item.effect)}
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
            <Typography mt={2}>The Lichen</Typography>
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
        <Typography id="mushroom-store-modal-title" variant="h6">
          Mushroom Store:
        </Typography>
        {renderContent()}
      </Box>
    </Modal>
  );
};

export default MushroomStoreModal;
