import React from "react";
import { Tooltip, Box, Stack } from "@mui/material";
import { Maturity } from "../Maturity";
import CustomTooltip from "./CustomTooltip";
import { Leaves } from "../Leaves";
import { Roots } from "../Roots";

interface MaturityTooltipProps {
  leaves: number;
  roots: number;
  maturityLevel: number;
}

const MaturityTooltip: React.FC<MaturityTooltipProps> = ({
  leaves,
  roots,
  maturityLevel,
}) => {
  // Calculate size based on leaves and roots

  const renderLeavesComponent = () => {
    return <Leaves amount={leaves} />;
  };

  const renderRootsComponent = () => {
    return <Roots amount={roots} />;
  };

  const renderMaturityComponent = () => {
    return <Maturity amount={maturityLevel} />;
  };

  const titleContent = (
    <Stack direction="column" alignItems="center" spacing={0}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {renderLeavesComponent()}
        <span>+</span>
        {renderRootsComponent()}
        <span>= {roots + leaves}</span>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        ⌊√{roots + leaves}⌋ = {renderMaturityComponent()}
      </Stack>
    </Stack>
  );

  return (
    <CustomTooltip title={titleContent} placement="right">
      <Box>
        <Maturity amount={maturityLevel} />
      </Box>
    </CustomTooltip>
  );
};

export default MaturityTooltip;
