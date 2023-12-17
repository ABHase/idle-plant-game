import {
  getDifficultyModifiedSunlightConsumption,
  getDifficultyModifiedWaterConsumption,
} from "../../formulas";
import CustomTooltip from "./CustomTooltip";
import { Sugar } from "../Sugar";

// Assuming you have a Sunlight component as well.
import { Sunlight } from "../Sunlight";
import { Water } from "../Water";
import { Maturity } from "../Maturity";
import { Stack } from "@mui/material";
import {
  MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER,
  MATURITY_WATER_CONSUMPTION_MODIFIER,
} from "../../constants";

interface ResourceConversionProps {
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
  baseSugarProductionRate: number;
  plantType: string;
}

const ResourceConversionTooltip: React.FC<ResourceConversionProps> = ({
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
  baseSugarProductionRate,
  plantType,
}) => {
  const renderSugarComponent = () => {
    return <Sugar amount={sugar} />;
  };

  const renderMaturityComponent = () => {
    return <Maturity amount={maturityLevel} />;
  };

  const renderDifficultyWaterComponent = () => {
    return <Water amount={getDifficultyModifiedWaterConsumption(difficulty)} />;
  };

  const renderDifficultySunlightComponent = () => {
    return (
      <Sunlight amount={getDifficultyModifiedSunlightConsumption(difficulty)} />
    );
  };

  const renderWaterFormulaComponent = () => {
    const efficiencyPart = waterEfficiency !== 1 ? `*${waterEfficiency}` : "";
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {renderDifficultyWaterComponent()}
        <span>* (1 + </span>
        <span>{MATURITY_WATER_CONSUMPTION_MODIFIER.toFixed(2)} *</span>
        {renderMaturityComponent()}
        <span>){efficiencyPart}</span>
      </Stack>
    );
  };

  const renderSunlightFormulaComponent = () => {
    const efficiencyPart =
      sunlightEfficiency !== 1 ? `*${sunlightEfficiency}` : "";

    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {renderDifficultySunlightComponent()}
        <span>* (1 + </span>
        <span>{MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER.toFixed(2)} *</span>
        {renderMaturityComponent()}
        <span>){efficiencyPart}</span>
      </Stack>
    );
  };

  const renderFormulaComponent = (baseRate: number) => {
    let seasonModifier = 1;
    if (season === "Autumn") {
      seasonModifier *= autumnModifier;
    } else if (season === "Winter") {
      seasonModifier *= winterModifier;
    }

    return (
      <Stack direction="column" alignItems="center" spacing={1}>
        {plantType} Consumption:
        {renderWaterFormulaComponent()}
        {renderSunlightFormulaComponent()}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ borderBottom: "1px solid black", paddingBottom: "1rem" }}
        ></Stack>
        {plantType} Sugar:
        <Stack direction="row" alignItems="center" spacing={1}>
          <span>{baseRate} * (1 + 0.1 * </span>
          {renderMaturityComponent()}
          <span>
            )
            {season === "Autumn" || season === "Winter"
              ? ` * ${seasonModifier}`
              : ""}
          </span>
        </Stack>
      </Stack>
    );
  };

  const titleContent = (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack direction="column" alignItems="center" spacing={1}>
          {plantType} Rates:
          {renderFormulaComponent(baseSugarProductionRate)}
        </Stack>
      </Stack>
    </>
  );

  return (
    <CustomTooltip title={titleContent}>{renderSugarComponent()}</CustomTooltip>
  );
};

export default ResourceConversionTooltip;
