import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface VictoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const VictoryDialog: React.FC<VictoryDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "escapeKeyDown" && reason !== "backdropClick") {
          onClose();
        }
      }}
      aria-labelledby="victory-dialog-title"
      aria-describedby="victory-dialog-description"
      disableEscapeKeyDown={true}
    >
      <DialogTitle id="victory-dialog-title">Congratulations!</DialogTitle>
      <DialogContent>
        <DialogContentText id="victory-dialog-description">
          You have completed the game! Incredible!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VictoryDialog;
