// AllModifier.tsx
import React from "react";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { ResourceModifier } from "./ResourceModifier";
import GrainIcon from "@mui/icons-material/Grain";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import OpacityIcon from "@mui/icons-material/Opacity";

interface IProps {
  modifier: number;
}

export const AllModifier = ({ modifier }: IProps): React.ReactElement => (
  <ResourceModifier
    icons={[
      <OpacityIcon sx={{ fontSize: 22, color: "blue" }} />,
      <WbSunnyIcon sx={{ fontSize: 22, color: "orange" }} />,
      <GrainIcon sx={{ fontSize: 22, color: "white" }} />,
    ]}
    modifier={modifier}
  />
);
