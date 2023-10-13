import React from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Resource } from "./Resource";

interface IProps {
  amount: number;
}

export const Sunlight = ({ amount }: IProps): React.ReactElement => (
  <Resource icon={WbSunnyIcon} color="orange" amount={amount} />
);
