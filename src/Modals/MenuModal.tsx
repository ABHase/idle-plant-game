import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, Slider, Tooltip } from "@mui/material";
import { currentVersion } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import { selectNumberOfCompletedCells } from "../Slices/cellCompletionSlice";
import { setDifficulty } from "../Slices/gameStateSlice";
import { ResourceProgressDialog } from "../ResourceProgressDialog";
import { buttonStyle, redButtonStyle } from "../buttonStyles";

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
  handleTogglePause: () => void;
  paused: boolean;
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
  const totalCellsCompleted = useSelector(
    (state: RootState) => state.app.totalCellsCompleted
  );
  const difficulty = useSelector(
    (state: RootState) => state.globalState.difficulty
  );

  const [isResourcesPopupVisible, setIsResourcesPopupVisible] = useState(false);

  const globalState = useSelector((state: RootState) => state.globalState);

  const handleResourcesPopupToggle = () => {
    setIsResourcesPopupVisible(!isResourcesPopupVisible);
  };

  const handleOpenLink = (url: string) => {
    // Check if we're in Electron and the electron object is available on window
    if (window.electron && typeof window.electron.openExternal === "function") {
      // Use Electron's shell to open the link if we are
      window.electron.openExternal(url);
    } else {
      // If we're not in Electron, fall back to a regular window.open call
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    // This code runs after the component has mounted
    console.log(window.electron); // Check if it's defined
  }, []);

  // Determine if the app is running in Electron
  const isElectron =
    window.electron && typeof window.electron.openExternal === "function";

  // Set the button text and URL based on the environment
  const buttonText = isElectron ? "Play Online" : "Play on Steam";
  const gameUrl = isElectron
    ? "https://idleplantgame.com/"
    : "https://store.steampowered.com/app/2701250/Idle_Plant_Game/";

  // Function to handle opening the link
  const handleOpenGameLink = () => {
    if (isElectron) {
      // Use Electron's shell to open the link if we are in Electron
      window.electron.openExternal(gameUrl);
    } else {
      // If we're not in Electron, open the link in a new browser tab
      window.open(gameUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Box
        border={4}
        borderColor="#32518f"
        borderRadius={4}
        padding={2}
        display="flex"
        flexDirection="column"
      >
        {/* Displaying currentVersion */}
        <div>Current Version: 0.{currentVersion}</div>
        <div>Play Time: {secondsToDHMS(playTimeSeconds)}</div>
        {/* Display Cells Completed */}
        <div>Cells Currently Completed: {numberOfCompletedCells}</div>
        <div>Total Cells Completed: {totalCellsCompleted}</div>
        {/* Displaying Difficulty */}
        <div>Difficulty: {difficulty}</div>
        <div>Score: {score}</div>

        <Button
          sx={buttonStyle}
          variant="contained"
          color="primary"
          onClick={props.handleTogglePause}
        >
          {props.paused ? "Unpause" : "Pause"}
        </Button>

        {props.isMobile && (
          <Button
            sx={buttonStyle}
            variant="contained"
            color="primary"
            onClick={props.onPlantSeed}
          >
            Plant Seed
          </Button>
        )}
        {props.isMobile && (
          <Button
            sx={buttonStyle}
            variant="contained"
            color="primary"
            onClick={props.onOpenUpgrade}
          >
            Evolve Traits
          </Button>
        )}
        {props.isMobile && (
          <Button
            sx={buttonStyle}
            variant="contained"
            color="primary"
            onClick={props.onOpenMushroomStore}
          >
            Mushroom Store
          </Button>
        )}
        <Tooltip title="Unlock through Berry Bush" arrow>
          <span>
            <Button
              sx={buttonStyle}
              variant="contained"
              color="primary"
              onClick={props.handleOpenMapModal}
              disabled={!purchasedUpgrades.includes("Bush_map")}
            >
              Map
            </Button>
          </span>
        </Tooltip>
        <Button
          sx={buttonStyle}
          variant="contained"
          color="primary"
          onClick={handleResourcesPopupToggle}
        >
          Time Resources
        </Button>

        <Button
          sx={buttonStyle}
          variant="contained"
          color="primary"
          onClick={props.handleOpenReportModal}
        >
          Plant Details
        </Button>

        <Button
          sx={buttonStyle}
          variant="contained"
          color="primary"
          onClick={props.handleOpenHistoryModal}
        >
          Plant History
        </Button>
        <Button
          variant="contained"
          sx={buttonStyle}
          onClick={props.handleOpenHelpModal}
        >
          Help
        </Button>
        <Button
          variant="contained"
          sx={buttonStyle}
          fullWidth
          onClick={() => handleOpenLink("https://discord.gg/2RJMbh3F4P")}
        >
          Join Discord
        </Button>

        {!isElectron && (
          <Button
            variant="contained"
            sx={buttonStyle}
            fullWidth
            onClick={() => handleOpenLink("https://ko-fi.com/footofthehare")}
          >
            Donate
          </Button>
        )}

        <Button
          variant="contained"
          sx={buttonStyle}
          fullWidth
          onClick={handleOpenGameLink}
        >
          {buttonText}
        </Button>

        <Button
          variant="contained"
          sx={redButtonStyle}
          onClick={props.manualSave}
        >
          Manual Save
        </Button>
        <Button
          variant="contained"
          sx={redButtonStyle}
          onClick={props.handleOpenTextboxModal}
        >
          Import/Export Save
        </Button>
        <Button
          variant="contained"
          sx={redButtonStyle}
          onClick={() => props.setOpenDialog(true)}
        >
          Purge Save
        </Button>
      </Box>
      <ResourceProgressDialog
        globalState={globalState}
        isOpen={isResourcesPopupVisible}
        toggleDialog={handleResourcesPopupToggle}
      />

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
