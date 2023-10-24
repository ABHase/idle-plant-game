import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { UPGRADES } from "../upgrades";
import { purchaseUpgrade } from "../Slices/upgradesSlice";
import { RootState } from "../rootReducer";
import { purchaseUpgradeThunk, sellUpgradeThunk } from "../gameActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { ButtonBase } from "@mui/material";
import { DNA } from "../Components/DNA";
import { StarRateOutlined } from "@mui/icons-material";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}
interface UpgradesProps {
  type: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const state = useSelector((state: RootState) => state.globalState);

  const purchased = useSelector((state: RootState) => state.upgrades.purchased);
  const geneticMarkers = useSelector(
    (state: RootState) => state.globalState.geneticMarkers
  );
  const geneticMarkersMoss = useSelector(
    (state: RootState) => state.globalState.geneticMarkersMoss
  );
  const geneticMarkersSucculent = useSelector(
    (state: RootState) => state.globalState.geneticMarkersSucculent
  );
  const geneticMarkersGrass = useSelector(
    (state: RootState) => state.globalState.geneticMarkersGrass
  );
  const plantType = useSelector((state: RootState) => state.plant.type);
  let amountToPass: number;
  switch (plantType) {
    case "Fern":
      amountToPass = geneticMarkers;
      break;
    case "Moss":
      amountToPass = geneticMarkersMoss;
      break;
    case "Succulent":
      amountToPass = geneticMarkersSucculent;
      break;
    case "Grass":
      amountToPass = geneticMarkersGrass;
      break;
    default:
      amountToPass = 0; // Default case, if needed
      break;
  }
  const metaUpgradesForPlant = UPGRADES["Meta"].filter((upgrade) =>
    upgrade.id.includes(plantType)
  );
  const specificUpgrades = UPGRADES[plantType];
  const availableUpgrades = [...metaUpgradesForPlant, ...specificUpgrades];

  const [totalDNA, setTotalDNA] = useState(0);

  // Function to calculate total DNA earned
  const calculateTotalDNA = () => {
    let total = 0;
    purchased.forEach((purchasedId) => {
      const foundUpgrade = availableUpgrades.find(
        (upgrade) => upgrade.id === purchasedId
      );
      if (foundUpgrade) {
        total += foundUpgrade.cost;
      }
    });

    setTotalDNA(amountToPass + total);
  };

  useEffect(() => {
    calculateTotalDNA();
  }, [
    purchased,
    state.geneticMarkers,
    state.geneticMarkersMoss,
    state.geneticMarkersSucculent,
    state.geneticMarkersGrass,
    plantType,
  ]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="upgrade-modal-title"
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
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: 3,
          boxShadow: 24,
          p: 1,
          display: "flex",
          flexDirection: "column",
          color: "text.primary",
        }}
      >
        {/* This is the header Box that won't scroll */}
        <Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{ borderBottom: "1px solid #ccc" }}
          >
            Available:
            <DNA amount={amountToPass} />
            Total Earned:
            <DNA amount={totalDNA} />
          </Box>
          <Typography id="upgrade-modal-title" variant="h6">
            Traits for Future Seeds:
          </Typography>
          {/* You can add other header content here, like DNA count */}
        </Box>

        {/* This Box will be scrollable and contains all the upgrades */}
        <Box
          sx={{
            overflow: "auto",
            flexGrow: 1,
            color: "text.primary",
          }}
        >
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
                textAlign: "left",
                mt: 2,
                p: 1,
                bgcolor: purchased.includes(upgrade.id)
                  ? "primary.light"
                  : "background.default",
                "&:hover": {
                  bgcolor: "#38200f",
                  color: "text.primary",
                },
              }}
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
      </Box>
    </Modal>
  );
};

export default UpgradeModal;
