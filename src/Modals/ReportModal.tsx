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
import { time } from "console";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const ReportModal: React.FC<ReportModalProps> = ({
  open,
  onClose,
  isMobile,
}) => {
  const plant = useSelector((state: RootState) => state.plant);
  const difficulty = useSelector(
    (state: RootState) => state.globalState.difficulty
  );

  const season = useSelector((state: RootState) => state.plantTime.season);

  const globalBoostedTicks = useSelector(
    (state: RootState) => state.globalState.globalBoostedTicks
  );

  const timeScale =
    globalBoostedTicks > 1000 ? 200 : globalBoostedTicks > 0 ? 40 : 1;

  const report = itemizedReport(plant, season, difficulty, timeScale);

  const flexDirection = isMobile ? "column" : "row";

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
          maxWidth: "90%",
          maxHeight: "90%",
          bgcolor: "background.paper",
          border: "2px solid white",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h6" mb={2} sx={{ color: "white" }}>
            Detailed Report:
          </Typography>

          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: 12,
              border: "1px solid white",
              backgroundColor: "#090924",
              disabledBackground: "#090924",
              color: "white",
              "&:hover": {
                backgroundColor: "#1C1C3A", // Darker shade for hover
                color: "#E0E0E0", // Lighter shade for the text during hover
              },
              "&:disabled": {
                backgroundColor: "#3C3C4D", // or any other suitable shade you prefer
                color: "#black", // or any other suitable shade for text
                cursor: "not-allowed",
              },
              position: "absolute",
              right: 16, // Or however much space you want from the right edge
              top: 16, // Or however much space you want from the top edge
            }}
          >
            Close
          </Button>
        </Box>
        <Box
          sx={{
            maxWidth: "100%",
            maxHeight: "90%",
            bgcolor: "background.paper",
            border: "2px solid white",
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            overflow: "auto",
            color: "text.primary",
            display: "flex",
            flexDirection: flexDirection,
          }}
        >
          <Box display="flex" flexDirection="column" mx={2} my={2}>
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

          <Box display="flex" flexDirection="column" mx={2} my={2}>
            <Typography variant="subtitle1">Water:</Typography>
            <Typography variant="body2">
              Base Water Increase Per Root:{" "}
              <Water amount={plant.water_absorption_multiplier} />
            </Typography>
            <Typography variant="body2">
              Water Increase without Seasonal Effect:{" "}
              <Water amount={report.water.baseWaterIncrease} />
            </Typography>
            <Typography variant="body2">
              Water Increase with Current Seasonal Effect:{" "}
              <Water amount={report.water.currentSeasonModifiedWaterIncrease} />
            </Typography>
            <Typography variant="body2">
              Water Decreased Per Leaf:{" "}
              <Water amount={plant.water_efficiency_multiplier * 1} />
            </Typography>
            <Typography variant="body2">
              Water After Ladybug Tax:{" "}
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
            <Typography variant="body2">
              Water Increase expected for Spring Effect:{" "}
              <Water
                amount={report.water.seasonSpecificWaterIncreases.Spring}
              />
            </Typography>
            <Typography variant="body2">
              Water Increase expected for Summer Effect:{" "}
              <Water
                amount={report.water.seasonSpecificWaterIncreases.Summer}
              />
            </Typography>
            <Typography variant="body2">
              Water Increase expected for Autumn Effect:{" "}
              <Water
                amount={report.water.seasonSpecificWaterIncreases.Autumn}
              />
            </Typography>
            <Typography variant="body2">
              Water Increase expected for Winter Effect:{" "}
              <Water
                amount={report.water.seasonSpecificWaterIncreases.Winter}
              />
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" mx={2} my={2}>
            <Typography variant="subtitle1">Sunlight:</Typography>
            <Typography variant="body2">
              Leaves Sunlight Increase:{" "}
              <Sunlight amount={report.sunlight.leavesSunlightIncrease} />
            </Typography>
            <Typography variant="body2">
              Sunlight Increase with Current Seasonal Effect:{" "}
              <Sunlight
                amount={report.sunlight.currentSeasonModifiedSunlightIncrease}
              />
            </Typography>
            <Typography variant="body2">
              Sunlight After Ladybug Tax:{" "}
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
              Stored Sunlight:{" "}
              <Sunlight amount={report.sunlight.totalSunlight} />
            </Typography>
            <Typography variant="body2">
              Total Sunlight Absorbed:{" "}
              <Sunlight amount={report.sunlight.totalSunlightAbsorbed} />
            </Typography>
            <Typography variant="body2">
              Sunlight Increase expected for Spring Effect:{" "}
              <Sunlight
                amount={report.sunlight.seasonSpecificSunlightIncreases.Spring}
              />
            </Typography>
            <Typography variant="body2">
              Sunlight Increase expected for Summer Effect:{" "}
              <Sunlight
                amount={report.sunlight.seasonSpecificSunlightIncreases.Summer}
              />
            </Typography>
            <Typography variant="body2">
              Sunlight Increase expected for Autumn Effect:{" "}
              <Sunlight
                amount={report.sunlight.seasonSpecificSunlightIncreases.Autumn}
              />
            </Typography>
            <Typography variant="body2">
              Sunlight Increase expected for Winter Effect:{" "}
              <Sunlight
                amount={report.sunlight.seasonSpecificSunlightIncreases.Winter}
              />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReportModal;
