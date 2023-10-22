import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UPGRADES } from "./upgrades";
import { RootState } from "./rootReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { ButtonBase } from "@mui/material";
import { DNA } from "./Components/DNA";
import { purchaseUpgradeThunk, sellUpgradeThunk } from "./gameActions";

interface UpgradeStoreDesktopDisplayProps {
  onPlantSeed: () => void;
}

const UpgradeStoreDesktopDisplay: React.FC<UpgradeStoreDesktopDisplayProps> = ({
  onPlantSeed,
}) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const purchased = useSelector((state: RootState) => state.upgrades.purchased);
  const state = useSelector((state: RootState) => state.globalState);
  const plantType = useSelector((state: RootState) => state.plant.type);

  // Map plantType to geneticMarkers property
  const geneticMarkersKey = (
    plantType === "Fern" ? "geneticMarkers" : `geneticMarkers${plantType}`
  ) as keyof typeof state;
  const geneticMarkers = state[geneticMarkersKey];

  const metaUpgradesForPlant = UPGRADES["Meta"].filter((upgrade) =>
    upgrade.id.includes(plantType)
  );
  const specificUpgrades = UPGRADES[plantType];
  const availableUpgrades = [...metaUpgradesForPlant, ...specificUpgrades];

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
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography id="upgrade-store-title" variant="h6">
          Traits for Future Seeds:
        </Typography>
        {/* Plant Seed Button */}
        <Button variant="contained" color="primary" onClick={onPlantSeed}>
          Plant Seed
        </Button>
      </Box>
      {availableUpgrades.map((upgrade) => (
        <ButtonBase
          key={upgrade.id}
          onClick={() => {
            const actionData = {
              plantType: plantType,
              upgradeId: upgrade.id,
            };
            if (purchased.includes(upgrade.id)) {
              dispatch(sellUpgradeThunk(actionData));
            } else {
              dispatch(purchaseUpgradeThunk(actionData));
            }
          }}
          sx={{
            width: "100%",
            display: "block",
            borderRadius: 2,
            border: "1px solid #ccc",
            textAlign: "left",
            mt: 2,
            p: 1,
            bgcolor: purchased.includes(upgrade.id)
              ? "#4d2d17"
              : "secondary.main",
            pointerEvents:
              !purchased.includes(upgrade.id) && geneticMarkers < upgrade.cost
                ? "none"
                : "auto",

            opacity: geneticMarkers < upgrade.cost ? 0.5 : 1,
            "&:hover": {
              bgcolor:
                geneticMarkers < upgrade.cost ? "secondary.light" : "#38200f",
              color: "text.primary",
            },
          }}
          disabled={
            !purchased.includes(upgrade.id) && geneticMarkers < upgrade.cost
          }
        >
          <Box>
            <Typography variant="body1">{upgrade.name}</Typography>
            <Typography variant="body2" sx={{ display: "flex" }}>
              Cost: <DNA amount={upgrade.cost} />
            </Typography>
            <Typography variant="body2">{upgrade.description}</Typography>
            <Typography variant="body2" fontWeight="bold">
              {purchased.includes(upgrade.id) ? "Sell" : "Buy"}
            </Typography>
          </Box>
        </ButtonBase>
      ))}
    </Box>
  );
};

export default UpgradeStoreDesktopDisplay;
