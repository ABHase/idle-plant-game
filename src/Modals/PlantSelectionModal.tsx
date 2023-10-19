import React, { useState } from "react";
import { PLANT_CONFIGS } from "../plantConfigs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Card,
} from "@mui/material";

// Type definitions for props
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
  const [isPlantSelected, setIsPlantSelected] = useState(false);

  const descriptions: { [key: string]: string } = {
    Fern: "Requires direct attention early on, prone to aphids.",
    Moss: "Can fully idle without dying, grows very slowly.",
    Grass: "Grows uncontrollably.",
    Succulent: "The desert is harsh and dangerous, be ready.",
  };

  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
      >
        Select a Plant Type, you can change at any time
      </DialogTitle>
      <DialogContent
        sx={{ backgroundColor: (theme) => theme.palette.background.default }}
      >
        {Object.keys(PLANT_CONFIGS).map((plantType) => (
          <Card
            key={plantType}
            onClick={() => {
              onPlantSelect(plantType);
              onClose();
            }}
            sx={{
              margin: "10px",
              padding: "10px",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Typography variant="h6">{plantType}</Typography>
            <Typography sx={{ fontSize: "16px", marginTop: "5px" }}>
              {descriptions[plantType] || "No description available."}
            </Typography>
          </Card>
        ))}
        <Typography
          sx={{ fontSize: "12px", textAlign: "center", marginTop: "20px" }}
        >
          There is a help section in the menu.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default PlantSelectionModal;
