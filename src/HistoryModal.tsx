import React from 'react';
import { useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RootState } from './rootReducer';

interface PlantHistoryModalProps {
    open: boolean;
    onClose: () => void;
}

const PlantHistoryModal: React.FC<PlantHistoryModalProps> = ({ open, onClose }) => {
  const plantHistory = useSelector((state: RootState) => state.plantHistory.entries); // Adjust the path if your state structure is different

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="plant-history-modal-title"
    >
      <Box
        sx={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 220,
            height: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            overflow: 'auto',
        }}
        >
        <Typography id="plant-history-modal-title" variant="h6">Plant Growth History:</Typography>
        {plantHistory.map((entry, index) => (
            <Box key={index} mt={2}>
                <Typography variant="body2">Planted: {entry.datePlanted}</Typography>
                <Typography variant="body2">Replaced: {entry.dayReplaced}</Typography>
                <Typography variant="body2">Size Reached: {entry.sizeReached}</Typography>
                <Typography variant="body2">Total Water Absorbed: {formatNumberWithDecimals(entry.totalWaterAbsorbed)}</Typography>
                <Typography variant="body2">Total Sunlight Absorbed: {formatNumberWithDecimals(entry.totalSunlightAbsorbed)}</Typography>
                <Typography variant="body2">Total Sugar Created: {formatNumberWithDecimals(entry.totalSugarCreated)}</Typography>
            </Box>
        ))}
      </Box>
    </Modal>
  );
};

function formatNumberWithDecimals(value: number): string {
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(2) + 'M';
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(2) + 'K';
    } else {
        return value.toFixed(2);
    }
}



export default PlantHistoryModal;
