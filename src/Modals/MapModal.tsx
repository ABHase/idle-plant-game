import React, { useCallback, useState } from "react";
import { Modal, Grid, Paper, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import GrassIcon from "../Components/Grass";
import { getAdjacentCells } from "../cellUtils";
import ConfirmMoveDialog from "../ConfirmMoveDialog";
import { completeCellAndDeductSugar } from "../gameActions";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const MapModal: React.FC<MapModalProps> = ({ open, onClose, isMobile }) => {
  const currentCell = useSelector(
    (state: RootState) => state.globalState.currentCell
  );

  const cellCompletion = useSelector(
    (state: RootState) => state.cellCompletion
  );

  const currentPlantType = useSelector((state: RootState) => state.plant.type);

  const cellSize = 50;
  const currentCellColor = "lightblue";

  type PlantColors = {
    Fern: string;
    Grass: string;
    Bush: string;
    Moss: string;
    Succulent: string;
  };

  const plantColors = {
    Fern: "#8BC34A",
    Grass: "#4CAF50",
    Bush: "#388E3C",
    Moss: "#2E7D32",
    Succulent: "#1B5E20",
  };

  const getColorForPlant = (plantType: keyof PlantColors) =>
    plantColors[plantType] || "white";

  const adjacentCells = getAdjacentCells(currentCell);

  // Local state to manage the ConfirmMoveDialog visibility
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [clickedCellIndex, setClickedCellIndex] = useState<number | null>(null);

  const handleMoveClick = useCallback((index: number) => {
    setClickedCellIndex(index);
    setIsConfirmDialogOpen(true);
  }, []);

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const handleConfirmMove = useCallback(() => {
    if (clickedCellIndex !== null) {
      dispatch(completeCellAndDeductSugar(clickedCellIndex));
    }
  }, [dispatch, clickedCellIndex]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "16px",
          backgroundColor: "#1f1107",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: isMobile ? "80%" : "40%",
        }}
      >
        <Typography variant="h6" gutterBottom style={{ color: "white" }}>
          Map
        </Typography>

        <Grid container spacing={1}>
          {[...Array(24)].map((_, index) => {
            const cellPlantType: string | null = cellCompletion.cells[index];

            const backgroundColor =
              index === currentCell
                ? currentCellColor
                : cellPlantType
                ? getColorForPlant(cellPlantType as keyof PlantColors)
                : "grey";

            const isAdjacentCell = adjacentCells.includes(index);

            return (
              <Grid
                item
                xs={2}
                key={index}
                style={{ width: cellSize, height: cellSize }}
              >
                <Paper
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: backgroundColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={
                    isAdjacentCell ? () => handleMoveClick(index) : undefined
                  }
                >
                  {isAdjacentCell ? <Typography>Move</Typography> : null}
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Box marginTop={2} display="flex" flexDirection="row" flexWrap="wrap">
          <Typography
            variant="subtitle1"
            style={{ marginRight: "8px", color: "white" }}
          >
            Key:
          </Typography>
          {[...Object.keys(plantColors), "Current"].map((label) => (
            <Box
              display="flex"
              alignItems="center"
              marginTop={1}
              marginRight={2}
              key={label}
              sx={{ color: "white" }}
            >
              <Box
                width={20}
                height={20}
                marginRight={1}
                bgcolor={
                  label === "Current"
                    ? currentCellColor
                    : plantColors[label as keyof PlantColors]
                }
              ></Box>
              <Typography>{label}</Typography>
            </Box>
          ))}
        </Box>
        <ConfirmMoveDialog
          open={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleConfirmMove}
          currentPlantType={currentPlantType}
        />
      </div>
    </Modal>
  );
};

export default MapModal;
