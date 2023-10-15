import React from "react";
import { Box, Button, Dialog } from "@mui/material";

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
}

const MenuModal: React.FC<Props> = (props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Box
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        width="220px"
        padding={1}
        margin="0 auto"
        display="flex"
        flexDirection="column"
        gap="16px"
      >
        <Button variant="contained" color="primary" onClick={props.onPlantSeed}>
          Plant Seed
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.onOpenUpgrade}
        >
          Evolve Traits
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={props.onOpenMushroomStore}
          style={{ marginTop: "10px" }}
        >
          Mushroom Store
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.handleOpenReportModal}
          style={{ marginTop: "10px" }}
        >
          Plant Details
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={props.handleOpenHistoryModal}
          style={{ marginTop: "10px" }}
        >
          Plant History
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4e86e6", marginTop: "10px" }}
          onClick={props.handleOpenHelpModal}
        >
          Help
        </Button>
        <a
          href="https://discord.gg/eNNEjSBE"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", width: "100%", marginTop: "10px" }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#7289DA" }} // Discord's color
            fullWidth
          >
            Join Discord
          </Button>
        </a>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#942e25", marginTop: "10px" }}
          onClick={() => props.setOpenDialog(true)}
        >
          Purge Save
        </Button>
      </Box>
      {/* Include the modals here, if they are to be part of MenuModal */}
    </Dialog>
  );
};

export default MenuModal;
