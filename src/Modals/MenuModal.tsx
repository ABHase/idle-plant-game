import React from "react";
import { Box, Button, Dialog } from "@mui/material";
import { currentVersion } from "../store";

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
  manualSave: () => void;
  isMobile: boolean;
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
        {/* Displaying currentVersion */}
        <div>Current Version: 0.{currentVersion}</div>
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

export default MenuModal;
