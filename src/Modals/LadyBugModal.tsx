import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { RootState } from "../rootReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { setLadybugs } from "../Slices/plantSlice";
import { Stack } from "@mui/material";

interface LadyBugModalProps {
  open: boolean;
  onClose: () => void;
}

const LadyBugModal: React.FC<LadyBugModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const aphids = useSelector((state: RootState) => state.plant.aphids);
  const ladybugTax = useSelector((state: RootState) => state.plant.ladybugTax);

  // ... (Any other state elements you might need)

  const handleProtection = () => {
    //Dispatch setLadybugs on the plant slice
    dispatch(setLadybugs());
    onClose();
  };

  const handleDecline = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="ladybug-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320, // Adjusted width for potentially longer content
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          overflow: "auto",
          color: "text.primary",
        }}
      >
        <Typography id="ladybug-modal-title" variant="h6">
          The Lady Bug
        </Typography>
        <Typography variant="body1">
          It looks like you've managed to attract some Aphids. They are
          consuming {aphids} Sugar per second. We can offer you protection if
          you want to convert {(ladybugTax * 100).toFixed(0)}% of your produced
          sunlight and water into Pheromones for 7 days...
        </Typography>
        <Stack direction="row" spacing={1} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleProtection}
          >
            Activate Protection
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDecline}
            sx={{ bgcolor: "#aba096" }}
          >
            Decline Protection
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LadyBugModal;
