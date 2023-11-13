import React from "react";
import GrainIcon from "@mui/icons-material/Grain";
import { Resource } from "./Resource";

interface IProps {
  amount: number;
  size?: "small" | "medium" | "large";
}

export const Sugar = ({ amount, size }: IProps): React.ReactElement => (
  <Resource icon={GrainIcon} color="white" amount={amount} size={size} />
);
