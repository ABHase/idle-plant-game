import React from "react";
import GrainIcon from "@mui/icons-material/Grain";
import { Resource } from "./Resource";

interface IProps {
  amount: number;
}

export const Sugar = ({ amount }: IProps): React.ReactElement => (
  <Resource icon={GrainIcon} color="white" amount={amount} />
);
