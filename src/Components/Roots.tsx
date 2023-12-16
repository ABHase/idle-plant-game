import React from "react";
import GrassIcon from "@mui/icons-material/Grass";
import { Resource } from "./Resource";

interface IProps {
  amount: number;
}

export const Roots = ({ amount }: IProps): React.ReactElement => (
  <Resource icon={GrassIcon} color="#a87a48" amount={amount} />
);
