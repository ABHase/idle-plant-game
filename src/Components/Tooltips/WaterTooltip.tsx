import { Tooltip, Box, Typography } from "@mui/material";
import { Water } from "../Water";
import { formatNumberWithDecimals } from "../../PlantDisplays/PlantList";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";

interface WaterTooltipProps {
  productionRate: number;
  amount: number;
}

const WaterTooltip: React.FC<WaterTooltipProps> = ({
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
          <Water amount={amount} />
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
        <Water amount={showProductionRate ? productionRate : amount} />
        {showProductionRate && <Typography variant="body2">/s</Typography>}
      </Box>
    </Tooltip>
  );
};

export default WaterTooltip;
