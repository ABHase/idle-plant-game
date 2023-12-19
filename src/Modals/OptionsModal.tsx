import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormControlLabel, Checkbox, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import {
  toggleNightMode,
  toggleRootRotConfirm,
  toggleRabbitWarning,
} from "../Slices/plantTimeSlice";

interface OptionsModalProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  open,
  onClose,
  isMobile,
}) => {
  const dispatch = useDispatch();
  const rootRotConfirm = useSelector(
    (state: RootState) => state.plantTime.rootRotConfirm
  );
  const nightMode = useSelector(
    (state: RootState) => state.plantTime.nightMode
  );
  const rabbitWarning = useSelector(
    (state: RootState) => state.plantTime.rabbitWarning
  );

  // Initialize checkbox states from the Redux store
  const [rootRotChecked, setRootRotChecked] = React.useState(rootRotConfirm);
  const [nightModeChecked, setNightModeChecked] = React.useState(nightMode);
  const [rabbitWarningChecked, setRabbitWarningChecked] =
    React.useState(rabbitWarning);

  // Update Redux state and local state when root rot checkbox is toggled
  const handleRootRotCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRootRotChecked(event.target.checked);
    dispatch(toggleRootRotConfirm());
  };

  const handleNightModeCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNightModeChecked(event.target.checked);
    dispatch(toggleNightMode());
  };

  const handleRabbitWarningCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRabbitWarningChecked(event.target.checked);
    dispatch(toggleRabbitWarning());
  };

  // Styling the Checkbox with a border
  const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.palette.common.white,
    "&.Mui-checked": {
      color: theme.palette.common.white,
    },
    "& .MuiSvgIcon-root": {
      // Apply the border to the icon within the checkbox
      borderRadius: 2,
      border: "1px solid white", // Customize the border color and width
    },
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="options-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "300px",
          bgcolor: "background.paper",
          border: "2px solid #32518f",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          color: "white", // Set the text color to white for all child components
        }}
      >
        <Typography id="options-modal-title" variant="h6" component="h2" mb={2}>
          Options
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControlLabel
            control={
              <StyledCheckbox
                checked={rootRotChecked}
                onChange={handleRootRotCheckboxChange}
                name="rootRotCheckbox"
              />
            }
            label="Ask for confirmation before draining water for Root Rot?"
            sx={{
              color: "white", // Set the label text color to white
              border: "1px solid white",
              width: "100%",
            }}
          />

          <FormControlLabel
            control={
              <StyledCheckbox
                checked={nightModeChecked}
                onChange={handleNightModeCheckboxChange}
                name="nightModeCheckbox"
              />
            }
            label="Night Mode"
            sx={{
              color: "white",
              border: "1px solid white",
              width: "100%",
            }}
          />
          <FormControlLabel
            control={
              <StyledCheckbox
                checked={rabbitWarningChecked}
                onChange={handleRabbitWarningCheckboxChange}
                name="rabbitWarningCheckbox"
              />
            }
            label="Show warning for rabbit attacks?"
            sx={{
              color: "white",
              border: "1px solid white",
              width: "100%",
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default OptionsModal;
