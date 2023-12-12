import { Tooltip, Box, Typography } from "@mui/material";
import { Water } from "../Water";
import { formatNumberWithDecimals } from "../../PlantDisplays/PlantList";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";

interface WaterTooltipProps {
  productionRate: number;
  amount: number;
  displayMode: "productionRate" | "amount"; // Added prop for display mode
}

const WaterTooltip: React.FC<WaterTooltipProps> = ({
  productionRate,
  amount,
  displayMode, // Using the new prop
}) => {
  const showProductionRate = useSelector(
    (state: RootState) => state.plantTime.showProductionRate
  );

  // Determine which value to display based on the displayMode prop
  const displayValue =
    displayMode === "productionRate" ? productionRate : amount;

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
        <Water amount={displayValue} />
        {displayMode === "productionRate" && (
          <Typography variant="body2">/s</Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default WaterTooltip;
