import React, { useState, FC } from "react";
import { exportState, importState } from "../store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
} from "@mui/material";
import { buttonStyle } from "../buttonStyles";

interface TextboxModalProps {
  open: boolean;
  onClose: () => void;
}

const TextboxModal: FC<TextboxModalProps> = ({ open, onClose }) => {
  const [textBoxContent, setTextBoxContent] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const handleConfirmedImport = () => {
    try {
      importState(textBoxContent);
      alert("State successfully imported!");
    } catch (error) {
      alert("Failed to import state");
    }
  };

  const handleExport = () => {
    const exportedState = exportState();
    setTextBoxContent(exportedState);
  };

  const handleImport = () => {
    setConfirmOpen(true);
  };

  const redButtonStyle = {
    my: 1,
    borderRadius: 12,
    border: "1px solid white",
    backgroundColor: "#240000",
    color: "white",
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import/Export State</DialogTitle>
      <DialogContent>
        <TextareaAutosize
          minRows={10}
          style={{ width: "100%" }}
          value={textBoxContent}
          onChange={(e) => setTextBoxContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExport} variant="contained" sx={redButtonStyle}>
          Export to Textbox
        </Button>
        <Button onClick={handleImport} variant="contained" sx={redButtonStyle}>
          Import from Textbox
        </Button>
      </DialogActions>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Import</DialogTitle>
        <DialogContent>
          Importing will overwrite your current state. Are you sure?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleConfirmedImport();
              setConfirmOpen(false);
            }}
            variant="contained"
            sx={redButtonStyle}
          >
            Confirm
          </Button>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="contained"
            sx={buttonStyle}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default TextboxModal;
