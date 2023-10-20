// WaterModifier.tsx
import React from "react";
import OpacityIcon from "@mui/icons-material/Opacity";
import { ResourceModifier } from "./ResourceModifier";

interface IProps {
  modifier: number;
}

export const WaterModifier = ({ modifier }: IProps): React.ReactElement => (
  <ResourceModifier
    icons={<OpacityIcon sx={{ fontSize: 22, color: "blue" }} />}
    modifier={modifier}
  />
);
