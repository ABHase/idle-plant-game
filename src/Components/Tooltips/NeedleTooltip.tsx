import React, { ReactElement } from "react";
import CustomTooltip from "./CustomTooltip";
import { Maturity } from "../Maturity";
import { Stack } from "@mui/material";
import { Sugar } from "../Sugar";

interface NeedleTooltipProps {
  plantState: {
    maturity_level: number;
    // Other plantState properties if needed
  };
  multiplier: number;
  children: ReactElement | ReactElement[]; // Updated type
}

const NeedleTooltip: React.FC<NeedleTooltipProps> = ({
  plantState,
  multiplier,
  children,
}) => {
  const calculateNeedleCost = (
    maturityLevel: number,
    multiplier: number
  ): number => {
    // Your formula for needle cost here
    return maturityLevel * 100 * multiplier;
  };

  const renderMaturityComponent = () => {
    return <Maturity amount={plantState.maturity_level} />;
  };

  const renderTooltipContent = (): JSX.Element => {
    const cost = calculateNeedleCost(plantState.maturity_level, multiplier);
    const formula = (
      <Stack direction="row" alignItems="center" spacing={1}>
        Cost = <Sugar amount={100} />
        &nbsp; *
        <Maturity amount={plantState.maturity_level} />
        &nbsp; Per Needle
      </Stack>
    );

    return (
      <>
        <div>{formula}</div>
      </>
    );
  };

  return (
    <CustomTooltip title={renderTooltipContent()} placement="right">
      {children}
    </CustomTooltip>
  );
};

export default NeedleTooltip;
