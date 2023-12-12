import React from "react";
import { Box, Typography } from "@mui/material";
import { Sugar } from "../Sugar";
import { determinePhotosynthesisSugarProduction } from "../../formulas";

interface SugarProductionRateProps {
  maturityLevel: number;
  sugarProductionRate: number;
  season: string;
  autumnModifier: number;
  winterModifier: number;
  agaveSugarBonus: boolean;
  sugar: number;
  difficulty: number;
  waterEfficiency: number;
  sunlightEfficiency: number;
}

const SugarProductionRate: React.FC<SugarProductionRateProps> = ({
  maturityLevel,
  sugarProductionRate,
  season,
  autumnModifier,
  winterModifier,
  agaveSugarBonus,
  sugar,
  difficulty,
  waterEfficiency,
  sunlightEfficiency,
}) => {
  const sugarProductionValue = determinePhotosynthesisSugarProduction(
    sugarProductionRate,
    maturityLevel,
    season,
    autumnModifier,
    winterModifier,
    agaveSugarBonus,
    1,
    1
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: "4px",
      }}
    >
      <Sugar amount={sugarProductionValue} />
      <Typography variant="body2">/s</Typography>
    </Box>
  );
};

export default SugarProductionRate;
