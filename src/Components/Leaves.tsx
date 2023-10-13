import React from "react";
import SpaIcon from "@mui/icons-material/Spa";
import { Resource } from "./Resource";

interface IProps {
  amount: number;
}

export const Leaves = ({ amount }: IProps): React.ReactElement => (
  <Resource icon={SpaIcon} color="green" amount={amount} />
);
