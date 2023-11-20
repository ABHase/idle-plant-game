// ConfirmEvolveDialog.tsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { RootState } from "./rootReducer";
import { UPGRADES } from "./upgrades";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { DNAIcon } from "./icons/dna";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import { deductTimeSeed, setDifficulty } from "./Slices/gameStateSlice";
import { Water } from "./Components/Water";
import { Sunlight } from "./Components/Sunlight";
import { useTraits } from "./TraitsContext";

interface ConfirmEvolveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (plantType: string, selectedTraits: string[]) => void;
}

const ConfirmEvolveDialog: React.FC<ConfirmEvolveDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const dispatch = useDispatch();

  const purchased = useSelector((state: RootState) => state.upgrades.purchased);

  const timeSeeds = useSelector((state: RootState) => state.globalState.seeds);

  const currentPlantType = useSelector((state: RootState) => state.plant.type);

  const {
    selectedTraits,
    setSelectedTraits,
    unselectedTraits,
    setUnselectedTraits,
  } = useTraits();

  const [traitKeys, setTraitKeys] = React.useState<Map<string, number>>(
    new Map()
  );

  const [plantType, setPlantType] = React.useState<string>(currentPlantType);

  React.useEffect(() => {
    if (open) {
      // Start with all purchased traits

      // Creating a new set to track which traits have been added
      const uniqueTraitsSet = new Set();

      // Transforming 'purchased' to an array of unique traits
      const uniqueTraits = purchased.map((id, index) => {
        // If the id already exists, append an index to make it unique
        const uniqueId = uniqueTraitsSet.has(id) ? `${id}-${index}` : id;
        uniqueTraitsSet.add(uniqueId);
        return uniqueId;
      });

      let initialSelected = uniqueTraits;
      // Remove any that have been unselected
      initialSelected = initialSelected.filter(
        (trait) => !unselectedTraits.includes(trait)
      );

      // Updating state with unique traits
      setSelectedTraits(initialSelected);

      // Initializing traitKeys with the unique traits as keys
      const newTraitKeys = new Map(
        uniqueTraits.map((id, index) => [id, index])
      );
      setTraitKeys(newTraitKeys);

      // Default plantType logic
      const defaultPlantType =
        currentPlantType === "Vine" && timeSeeds === 0
          ? "Fern"
          : currentPlantType;
      setPlantType(defaultPlantType);

      // If the plantType is 'Vine', we also need to set local difficulty
      if (defaultPlantType === "Vine") {
        setLocalDifficulty(1);
      }
    }
  }, [open, purchased, currentPlantType, timeSeeds]);

  const typeSpecificUpgrades = UPGRADES[plantType];
  const columnUpgrades = UPGRADES["Column"];
  const adjacencyUpgrades = UPGRADES["Adjacency"];
  const metaUpgrades = UPGRADES["Meta"];
  const combinedUpgrades = [
    ...columnUpgrades,
    ...adjacencyUpgrades,
    ...metaUpgrades,
    ...typeSpecificUpgrades,
  ];

  const handlePlantTypeChange = (type: string) => {
    setPlantType(type);
  };

  const currentDifficulty = useSelector(
    (state: RootState) => state.globalState.difficulty
  );
  const [localDifficulty, setLocalDifficulty] =
    React.useState<number>(currentDifficulty);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setLocalDifficulty(value);
  };

  const toggleTrait = (uniqueId: string) => {
    setSelectedTraits((prevTraits) => {
      let newSelectedTraits;
      if (prevTraits.includes(uniqueId)) {
        newSelectedTraits = prevTraits.filter((id) => id !== uniqueId);
        setUnselectedTraits((prevUnselected) => [...prevUnselected, uniqueId]);
      } else {
        newSelectedTraits = [...prevTraits, uniqueId];
        setUnselectedTraits((prevUnselected) =>
          prevUnselected.filter((id) => id !== uniqueId)
        );
      }
      return newSelectedTraits;
    });
  };

  const handleConfirm = () => {
    // Map the unique identifiers back to the original trait ids
    const confirmedTraits = selectedTraits.map((uniqueId) => {
      const [originalId] = uniqueId.split("-");
      return originalId;
    });

    if (plantType === "Vine") {
      deductSeed();
    }

    dispatch(setDifficulty({ difficulty: localDifficulty }));

    onConfirm(plantType, confirmedTraits);

    onClose();
  };

  const deductSeed = () => {
    if (plantType === "Vine" && timeSeeds > 0) {
      // Dispatch the action to deduct one time seed here
      dispatch(deductTimeSeed());
    }
  };

  useEffect(() => {
    if (plantType === "Vine") {
      setLocalDifficulty(1);
    }
  }, [plantType]);

  const calculateColor = (value: number) => {
    // Calculate red based on value, where value=1 is white and value=100 is red
    const red = Math.round((255 * (value - 1)) / 99);
    const greenAndBlue = 255 - red;

    return `rgb(${red}, ${greenAndBlue}, ${greenAndBlue})`;
  };

  const thumbColor = calculateColor(localDifficulty);
  const trackColor = calculateColor(localDifficulty);
  const railColor = "rgba(255, 255, 255, 0.5)";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: 12,
          border: "4px solid #2a6628",
        },
      }}
    >
      <DialogTitle>
        <span>Evolve Plant?</span>
        {timeSeeds > 0 && (
          <span style={{ fontWeight: "normal", fontSize: "inherit" }}>
            {` - Time Seeds: ${timeSeeds}`}
          </span>
        )}
      </DialogTitle>

      <DialogContent
        style={{
          overflowY: "auto",
          borderRadius: 12,
          marginBottom: 0,
        }}
      >
        <>
          {plantType !== "Vine" && (
            <>
              <DialogContentText sx={{ color: "white" }}>
                Difficulty: {localDifficulty} - Higher rates produce Time
                Resources Faster! Current Bonus:{` `}
                {Math.floor(localDifficulty / 10) + 1}X
              </DialogContentText>
              <Slider
                value={localDifficulty}
                step={10}
                marks
                min={1}
                max={100}
                valueLabelDisplay="auto"
                onChange={handleSliderChange}
                sx={{
                  "& .MuiSlider-thumb": {
                    backgroundColor: thumbColor, // Use the calculated color for the thumb
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: trackColor, // Use the calculated color for the track
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: railColor, // Use static color for the rail
                  },
                }}
              />
            </>
          )}

          <DialogContentText>
            Are you sure you want to plant a new seed, <DNAIcon /> DNA progress
            is unique to each plant type and will not be reset with plant
            resources. This action cannot be undone.
          </DialogContentText>
        </>
        <DialogContentText>
          Choose the type of plant to evolve to:
        </DialogContentText>
        <Select
          value={plantType}
          onChange={(e) => handlePlantTypeChange(e.target.value as string)}
          fullWidth
          sx={{
            color: "white",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(228, 219, 233, 0.25)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(228, 219, 233, 0.25)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(228, 219, 233, 0.25)",
            },
            ".MuiSvgIcon-root ": {
              fill: "white !important",
            },
          }}
        >
          <MenuItem value="Fern">Fern</MenuItem>
          <MenuItem value="Moss">Moss</MenuItem>
          <MenuItem value="Succulent">Succulent</MenuItem>
          <MenuItem value="Grass">Grass</MenuItem>
          <MenuItem value="Bush">Berry Bush</MenuItem>
          {timeSeeds > 0 && <MenuItem value="Vine">Time Vine</MenuItem>}
        </Select>

        {plantType === "Vine" && (
          <Box
            sx={{
              display: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <DialogContentText style={{ color: "red" }}>
              Warning: Evolving into a Time Vine will cost one Time Seed!
            </DialogContentText>
            <DialogContentText style={{ color: "red" }}>
              Time Vine Starts with <Water amount={10000} />{" "}
              <Sunlight amount={10000} />
            </DialogContentText>
            <DialogContentText style={{ color: "red" }}>
              Time Vine CAN NOT Produce More Water or Sunlight!
            </DialogContentText>
          </Box>
        )}
        <DialogContentText>
          Will start a new {plantType} with the following traits:
        </DialogContentText>
        {Array.from(traitKeys.keys()).map((uniqueId) => {
          const index = traitKeys.get(uniqueId);
          const id = typeof index === "number" ? purchased[index] : null;
          const trait = id
            ? combinedUpgrades.find((upgrade) => upgrade.id === id)
            : null;
          if (!trait) return null;
          return (
            <Box
              key={uniqueId} // Use uniqueId for key
              sx={{
                border: "1px solid white",
                borderRadius: 1,
                padding: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTraits.includes(uniqueId)} // Check if the uniqueId is in the selectedTraits
                    onChange={() => toggleTrait(uniqueId)} // Pass the uniqueId to the toggle function
                    name={trait.name}
                  />
                }
                label={`${trait.name} (${trait.description})`}
              />
            </Box>
          );
        })}
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
          onClick={handleConfirm}
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
