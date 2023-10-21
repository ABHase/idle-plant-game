import React from "react";
import { Tooltip, Typography, Box } from "@mui/material";

interface CustomTooltipProps {
  title: string | JSX.Element;
  children: JSX.Element | JSX.Element[];
  placement?: "left" | "right" | "top" | "bottom"; // Add more if necessary
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  children,
  placement = "right",
}) => {
  return (
    <Tooltip
      title={
        <>
          <Typography color="inherit">{title}</Typography>
        </>
      }
      placement={placement}
    >
      <Box>{children}</Box>
    </Tooltip>
  );
};

export default CustomTooltip;
