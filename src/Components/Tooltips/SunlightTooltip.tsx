import { Tooltip, Box, Typography } from "@mui/material";
import { Sunlight } from "../Sunlight";

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
          {productionRate.toFixed(2)}/s
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
