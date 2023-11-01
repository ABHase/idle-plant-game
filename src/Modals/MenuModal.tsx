import React from "react";
import { Box, Button, Dialog, Slider } from "@mui/material";
import { currentVersion } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import { selectNumberOfCompletedCells } from "../Slices/cellCompletionSlice";
import { setDifficulty } from "../Slices/gameStateSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenUpgrade: () => void;
  onPlantSeed: () => void;
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  historyModalOpen: boolean;
  handleOpenHistoryModal: () => void;
  handleCloseHistoryModal: () => void;
  helpModalOpen: boolean;
  handleOpenHelpModal: () => void;
  handleCloseHelpModal: () => void;
  onOpenMushroomStore: () => void;
  handleOpenReportModal: () => void;
  handleOpenTextboxModal: () => void;
  handleCloseReportModal: () => void;
  handleOpenMapModal: () => void;
  manualSave: () => void;
  isMobile: boolean;
}

const MenuModal: React.FC<Props> = (props) => {
  const purchasedUpgrades = useSelector(
    (state: RootState) => state.upgrades.purchased
  );
  const playTimeSeconds = useSelector(
    (state: RootState) => state.app.totalTime
  );

  const numberOfCompletedCells = useSelector(selectNumberOfCompletedCells);
  const score = useSelector((state: RootState) => state.app.score);
  const difficulty = useSelector(
    (state: RootState) => state.globalState.difficulty
  );

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Box
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        padding={1}
        display="flex"
        flexDirection="column"
      >
        {/* Displaying currentVersion */}
        <div>Current Version: 0.{currentVersion}</div>
        <div>Play Time: {secondsToDHMS(playTimeSeconds)}</div>
        {/* Display Cells Completed */}
        <div>Cells Completed: {numberOfCompletedCells}</div>
        <div>Difficulty: {difficulty}</div>
        <div>Score: {score}</div>

        {props.isMobile && (
          <Button
            sx={{ my: 1 }}
            variant="contained"
            color="primary"
            onClick={props.onPlantSeed}
          >
            Plant Seed
          </Button>
        )}
        {props.isMobile && (
          <Button
            sx={{ my: 1 }}
            variant="contained"
            color="primary"
            onClick={props.onOpenUpgrade}
          >
            Evolve Traits
          </Button>
        )}
        {props.isMobile && (
          <Button
            sx={{ my: 1 }}
            variant="contained"
            color="primary"
            onClick={props.onOpenMushroomStore}
          >
            Mushroom Store
          </Button>
        )}
        <Button
          sx={{ my: 1 }}
          variant="contained"
          color="primary"
          onClick={props.handleOpenMapModal}
          disabled={!purchasedUpgrades.includes("Bush_map")}
        >
          Map
        </Button>

        <Button
          sx={{ my: 1 }}
          variant="contained"
          color="primary"
          onClick={props.handleOpenReportModal}
        >
          Plant Details
        </Button>

        <Button
          sx={{ my: 1 }}
          variant="contained"
          color="primary"
          onClick={props.handleOpenHistoryModal}
        >
          Plant History
        </Button>
        <Button
          variant="contained"
          sx={{ my: 1, backgroundColor: "#4e86e6" }}
          onClick={props.handleOpenHelpModal}
        >
          Help
        </Button>
        <a
          href="https://discord.gg/2RJMbh3F4P"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", width: "100%" }}
        >
          <Button
            variant="contained"
            sx={{ my: 1, backgroundColor: "#7289DA" }} // Discord's color
            fullWidth
          >
            Join Discord
          </Button>
        </a>
        <Button
          variant="contained"
          sx={{ my: 1, backgroundColor: "#4e86e6" }}
          onClick={props.manualSave}
        >
          Manual Save
        </Button>
        <Button
          variant="contained"
          sx={{ my: 1, backgroundColor: "#4e86e6" }}
          onClick={props.handleOpenTextboxModal}
        >
          Import/Export Save
        </Button>
        <Button
          variant="contained"
          sx={{ my: 1, backgroundColor: "#942e25" }}
          onClick={() => props.setOpenDialog(true)}
        >
          Purge Save
        </Button>
      </Box>
      {/* Include the modals here, if they are to be part of MenuModal */}
    </Dialog>
  );
};

function secondsToDHMS(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  seconds -= days * 24 * 3600;

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  // Round down to the nearest integer to avoid decimals
  const roundedSeconds = Math.floor(seconds);

  return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${roundedSeconds.toString().padStart(2, "0")}`;
}

export default MenuModal;
