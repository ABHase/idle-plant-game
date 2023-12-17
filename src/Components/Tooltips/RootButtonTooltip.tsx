import React, { ReactElement } from "react";
import CustomTooltip from "./CustomTooltip";

interface RootTooltipProps {
  children: ReactElement | ReactElement[];
}

const RootTooltip: React.FC<RootTooltipProps> = ({ children }) => {
  const renderTooltipContent = (): JSX.Element => (
    <>
      <>{"Produces Water"}</>
    </>
  );

  return (
    <CustomTooltip title={renderTooltipContent()} placement="right">
      {children}
    </CustomTooltip>
  );
};

export default RootTooltip;
