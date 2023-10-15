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
        padding={1}
        display="flex"
        flexDirection="column"
      >
        <Button
          sx={{ my: 1 }}
          variant="contained"
          color="primary"
          onClick={props.onPlantSeed}
        >
          Plant Seed
        </Button>
        <Button
          sx={{ my: 1 }}
          variant="contained"
          color="primary"
          onClick={props.onOpenUpgrade}
        >
          Evolve Traits
        </Button>

        <Button
          sx={{ my: 1 }}
          variant="contained"
          color="primary"
          onClick={props.onOpenMushroomStore}
        >
          Mushroom Store
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
          href="https://discord.gg/eNNEjSBE"
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

export default MenuModal;