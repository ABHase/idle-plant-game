import { Tooltip, Box, Typography } from "@mui/material";
import { Sunlight } from "../Sunlight";
import { formatNumberWithDecimals } from "../../PlantDisplays/PlantList";

interface SunlightTooltipProps {
  productionRate: number;
  amount: number;
}

const SunlightTooltip: React.FC<SunlightTooltipProps> = ({
  productionRate,
  amount,
}) => {
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
      <Box>
        <Sunlight amount={amount} />
      </Box>
    </Tooltip>
  );
};

export default SunlightTooltip;
