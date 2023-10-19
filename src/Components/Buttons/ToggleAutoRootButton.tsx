import React from "react";
import { Button, Tooltip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Sugar } from "../Sugar";
import { Roots } from "../Roots";
import { Grid } from "@mui/material";
import { isSugarUpgradesUnlocked } from "../../formulas";
import { PlantState } from "../../Slices/plantSlice";

interface ToggleButtonProps {
  isOn: boolean;
  onClick: () => void;
  rootCost: number;
  multiplier: number;
  isVisible: boolean;
  plant: PlantState;
}

const ToggleAutoRootButton: React.FC<ToggleButtonProps> = ({
  isOn,
  onClick,
  rootCost,
  multiplier,
  isVisible,
  plant,
}) => {
  if (!isVisible) return null; // <-- If isVisible is false, render nothing

  return (
    <Grid
      item
      xs={12}
      sx={{
        visibility: isSugarUpgradesUnlocked(plant) ? "visible" : "hidden",
      }}
    >
      <Tooltip
        title={
          isOn
            ? "Turn off Automatic Root Production"
            : "Turn on Automatic Root Production"
        }
      >
        <Button
          fullWidth
          sx={{
            border: isOn ? "1px solid #ffffff" : "1px solid #aaa",
            borderRadius: "4px",
            backgroundColor: "#363534",
            color: "#C7B08B",
            "&:active, &:focus": {
              backgroundColor: "#363534", // Or any other style reset
            },
          }}
          onClick={onClick}
        >
          <Sugar amount={rootCost * multiplier} />
          /s{" "}
          <ArrowForwardIcon
            sx={{
              color: isOn ? "" : "red",
            }}
          />{" "}
          <Roots amount={1} /> &nbsp;
          {isOn ? "Stop" : "Start"}
        </Button>
      </Tooltip>
    </Grid>
  );
};
export default ToggleAutoRootButton;
