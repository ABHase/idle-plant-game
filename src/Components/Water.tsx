import React from "react";
import OpacityIcon from "@mui/icons-material/Opacity";
import { Resource } from "./Resource";

interface IProps {
  amount: number;
}

export const Water = ({ amount }: IProps): React.ReactElement => (
  <Resource icon={OpacityIcon} color="blue" amount={amount} />
);
