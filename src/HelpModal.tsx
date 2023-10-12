import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import GrainIcon from '@mui/icons-material/Grain';
import GrassIcon from '@mui/icons-material/Grass';
import SpaIcon from '@mui/icons-material/Spa';
import ParkIcon from '@mui/icons-material/Park';

interface HelpModalProps {
    open: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="help-modal-title"
    >
      <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 220,
            height: 'auto',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            overflow: 'auto',
        }}
        >
        <Typography id="help-modal-title" variant="h6" mb={2}>Game Guide:</Typography>
        <Box display="flex" alignItems="center" mb={1}>
            <WbSunnyIcon sx={{ fontSize: 22, color: 'orange' }}  /><Typography variant="body2"> - Sunlight mixes with water to make sugar during photosynthesis.</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
            <OpacityIcon sx={{ fontSize: 22, color: 'blue' }} /><Typography variant="body2"> - Water mixes with sunlight to make sugar, it also is consumed by leaves.</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
            <SpaIcon sx={{ fontSize: 22, color: 'green' }}  /><Typography variant="body2"> - Leaves passively absorb sunlight.</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
            <GrassIcon sx={{ fontSize: 22, color: 'grey', transform: 'rotate(180deg)' }} /><Typography variant="body2"> - Roots passively absorb water.</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
            <GrainIcon color="primary" /><Typography variant="body2"> - Sugar is used to buy roots and leaves, and to convert to DNA in batches of 100.</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
        <ParkIcon sx={{ fontSize: 22, color: 'green' }}  /><Typography variant="body2"> - This represents the size of your plant. A bigger plant is better for producing sugar, but as it grows, creating more sugar will require more sunlight and water.</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">Use water and sunlight to produce sugar, which lets you grow roots and leaves. Collect DNA and invest in traits to enhance future seeds. Each new seed inherits past traits but starts over.  Your old plants are gone but remembered in the history tab.</Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default HelpModal;

