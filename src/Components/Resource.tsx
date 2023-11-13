import React from "react";
import { formatNumberWithDecimals } from "../PlantDisplays/PlantList";
import { Typography } from "@mui/material";

interface IProps {
  icon: any;
  color: string;
  amount: number;
  format?: (s: number) => string;
  size?: "small" | "medium" | "large";
}

export const Resource = ({
  icon: Icon,
  amount,
  color,
  format,
  size = "medium",
}: IProps) => {
  const iconSize =
    size === "small" ? "18px" : size === "large" ? "26px" : "22px"; // example sizes
  const textSize =
    size === "small" ? "14px" : size === "large" ? "18px" : "16px"; // example sizes

  return (
    <Typography
      component="span"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        fontSize: textSize, // Apply textSize here
      }}
    >
      <Icon sx={{ fontSize: iconSize, color: color }} />
      {format ? format(amount) : formatNumberWithDecimals(amount)}
    </Typography>
  );
};
