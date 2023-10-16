import React from "react";
import { Button, Tooltip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Sugar } from "../Sugar";
import { Leaves } from "../Leaves";
import { Grid } from "@mui/material";

interface ToggleButtonProps {
  isOn: boolean;
  onClick: () => void;
  leafCost: number;
  multiplier: number;
  isVisible: boolean;
}

const ToggleAutoLeafButton: React.FC<ToggleButtonProps> = ({
  isOn,
  onClick,
  leafCost,
  multiplier,
  isVisible, // <-- Destructure the new prop
}) => {
  if (!isVisible) return null;

  return (
    <Grid item xs={12}>
      <Tooltip
        title={
          isOn
            ? "Turn off Automatic Leaf Production"
            : "Turn on Automatic Leaf Production"
        }
      >
        <Button
          fullWidth
          sx={{
            border: isOn ? "1px solid #ffffff" : "1px solid #aaa",
            borderRadius: "4px",
            backgroundColor: "#424532",
            color: "#B5D404",
            "&:active, &:focus": {
              backgroundColor: "#424532",
            },
          }}
          onClick={onClick}
        >
          <Sugar amount={leafCost * multiplier} />
          /s{" "}
          <ArrowForwardIcon
            sx={{
              color: isOn ? "" : "red",
            }}
          />{" "}
          <Leaves amount={1} /> &nbsp;
          {isOn ? "Stop" : "Start"}
        </Button>
      </Tooltip>
    </Grid>
  );
};

export default ToggleAutoLeafButton;