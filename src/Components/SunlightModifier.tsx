// SunlightModifier.tsx
import React from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { ResourceModifier } from "./ResourceModifier";

interface IProps {
  modifier: number;
}

export const SunlightModifier = ({ modifier }: IProps): React.ReactElement => (
  <ResourceModifier
    icons={<WbSunnyIcon sx={{ fontSize: 22, color: "orange" }} />}
    modifier={modifier}
  />
);
