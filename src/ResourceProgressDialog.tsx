// ResourceProgressDialog.tsx

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import {
  formatNumberWithDecimals,
  formatNumberWithoutDecimals,
} from "./PlantDisplays/PlantList";

interface ResourceProgressProps {
  globalState: {
    silicaProgress: number;
    silicaThreshold: number;
    tanninsProgress: number;
    tanninsThreshold: number;
    calciumProgress: number;
    calciumThreshold: number;
    fulvicProgress: number;
    fulvicThreshold: number;
    silica: number;
    tannins: number;
    calcium: number;
    fulvic: number;
  };
  isOpen: boolean;
  toggleDialog: () => void;
}

const renderProgressBar = (
  progress: number,
  threshold: number,
  label: string
) => (
  <Box display="row" alignItems="center" my={2}>
    <Typography variant="body2" color="textSecondary" mr={2}>
      {label}
    </Typography>
    <Box width="100%" position="relative">
      <LinearProgress
        variant="determinate"
        value={(progress / threshold) * 100}
        sx={{
          height: "24px",
          borderRadius: 5,
          backgroundColor: "#e6e6e6",
        }}
      />
      <Box
        position="absolute"
        display="flex"
        justifyContent="center"
        width="100%"
        top={0}
        bottom={0}
      >
        <Typography variant="body2" color="black">
          {`${formatNumberWithoutDecimals(
            progress
          )}/${formatNumberWithoutDecimals(threshold)}`}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export const ResourceProgressDialog: React.FC<ResourceProgressProps> = ({
  globalState,
  isOpen,
  toggleDialog,
}) => {
  return (
    <Dialog fullWidth={true} maxWidth="md" open={isOpen} onClose={toggleDialog}>
      <DialogTitle>Time Resource Progress</DialogTitle>
      <DialogContent>
        {renderProgressBar(
          globalState.silicaProgress,
          globalState.silicaThreshold,
          "Silica (Succulent)"
        )}
        {renderProgressBar(
          globalState.tanninsProgress,
          globalState.tanninsThreshold,
          "Tannins (Moss)"
        )}
        {renderProgressBar(
          globalState.calciumProgress,
          globalState.calciumThreshold,
          "Calcium (Fern)"
        )}
        {renderProgressBar(
          globalState.fulvicProgress,
          globalState.fulvicThreshold,
          "Fulvic (Grass)"
        )}
        <Typography variant="h6">Resources</Typography>
        <Typography>
          Silica: {formatNumberWithDecimals(globalState.silica)}
        </Typography>
        <Typography>
          Tannins: {formatNumberWithDecimals(globalState.tannins)}
        </Typography>
        <Typography>
          Calcium: {formatNumberWithDecimals(globalState.calcium)}
        </Typography>
        <Typography>
          Fulvic: {formatNumberWithDecimals(globalState.fulvic)}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
