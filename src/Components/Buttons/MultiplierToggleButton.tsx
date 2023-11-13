import React from "react";
import { Button, Grid } from "@mui/material";

interface MultiplierToggleButtonProps {
  currentMultiplier: number;
  value: number;
  onClick: (value: number) => void;
}

const MultiplierToggleButton: React.FC<MultiplierToggleButtonProps> = ({
  currentMultiplier,
  value,
  onClick,
}) => {
  const formatNumber = (num: number) => {
    if (num === -1) {
      return "50%";
    } else if (num >= 1e15) {
      return "Max";
    } else if (num >= 1000) {
      return `${num / 1000}K`;
    }
    return num.toString();
  };

  const buttonLabel = formatNumber(value);

  return (
    <Button
      onClick={() => onClick(value)}
      variant={currentMultiplier === value ? "contained" : "outlined"}
      sx={{ padding: "4px 8px", mx: "1px" }}
    >
      {buttonLabel}
    </Button>
  );
};

export default MultiplierToggleButton;
