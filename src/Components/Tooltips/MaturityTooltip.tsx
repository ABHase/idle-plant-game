import { Tooltip, Box } from "@mui/material";
import { Maturity } from "../Maturity";

interface MaturityTooltipProps {
  maturityLevel: number;
}

const MaturityTooltip: React.FC<MaturityTooltipProps> = ({ maturityLevel }) => {
  return (
    <Tooltip title="Size" placement="bottom">
      <Box>
        <Maturity amount={maturityLevel} />
      </Box>
    </Tooltip>
  );
};

export default MaturityTooltip;
