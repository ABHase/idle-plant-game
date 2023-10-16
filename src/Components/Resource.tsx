import React from "react";
import { formatNumberWithDecimals } from "../PlantDisplays/PlantList";
import { Typography } from "@mui/material";

interface IProps {
  icon: any;
  color: string;
  amount: number;
  format?: (s: number) => string;
}

export const Resource = ({ icon: Icon, amount, color, format }: IProps) => (
  <Typography
    style={{
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Icon sx={{ fontSize: 22, color: color }} />
    {format ? format(amount) : formatNumberWithDecimals(amount)}
  </Typography>
);
