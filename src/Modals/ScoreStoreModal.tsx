import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  deductScore,
  toggleJukeboxUnlock,
  unlockSong,
} from "../Slices/appSlice";
import { RootState } from "../rootReducer";
import { ButtonBase, Stack } from "@mui/material";
import { songs } from "../Components/Jukebox";

const songUnlockCost = 10; // Define cost for unlocking a song
const jukeboxUnlockCost = 2; // Define cost for unlocking the Jukebox

interface ScoreStoreModalProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const ScoreStoreModal: React.FC<ScoreStoreModalProps> = ({
  open,
  onClose,
  isMobile,
}) => {
  const dispatch = useDispatch();
  const score = useSelector((state: RootState) => state.app.score);
  const unlockedSongs = useSelector(
    (state: RootState) => state.app.unlockedSongs
  );
  const jukeboxUnlocked = useSelector(
    (state: RootState) => state.app.jukeboxUnlocked
  );

  const handleUnlockSong = (songKey: string) => {
    if (score >= songUnlockCost) {
      dispatch(deductScore(songUnlockCost));
      dispatch(unlockSong(songKey));
    }
  };

  const handleUnlockJukebox = () => {
    if (score >= jukeboxUnlockCost) {
      dispatch(deductScore(jukeboxUnlockCost));
      dispatch(toggleJukeboxUnlock());
    }
  };

  // Custom button style
  const customButtonStyle = {
    my: 1,
    borderRadius: 2,
    border: "1px solid white",
    backgroundColor: "#090924",
    disabledBackground: "#090924",
    color: "white",
    width: "100%",
    padding: "8px",
    "&:hover": {
      backgroundColor: "#1C1C3A",
      color: "#E0E0E0",
    },
    "&:disabled": {
      backgroundColor: "#3C3C4D",
      color: "#black",
      cursor: "not-allowed",
    },
  };

  const getButtonStyles = (isUnlocked: boolean, canAfford: boolean) => ({
    my: 1,
    borderRadius: 2,
    border: "1px solid white",
    backgroundColor: isUnlocked ? "#3C3C4D" : canAfford ? "#090924" : "#2D2D2D",
    color: isUnlocked ? "lightgray" : canAfford ? "white" : "darkgray",
    width: "100%",
    padding: "8px",
    "&:hover": {
      backgroundColor: isUnlocked
        ? "#3C3C4D"
        : canAfford
        ? "#1C1C3A"
        : "#2D2D2D",
      color: isUnlocked ? "lightgray" : canAfford ? "#E0E0E0" : "darkgray",
    },
    "&.Mui-disabled": {
      backgroundColor: isUnlocked ? "#3C3C4D" : "#2D2D2D",
      color: isUnlocked ? "lightgray" : "darkgray",
      cursor: "default",
    },
  });

  const renderSongButtons = () => {
    return Object.entries(songs).map(([songKey, song]) => {
      const isUnlocked = unlockedSongs[songKey];
      const canAfford = score >= songUnlockCost;
      const buttonStyles = getButtonStyles(isUnlocked, canAfford);

      return (
        <ButtonBase
          key={songKey}
          onClick={() => !isUnlocked && canAfford && handleUnlockSong(songKey)}
          disabled={isUnlocked || !canAfford}
          sx={buttonStyles}
        >
          <Stack direction="column" spacing={1} alignItems="center">
            <Typography variant="h6">
              {song.name} Song: {songUnlockCost} Points
            </Typography>
            <Typography variant="body2" component="p">
              {isUnlocked
                ? `${song.name} already unlocked!`
                : canAfford
                ? `Unlock ${song.name} to add it to the Jukebox!`
                : `Need more points to unlock ${song.name}`}
            </Typography>
          </Stack>
        </ButtonBase>
      );
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="score-store-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "300px" : "400px", // Responsive width
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderColor: "#32518f",
          boxShadow: 24,
          p: 2,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          color: "white",
          maxHeight: "90vh", // Adjust as needed to not overflow the screen
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        {/* The non-scrollable part */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: 4, width: "100%" }}
        >
          <Typography
            id="score-store-modal-title"
            variant="h6"
            component="h2"
            mb={1}
          >
            Score Store
          </Typography>
          <Typography>You have {score} points</Typography>
        </Stack>

        {/* The scrollable part */}
        <Box
          sx={{
            mt: 2, // Add some margin top for spacing
            flexDirection: "column",
            overflowY: "auto", // Enable vertical scrolling
            maxHeight: "65vh", // Adjust this value as needed
          }}
        >
          <ButtonBase
            onClick={() => handleUnlockJukebox()}
            disabled={jukeboxUnlocked || score < jukeboxUnlockCost}
            sx={getButtonStyles(jukeboxUnlocked, score >= jukeboxUnlockCost)}
          >
            <Stack direction="column" spacing={1} alignItems="center">
              <Typography variant="h6">
                Jukebox: {jukeboxUnlockCost} Points
              </Typography>

              <Typography variant="body2" component="p">
                {jukeboxUnlocked
                  ? "Jukebox already unlocked!"
                  : "Unlock the Jukebox to replace the default music player!"}
              </Typography>
            </Stack>
          </ButtonBase>
          {renderSongButtons()}
        </Box>
      </Box>
    </Modal>
  );
};

export default ScoreStoreModal;
