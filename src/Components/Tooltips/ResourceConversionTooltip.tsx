import {
  calculatePhotosynthesisSunlightConsumption,
  calculatePhotosynthesisWaterConsumption,
  determinePhotosynthesisSugarProduction,
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
  const waterConsumptionValue = calculatePhotosynthesisWaterConsumption(
    maturityLevel,
    difficulty,
    waterEfficiency
  );
  const sunlightConsumptionValue = calculatePhotosynthesisSunlightConsumption(
    maturityLevel,
    difficulty,
    sunlightEfficiency
  );

  const baseWaterConsumptionValue = calculatePhotosynthesisWaterConsumption(
    1,
    difficulty,
    waterEfficiency
  );

  const baseSunlightConsumptionValue =
    calculatePhotosynthesisSunlightConsumption(
      1,
      difficulty,
      sunlightEfficiency
    );

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

  const renderConsumptionFormula = (
    baseConsumption: number,
    modifier: number,
    label: string
  ) => {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <span>{label} Consumption</span>
        <span>*</span>
        <span>(1 + {modifier} *</span>
        {renderMaturityComponent()}
        <span>)*</span>
        <span>Efficiency</span>
      </Stack>
    );
  };

  const renderBaseWaterConsumptionComponent = () => {
    return <Water amount={baseWaterConsumptionValue} />;
  };

  const renderBaseSunlightConsumptionComponent = () => {
    return <Sunlight amount={baseSunlightConsumptionValue} />;
  };

  const renderWaterComponent = () => {
    return <Water amount={waterConsumptionValue} />;
  };

  const renderSunlightComponent = () => {
    return <Sunlight amount={sunlightConsumptionValue} />;
  };

  const renderSugarComponent = () => {
    return <Sugar amount={sugar} />;
  };

  const renderProducingSugarComponent = () => {
    return <Sugar amount={sugarProductionValue} />;
  };

  const renderMaturityComponent = () => {
    return <Maturity amount={maturityLevel} />;
  };

  const renderOneMaturityComponent = () => {
    return <Maturity amount={1} />;
  };

  const renderDifficultyWaterComponent = () => {
    return <Water amount={getDifficultyModifiedWaterConsumption(difficulty)} />;
  };

  const renderDifficultySunlightComponent = () => {
    return (
      <Sunlight amount={getDifficultyModifiedSunlightConsumption(difficulty)} />
    );
  };

  const waterConsumptionModifierValue = (
    1 + MATURITY_WATER_CONSUMPTION_MODIFIER
  ).toFixed(2);

  const renderWaterFormulaComponent = () => {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {renderDifficultyWaterComponent()}
        <span>* (1 + </span>
        <span>{MATURITY_WATER_CONSUMPTION_MODIFIER.toFixed(2)} *</span>
        {renderMaturityComponent()}
        <span>)*{waterEfficiency}</span>
      </Stack>
    );
  };

  const renderSunlightFormulaComponent = () => {
    // Calculate the modifier value
    const sunlightConsumptionModifierValue = (
      1 + MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER
    ).toFixed(2);

    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {renderDifficultySunlightComponent()}
        <span>* (1 + </span>
        <span>{MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER.toFixed(2)} *</span>
        {renderMaturityComponent()}
        <span>)*{sunlightEfficiency}</span>
      </Stack>
    );
  };

  const sugarProductionFormula = ` ${baseSugarProductionRate} * (1 + 0.1 * ${maturityLevel})`;

  const renderFormulaComponent = (baseRate: number) => {
    const waterFormula = `${renderDifficultyWaterComponent()} * (1 + ${MATURITY_WATER_CONSUMPTION_MODIFIER} * Maturity) * ${waterEfficiency}`;

    const sunlightFormula = `${getDifficultyModifiedSunlightConsumption(
      difficulty
    )} * (1 + ${MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER} * Maturity) * ${sunlightEfficiency}`;

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
          <span>)</span>
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
