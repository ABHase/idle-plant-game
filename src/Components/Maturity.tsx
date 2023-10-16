import React from "react";
import ParkIcon from "@mui/icons-material/Park";
import { Resource } from "./Resource";
import { formatNumber } from "../PlantDisplays/PlantList";

interface IProps {
  amount: number;
}

export const Maturity = ({ amount }: IProps): React.ReactElement => (
  <Resource
    icon={ParkIcon}
    color="green"
    amount={amount}
    format={formatNumber}
  />
);
