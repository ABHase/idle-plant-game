import React, { ReactElement } from "react";
import CustomTooltip from "./CustomTooltip";
import { Water } from "../Water"; // Assuming you have a Water component
import { Leaves } from "../Leaves"; // Assuming you have a Leaves component

// Since LeafTooltip now acts as a wrapper, it accepts children
interface LeafTooltipProps {
  leafWaterUsage: boolean;
  children: ReactElement | ReactElement[];
}

const LeafTooltip: React.FC<LeafTooltipProps> = ({
  leafWaterUsage,
  children,
}) => {
  const renderTooltipContent = (): JSX.Element => (
    <>
      {!leafWaterUsage && <>{" Absorbent Leaves Consume No Water "}</>}
      {leafWaterUsage && (
        <>
          <Leaves amount={1} />
          {" Consumes "}
          <Water amount={1} />
          {" per second"}
        </>
      )}
    </>
  );

  return (
    <CustomTooltip title={renderTooltipContent()} placement="right">
      {children}
    </CustomTooltip>
  );
};

export default LeafTooltip;
