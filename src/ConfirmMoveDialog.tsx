import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

type ConfirmMoveDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentPlantType: string;
};

const ConfirmMoveDialog: React.FC<ConfirmMoveDialogProps> = ({
  open,
  onClose,
  onConfirm,
  currentPlantType,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-move-title"
      aria-describedby="confirm-move-description"
    >
      <DialogTitle id="confirm-move-title">Confirm Move</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-move-description">
          Complete the Current Cell as a {currentPlantType}. This will reset all
          upgrades and DNA.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmMoveDialog;
