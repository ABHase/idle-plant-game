import React, { useCallback, useEffect, useState } from "react";
import { Modal, Grid, Paper, Typography, Box, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import GrassIcon from "../Components/Grass";
import { getAdjacentCells } from "../cellUtils";
import ConfirmMoveDialog from "../ConfirmMoveDialog";
import { completeCellAndDeductSugar } from "../gameActions";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import VictoryDialog from "../VictoryDialog";

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
  const currentCellColor = "#404038";

  type PlantColors = {
    Fern: string;
    Grass: string;
    Bush: string;
    Moss: string;
    Succulent: string;
  };

  const plantColors = {
    Fern: "#30050d", // Red fern
    Grass: "#0c2100", // Grass green
    Bush: "#302b61", // Blueberry blue
    Moss: "#44635f", // Darkish brown
    Succulent: "#47430d", // Desert yellow
  };

  const getColorForPlant = (plantType: keyof PlantColors) =>
    plantColors[plantType] || "white";

  const adjacentCells = getAdjacentCells(currentCell);

  // Local state to manage the ConfirmMoveDialog visibility
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isVictoryDialogOpen, setIsVictoryDialogOpen] = useState(false);

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

  const allCellsCompleted = useSelector(
    (state: RootState) =>
      Object.values(state.cellCompletion.cells).filter(
        (cell) => cell !== null && cell !== undefined
      ).length === 24
  );

  const handleVictoryButtonClick = () => {
    setIsVictoryDialogOpen(true);
  };

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          padding="2"
          marginBottom="6px"
        >
          <Typography variant="h6" gutterBottom style={{ color: "white" }}>
            Map
          </Typography>

          {allCellsCompleted && (
            <Button
              variant="contained"
              onClick={handleVictoryButtonClick}
              style={{
                backgroundColor: "#266641",
                color: "white",
                borderRadius: 12,
              }}
            >
              Congratulations!
            </Button>
          )}
        </Box>

        <Grid container spacing={0.1}>
          {[...Array(24)].map((_, index) => {
            const cellPlantType: string | null = cellCompletion.cells[index];

            const backgroundColor =
              index === currentCell
                ? currentCellColor
                : cellPlantType
                ? getColorForPlant(cellPlantType as keyof PlantColors)
                : "#636359";

            const borderColor =
              index === currentCell ? "1px dashed white" : "2px solid black";

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
                    borderRadius: "4px",
                    border: borderColor,
                  }}
                  onClick={
                    isAdjacentCell ? () => handleMoveClick(index) : undefined
                  }
                >
                  {cellPlantType && (
                    <Typography>({cellPlantType[0]})</Typography>
                  )}
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
                sx={{ border: "1px solid white" }}
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
        <VictoryDialog
          open={isVictoryDialogOpen}
          onClose={() => setIsVictoryDialogOpen(false)}
        />
      </div>
    </Modal>
  );
};

export default MapModal;
