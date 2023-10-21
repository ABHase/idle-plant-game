import {
  calculatePhotosynthesisSunlightConsumption,
  calculatePhotosynthesisWaterConsumption,
  determinePhotosynthesisSugarProduction,
} from "../../formulas";
import CustomTooltip from "./CustomTooltip";
import { Sugar } from "../Sugar";

// Assuming you have a Sunlight component as well.
import { Sunlight } from "../Sunlight";
import { Water } from "../Water";

interface ResourceConversionProps {
  maturityLevel: number;
  sugarProductionRate: number;
  season: string;
  autumnModifier: number;
  winterModifier: number;
  agaveSugarBonus: boolean;
  sugar: number;
}

const ResourceConversionTooltip: React.FC<ResourceConversionProps> = ({
  maturityLevel,
  sugarProductionRate,
  season,
  autumnModifier,
  winterModifier,
  agaveSugarBonus,
  sugar,
}) => {
  const waterConsumptionValue =
    calculatePhotosynthesisWaterConsumption(maturityLevel);
  const sunlightConsumptionValue =
    calculatePhotosynthesisSunlightConsumption(maturityLevel); // I'm using this temporarily, as you mentioned it's the same as water consumption.
  const sugarProductionValue = determinePhotosynthesisSugarProduction(
    sugarProductionRate,
    maturityLevel,
    season,
    autumnModifier,
    winterModifier,
    agaveSugarBonus
  );

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

  const titleContent = (
    <>
      Converts {renderWaterComponent()} and {renderSunlightComponent()} into
      {renderProducingSugarComponent()} per second.
    </>
  );

  return (
    <CustomTooltip title={titleContent}>{renderSugarComponent()}</CustomTooltip>
  );
};

export default ResourceConversionTooltip;
