// ConfirmEvolveDialog.tsx

import React from "react";
import { useSelector } from "react-redux"; // <-- Add this import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { RootState } from "./rootReducer"; // <-- Add this import
import { UPGRADES } from "./upgrades"; // <-- Add this import
import { Typography } from "@mui/material";

interface ConfirmEvolveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmEvolveDialog: React.FC<ConfirmEvolveDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const purchased = useSelector((state: RootState) => state.upgrades.purchased); // <-- Fetch purchased upgrades

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Evolve Plant?"}</DialogTitle>
      <DialogContent style={{ maxHeight: "300px", overflowY: "auto" }}>
        <DialogContentText>
          Are you sure you want to plant a new seed, DNA progress will not be
          reset with plant resources. This action cannot be undone, and will
          start a new plant with the following traits:
        </DialogContentText>
        {/* Display purchased traits */}
        {purchased.map((id) => {
          const trait = UPGRADES.find((upgrade) => upgrade.id === id);
          return (
            <Typography key={id} variant="body2">
              - {trait?.name} ({trait?.description})
            </Typography>
          );
        })}
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
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmEvolveDialog;
