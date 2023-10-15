import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import { itemizedReport } from "../formulas";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ open, onClose }) => {
  const plant = useSelector((state: RootState) => state.plant);
  const season = useSelector((state: RootState) => state.plantTime.season);
  const report = itemizedReport(plant, season);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="report-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "80%",
          maxHeight: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          overflow: "auto",
          color: "text.primary",
        }}
      >
        <Typography variant="h6" mb={2}>
          Detailed Report:
        </Typography>
        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="subtitle1">Sugar:</Typography>
          <Typography variant="body2">
            Production Rate: {report.sugar.productionRate}
          </Typography>
          <Typography variant="body2">
            Sugars Produced: {report.sugar.sugarsProduced}
          </Typography>
          <Typography variant="body2">
            Stored Sugar: {report.sugar.totalSugar}
          </Typography>
          <Typography variant="body2">
            Total Sugar Created: {report.sugar.totalSugarCreated}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="subtitle1">Water:</Typography>
          <Typography variant="body2">
            Base Water Increase Per Root: {report.water.rootsWaterIncrease}
          </Typography>
          <Typography variant="body2">
            Water Increase with Seasonal Bonus:{" "}
            {report.water.seasonModifiedWaterIncrease}
          </Typography>
          <Typography variant="body2">
            Water Decreased Per Leaf: {report.water.waterDecrease}
          </Typography>
          <Typography variant="body2">
            Water Produced after Ladybug Tax: {report.water.ladybugsTaxWater}
          </Typography>
          <Typography variant="body2">
            Water Used Producing Sugar:{" "}
            {report.water.photosynthesisWaterConsumption}
          </Typography>
          <Typography variant="body2">
            Net Water: {report.water.netWaterProduction}
          </Typography>
          <Typography variant="body2">
            Stored Water: {report.water.totalWater}
          </Typography>
          <Typography variant="body2">
            Total Water Absorbed: {report.water.totalWaterAbsorbed}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="subtitle1">Sunlight:</Typography>
          <Typography variant="body2">
            Leaves Sunlight Increase: {report.sunlight.leavesSunlightIncrease}
          </Typography>
          <Typography variant="body2">
            Season Modified Sunlight Increase:{" "}
            {report.sunlight.seasonModifiedSunlightIncrease}
          </Typography>
          <Typography variant="body2">
            Ladybugs Tax Sunlight: {report.sunlight.ladybugsTaxSunlight}
          </Typography>
          <Typography variant="body2">
            Sunlight Used Producing Sugar:{" "}
            {report.sunlight.photosynthesisSunlightConsumption}
          </Typography>
          <Typography variant="body2">
            Net Sunlight: {report.sunlight.netSunlightProduction}
          </Typography>
          <Typography variant="body2">
            Stored Sunlight: {report.sunlight.totalSunlight}
          </Typography>
          <Typography variant="body2">
            Total Sunlight Absorbed: {report.sunlight.totalSunlightAbsorbed}
          </Typography>
        </Box>

        <Box mt={2}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReportModal;
