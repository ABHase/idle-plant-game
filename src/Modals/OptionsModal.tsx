import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormControlLabel, Checkbox, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import {
  toggleRootRotConfirm,
  toggleshowProductionRate,
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
  const showProductionRate = useSelector(
    (state: RootState) => state.plantTime.showProductionRate
  );

  // Initialize checkbox states from the Redux store
  const [rootRotChecked, setRootRotChecked] = React.useState(rootRotConfirm);
  const [productionRateChecked, setProductionRateChecked] =
    React.useState(showProductionRate);

  // Update Redux state and local state when root rot checkbox is toggled
  const handleRootRotCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRootRotChecked(event.target.checked);
    dispatch(toggleRootRotConfirm());
  };

  // Update Redux state and local state when production rate checkbox is toggled
  const handleProductionRateCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductionRateChecked(event.target.checked);
    dispatch(toggleshowProductionRate());
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
            }}
          />
          <FormControlLabel
            control={
              <StyledCheckbox
                checked={productionRateChecked}
                onChange={handleProductionRateCheckboxChange}
                name="productionRateCheckbox"
              />
            }
            label="Show production rate instead of total water and sunlight?"
            sx={{
              color: "white",
              border: "1px solid white",
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default OptionsModal;
