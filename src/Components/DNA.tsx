import React from "react";
import { Resource } from "./Resource";
import { DNAIcon } from "../icons/dna";

interface IProps {
  amount: number;
}

export const DNA = ({ amount }: IProps): React.ReactElement => (
  <Resource icon={DNAIcon} amount={amount} color="white" />
);
