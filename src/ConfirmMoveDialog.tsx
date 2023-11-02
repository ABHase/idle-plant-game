import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Sugar } from "./Components/Sugar";
import { useSelector } from "react-redux";
import { RootState } from "./rootReducer";

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
  const sugar = useSelector((state: RootState) => state.plant.sugar);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-move-title"
      aria-describedby="confirm-move-description"
      PaperProps={{
        style: {
          borderRadius: 12,
          border: "1px solid white",
        },
      }}
    >
      <DialogTitle id="confirm-move-title">Confirm Move</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-move-description">
          Complete the Current Cell as a {currentPlantType}. This will reset all
          upgrades and DNA. You will start the new cell with any adjacency
          bonuses. The cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#090924",
            color: "#fff",
            borderRadius: 12,
            border: "1px solid white",
          }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          sx={{
            backgroundColor: "#090924",
            color: "#fff",
            borderRadius: 12,
            border: "1px solid white",
            "&:disabled": {
              backgroundColor: "#3C3C4D",
              color: "white",
              cursor: "not-allowed",
            },
          }}
          variant="contained"
          autoFocus
          disabled={sugar < 1000000000}
        >
          <Sugar amount={1000000000} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmMoveDialog;
