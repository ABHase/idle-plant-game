import React from "react";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RootState } from "../rootReducer";
import { PlantHistoryEntry } from "../Slices/plantHistorySlice";

interface PlantHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

type PlantHistoryKey =
  | "sizeReached"
  | "totalWaterAbsorbed"
  | "totalSunlightAbsorbed"
  | "totalSugarCreated";

const categories: { title: string; key: PlantHistoryKey }[] = [
  { title: "Best Size Reached", key: "sizeReached" },
  { title: "Most Water Absorbed", key: "totalWaterAbsorbed" },
  { title: "Most Sunlight Absorbed", key: "totalSunlightAbsorbed" },
  { title: "Most Sugar Created", key: "totalSugarCreated" },
];

const PlantHistoryModal: React.FC<PlantHistoryModalProps> = ({
  open,
  onClose,
}) => {
  const plantHistory = useSelector(
    (state: RootState) => state.plantHistory.entries
  );

  const bestPlants = categories.map((category) => {
    return {
      ...category,
      plant: plantHistory.reduce(
        (best: PlantHistoryEntry | null, entry: PlantHistoryEntry) => {
          if (!best) return entry;
          return entry[category.key] > best[category.key] ? entry : best;
        },
        null as PlantHistoryEntry | null
      ),
    };
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="plant-history-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "80%",
          maxHeight: "80%",
          bgcolor: "secondary.main",
          border: "2px solid #000",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          overflow: "auto",
          color: "text.primary",
        }}
      >
        <Typography id="plant-history-modal-title" variant="h6">
          Best Plants in Each Category:
        </Typography>
        {bestPlants.map((category, index) => (
          <Box key={index} mt={2}>
            <Typography variant="h6">{category.title}:</Typography>
            {category.plant ? (
              <>
                <Typography variant="body2">
                  Planted: {category.plant.datePlanted}
                </Typography>
                <Typography variant="body2">
                  Replaced: {category.plant.dayReplaced}
                </Typography>
                <Typography variant="body2">
                  Size Reached: {category.plant.sizeReached}
                </Typography>
                <Typography variant="body2">
                  Total Water Absorbed:{" "}
                  {formatNumberWithDecimals(category.plant.totalWaterAbsorbed)}
                </Typography>
                <Typography variant="body2">
                  Total Sunlight Absorbed:{" "}
                  {formatNumberWithDecimals(
                    category.plant.totalSunlightAbsorbed
                  )}
                </Typography>
                <Typography variant="body2">
                  Total Sugar Created:{" "}
                  {formatNumberWithDecimals(category.plant.totalSugarCreated)}
                </Typography>
              </>
            ) : (
              <Typography variant="body2">
                No plants available for this category.
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Modal>
  );
};

export function formatNumberWithDecimals(value: number): string {
  const absValue = Math.abs(value);

  let formattedValue;

  if (absValue >= 1_000_000_000_000) {
    formattedValue = (absValue / 1_000_000_000_000).toFixed(2) + "T";
  } else if (absValue >= 1_000_000_000) {
    formattedValue = (absValue / 1_000_000_000).toFixed(2) + "B";
  } else if (absValue >= 1_000_000) {
    formattedValue = (absValue / 1_000_000).toFixed(2) + "M";
  } else if (absValue >= 1_000) {
    formattedValue = (absValue / 1_000).toFixed(2) + "K";
  } else {
    formattedValue = absValue.toFixed(2);
  }

  // Apply the sign
  return value < 0 ? "-" + formattedValue : formattedValue;
}

export default PlantHistoryModal;
