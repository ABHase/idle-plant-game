// ConfirmEvolveDialog.tsx

import React from "react";
import { useSelector, useDispatch } from "react-redux"; // <-- Add this import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { RootState } from "./rootReducer"; // <-- Add this import
import { UPGRADES } from "./upgrades"; // <-- Add this import
import { Typography } from "@mui/material";
import { DNAIcon } from "./icons/dna";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DNA } from "./Components/DNA";
import Slider from "@mui/material/Slider";
import { setDifficulty } from "./Slices/gameStateSlice"; // Replace this with your actual import

interface ConfirmEvolveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (plantType: string) => void;
}

const ConfirmEvolveDialog: React.FC<ConfirmEvolveDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const purchased = useSelector((state: RootState) => state.upgrades.purchased);
  const geneticMarkers = useSelector(
    (state: RootState) => state.globalState.geneticMarkers
  );
  const geneticMarkersMoss = useSelector(
    (state: RootState) => state.globalState.geneticMarkersMoss
  );
  const currentPlantType = useSelector((state: RootState) => state.plant.type);
  const [plantType, setPlantType] = React.useState<string>(currentPlantType); // default value as Fern

  const typeSpecificUpgrades = UPGRADES[plantType];
  const metaUpgrades = UPGRADES["Meta"];
  const combinedUpgrades = [...metaUpgrades, ...typeSpecificUpgrades];

  const handlePlantTypeChange = (type: string) => {
    setPlantType(type);
  };

  const dispatch = useDispatch();
  const currentDifficulty = useSelector(
    (state: RootState) => state.globalState.difficulty
  );
  const [localDifficulty, setLocalDifficulty] =
    React.useState<number>(currentDifficulty);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setLocalDifficulty(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: 12,
          border: "1px solid white",
        },
      }}
    >
      <DialogTitle>{"Evolve Plant?"}</DialogTitle>
      <DialogContent style={{ overflowY: "auto" }}>
        <DialogContentText>
          Are you sure you want to plant a new seed, <DNAIcon /> DNA progress is
          unique to each plant type and will not be reset with plant resources.
          This action cannot be undone.
        </DialogContentText>
        <DialogContentText>
          Choose the type of plant to evolve to:
        </DialogContentText>
        <Select
          value={plantType}
          onChange={(e) => handlePlantTypeChange(e.target.value as string)}
          fullWidth
        >
          <MenuItem value="Fern">Fern</MenuItem>
          <MenuItem value="Moss">Moss</MenuItem>
          <MenuItem value="Succulent">Succulent</MenuItem>
          <MenuItem value="Grass">Grass</MenuItem>
          <MenuItem value="Bush">Bush</MenuItem>
        </Select>
        <DialogContentText>
          Will start a new {plantType} with the following traits:
        </DialogContentText>
        {purchased.map((id) => {
          const trait = combinedUpgrades.find((upgrade) => upgrade.id === id);
          if (!trait) return null; // Don't render anything if trait is not found
          return (
            <Typography key={id} variant="body2">
              - {trait.name} ({trait.description})
            </Typography>
          );
        })}
        <div>Difficulty - Score if you achieve 1B Sugar</div>
        <Slider
          defaultValue={localDifficulty}
          step={1}
          marks
          min={1}
          max={100}
          valueLabelDisplay="auto"
          onChange={handleSliderChange}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          sx={{
            backgroundColor: "#090924",
            color: "#fff",
            borderRadius: 12,
            border: "1px solid white",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            dispatch(setDifficulty({ difficulty: localDifficulty }));
            onConfirm(plantType);
            onClose();
          }}
          color="primary"
          sx={{
            backgroundColor: "#090924",
            color: "#fff",
            borderRadius: 12,
            border: "1px solid white",
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmEvolveDialog;
