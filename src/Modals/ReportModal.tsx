import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import { itemizedReport } from "../formulas";
import { Sugar } from "../Components/Sugar";
import { Water } from "../Components/Water";
import { Sunlight } from "../Components/Sunlight";

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
            Base Production Rate: {report.sugar.productionRate} X
          </Typography>
          <Typography variant="body2">
            Sugars Being Produced/cycle:&nbsp;
            <Sugar amount={report.sugar.sugarsProduced} />
          </Typography>
          <Typography variant="body2">
            Total Sugar Created:{" "}
            <Sugar amount={report.sugar.totalSugarCreated} />
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="subtitle1">Water:</Typography>
          <Typography variant="body2">
            Base Water Increase Per Root:{" "}
            <Water amount={report.water.rootsWaterIncrease} />
          </Typography>
          <Typography variant="body2">
            Water Increase with Seasonal Bonus:{" "}
            <Water amount={report.water.seasonModifiedWaterIncrease} />
          </Typography>
          <Typography variant="body2">
            Water Decreased Per Leaf:{" "}
            <Water amount={report.water.waterDecrease} />
          </Typography>
          <Typography variant="body2">
            Water Produced after Ladybug Tax:{" "}
            <Water amount={report.water.ladybugsTaxWater} />
          </Typography>
          <Typography variant="body2">
            Water Used Producing Sugar:{" "}
            <Water amount={report.water.photosynthesisWaterConsumption} />
          </Typography>
          <Typography variant="body2">
            Net Water: <Water amount={report.water.netWaterProduction} />
          </Typography>
          <Typography variant="body2">
            Stored Water: <Water amount={report.water.totalWater} />
          </Typography>
          <Typography variant="body2">
            Total Water Absorbed:{" "}
            <Water amount={report.water.totalWaterAbsorbed} />
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="subtitle1">Sunlight:</Typography>
          <Typography variant="body2">
            Leaves Sunlight Increase:{" "}
            <Sunlight amount={report.sunlight.leavesSunlightIncrease} />
          </Typography>
          <Typography variant="body2">
            Season Modified Sunlight Increase:{" "}
            <Sunlight amount={report.sunlight.seasonModifiedSunlightIncrease} />
          </Typography>
          <Typography variant="body2">
            Ladybugs Tax Sunlight:{" "}
            <Sunlight amount={report.sunlight.ladybugsTaxSunlight} />
          </Typography>
          <Typography variant="body2">
            Sunlight Used Producing Sugar:{" "}
            <Sunlight
              amount={report.sunlight.photosynthesisSunlightConsumption}
            />
          </Typography>
          <Typography variant="body2">
            Net Sunlight:{" "}
            <Sunlight amount={report.sunlight.netSunlightProduction} />
          </Typography>
          <Typography variant="body2">
            Stored Sunlight: <Sunlight amount={report.sunlight.totalSunlight} />
          </Typography>
          <Typography variant="body2">
            Total Sunlight Absorbed:{" "}
            <Sunlight amount={report.sunlight.totalSunlightAbsorbed} />
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
