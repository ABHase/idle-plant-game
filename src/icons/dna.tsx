import React from "react";
import { ReactComponent as DNASVG } from "./dna.svg";
import { SvgIcon } from "@mui/material";

export const DNAIcon = (): React.ReactElement => (
  <SvgIcon>
    <DNASVG />
  </SvgIcon>
);
