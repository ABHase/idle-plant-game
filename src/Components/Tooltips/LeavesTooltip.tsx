import { Tooltip, Box } from "@mui/material";
import { Leaves } from "../Leaves";

interface LeavesTooltipProps {
  amount: number;
}

const LeavesTooltip: React.FC<LeavesTooltipProps> = ({ amount }) => {
  return (
    <Tooltip title="Leaves" placement="bottom">
      <Box>
        <Leaves amount={amount} />
      </Box>
    </Tooltip>
  );
};

export default LeavesTooltip;
