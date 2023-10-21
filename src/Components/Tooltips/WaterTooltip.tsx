import { Tooltip, Box, Typography } from "@mui/material";
import { Water } from "../Water";
import { formatNumberWithDecimals } from "../../PlantDisplays/PlantList";

interface WaterTooltipProps {
  productionRate: number;
  amount: number;
}

const WaterTooltip: React.FC<WaterTooltipProps> = ({
  productionRate,
  amount,
}) => {
  return (
    <Tooltip
      title={
        <Typography component="span" display="inline">
          <Water amount={amount} />
          {formatNumberWithDecimals(productionRate)}/s
        </Typography>
      }
      placement="top"
    >
      <Box>
        <Water amount={amount} />
      </Box>
    </Tooltip>
  );
};

export default WaterTooltip;
