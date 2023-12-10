import { Tooltip, Box, Typography } from "@mui/material";
import { Sunlight } from "../Sunlight";
import { formatNumberWithDecimals } from "../../PlantDisplays/PlantList";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";

interface SunlightTooltipProps {
  productionRate: number;
  amount: number;
}

const SunlightTooltip: React.FC<SunlightTooltipProps> = ({
  productionRate,
  amount,
}) => {
  const showProductionRate = useSelector(
    (state: RootState) => state.plantTime.showProductionRate
  );
  return (
    <Tooltip
      title={
        <Typography component="span" display="inline">
          <Sunlight amount={amount} />
          {formatNumberWithDecimals(productionRate)}/s
        </Typography>
      }
      placement="top"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "4px",
        }}
      >
        <Sunlight amount={showProductionRate ? productionRate : amount} />
        {showProductionRate && <Typography variant="body2">/s</Typography>}
      </Box>
    </Tooltip>
  );
};

export default SunlightTooltip;
