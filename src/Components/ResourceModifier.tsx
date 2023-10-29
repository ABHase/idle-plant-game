import React from "react";
import { Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface IProps {
  icons: React.ReactElement | React.ReactElement[]; // Icons can be a single element or an array of elements
  modifier: number;
}

export const ResourceModifier = ({ icons, modifier }: IProps) => {
  const renderIcons = () => {
    if (Array.isArray(icons)) {
      return icons.map((Icon, index) => (
        <React.Fragment key={index}>{Icon}</React.Fragment>
      ));
    } else {
      return icons;
    }
  };

  return (
    <Typography
      component="span"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {renderIcons()}
      {modifier > 1 ? (
        <ArrowUpwardIcon sx={{ color: "green" }} />
      ) : modifier < 1 ? (
        <ArrowDownwardIcon sx={{ color: "red" }} />
      ) : null}
      {modifier.toFixed(2)}X
    </Typography>
  );
};
