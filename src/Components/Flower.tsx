import React from "react";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { Resource } from "./Resource";

interface IProps {
  amount: number;
}

export const Flower = ({ amount }: IProps): React.ReactElement => (
  <Resource icon={LocalFloristIcon} color="white" amount={amount} />
);
