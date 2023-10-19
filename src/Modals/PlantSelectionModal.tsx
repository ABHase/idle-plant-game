import React, { useState } from "react";
import { PLANT_CONFIGS } from "../plantConfigs";
import {
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

// Existing type definitions for props
interface PlantSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onPlantSelect: (plantType: string) => void;
}

const PlantSelectionModal: React.FC<PlantSelectionModalProps> = ({
  open,
  onClose,
  onPlantSelect,
}) => {
  const descriptions: { [key: string]: string } = {
    Fern: "Requires direct attention early on, prone to aphids.",
    Moss: "Can fully idle without dying, grows very slowly.",
    Grass: "Grows uncontrollably.",
    Succulent: "The desert is harsh and dangerous, be ready.",
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Select a Species, you can change at any time</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Object.keys(PLANT_CONFIGS).map((plantType) => (
          <ButtonBase
            key={plantType}
            onClick={() => {
              onPlantSelect(plantType);
              onClose();
            }}
            sx={{
              width: "90%",
              margin: "5px",
              padding: "5px",
              display: "block",
              backgroundColor: "primary.main",
              color: "black",
              border: "1px solid white",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <Typography variant="h6">{plantType}</Typography>
            <Typography sx={{ fontSize: "16px", marginTop: "5px" }}>
              {descriptions[plantType] || "No description available."}
            </Typography>
          </ButtonBase>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default PlantSelectionModal;
