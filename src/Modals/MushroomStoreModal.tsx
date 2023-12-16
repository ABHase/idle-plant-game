import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MushroomStoreDesktopDisplay from "../MushroomStoreDesktopDisplay";

interface MushroomStoreModalProps {
  open: boolean;
  onClose: () => void;
}

const MushroomStoreModal: React.FC<MushroomStoreModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="mushroom-store-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          maxWidth: "80%",
          maxHeight: "80%",
          bgcolor: "#3b0a01",
          border: "4px solid #857471",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,

          overflow: "auto",
          color: "text.primary",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#701201",
            color: (theme) => theme.palette.grey[500],
            border: "4px solid #857471",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Use the desktop display component here */}
        <MushroomStoreDesktopDisplay />
      </Box>
    </Modal>
  );
};

export default MushroomStoreModal;
