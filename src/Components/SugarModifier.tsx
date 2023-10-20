// SugarModifier.tsx
import React from "react";
import GrainIcon from "@mui/icons-material/Grain";
import { ResourceModifier } from "./ResourceModifier";

interface IProps {
  modifier: number;
}

export const SugarModifier = ({ modifier }: IProps): React.ReactElement => (
  <ResourceModifier
    icons={<GrainIcon sx={{ fontSize: 22, color: "white" }} />}
    modifier={modifier}
  />
);
