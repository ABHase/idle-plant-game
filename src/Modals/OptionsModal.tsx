import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormControlLabel, Checkbox, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import { toggleRootRotConfirm } from "../Slices/plantTimeSlice";

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

  // Initialize checkbox state from the Redux store
  const [optionChecked, setOptionChecked] = React.useState(rootRotConfirm);

  // Update Redux state and local state when checkbox is toggled
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptionChecked(event.target.checked);
    dispatch(toggleRootRotConfirm());
  };

  const flexDirection = isMobile ? "column" : "row";

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
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          color: "white", // Set the text color to white for all child components
        }}
      >
        <Typography id="options-modal-title" variant="h6" component="h2" mb={2}>
          Options
        </Typography>
        <Box
          display="flex"
          flexDirection={flexDirection}
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControlLabel
            control={
              <StyledCheckbox // Use the styled checkbox here
                checked={optionChecked}
                onChange={handleCheckboxChange}
                name="optionCheckbox"
              />
            }
            label="Ask for confirmation before draining water for Root Rot?"
            sx={{
              color: "white", // Set the label text color to white
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default OptionsModal;
