import { Tooltip, Box } from "@mui/material";
import { Roots } from "../Roots";

interface RootsTooltipProps {
  amount: number;
}

const RootsTooltip: React.FC<RootsTooltipProps> = ({ amount }) => {
  return (
    <Tooltip title="Roots" placement="bottom">
      <Box>
        <Roots amount={amount} />
      </Box>
    </Tooltip>
  );
};

export default RootsTooltip;
