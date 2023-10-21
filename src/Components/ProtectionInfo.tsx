import React from "react";
import { Water } from "./Water";
import { Grid, Typography } from "@mui/material";

interface ProtectionInfoProps {
  needles: number;
  needleProtection: number;
  rabbitImmunity: boolean;
}

const ProtectionInfo: React.FC<ProtectionInfoProps> = ({
  needles,
  needleProtection,
  rabbitImmunity,
}) => {
  if (rabbitImmunity) {
    return <Typography>You are Immune to Rabbit Attacks</Typography>;
  }

  // If not immune, display water protection info
  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item xs={5}>
        <Typography>Needles protecting:</Typography>
      </Grid>
      <Grid item xs={7}>
        <Water amount={needles * 100 * needleProtection} />
      </Grid>
    </Grid>
  );
};

export default ProtectionInfo;
