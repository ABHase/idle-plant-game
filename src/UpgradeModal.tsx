import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { UPGRADES } from './upgrades';
import { purchaseUpgrade } from './upgradesSlice';
import { RootState } from './rootReducer';
import { purchaseUpgradeThunk, sellUpgradeThunk } from './gameActions';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { ButtonBase } from '@mui/material';


interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const purchased = useSelector((state: RootState) => state.upgrades.purchased);
  const geneticMarkers = useSelector((state: RootState) => state.globalState.geneticMarkers);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upgrade-modal-title">
      <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 220,
            height: 450,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: 3,
            boxShadow: 24,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            color: 'text.primary',
        }}
      >
        {/* This is the header Box that won't scroll */}
        <Box>
        <Typography variant="body1">DNA: {geneticMarkers}</Typography>
          <Typography id="upgrade-modal-title" variant="h6">
            Traits for Future Seeds:
          </Typography>
          {/* You can add other header content here, like DNA count */}
        </Box>

        {/* This Box will be scrollable and contains all the upgrades */}
        <Box
          sx={{
            overflow: 'auto',
            flexGrow: 1, 
            color: 'text.primary',
          }}
        >
          {UPGRADES.map(upgrade => (
            <ButtonBase 
            key={upgrade.id} 
            onClick={() => {
                if (purchased.includes(upgrade.id)) {
                    dispatch(sellUpgradeThunk(upgrade.id));
                } else {
                    dispatch(purchaseUpgradeThunk(upgrade.id));
                }
            }}
            sx={{ 
              width: '100%', 
              display: 'block', 
              borderRadius: 2, 
              textAlign: 'left',
              mt: 2, 
              p: 1,
              bgcolor: purchased.includes(upgrade.id) ? 'primary.light' : 'background.default',
              '&:hover': {
                bgcolor: '#38200f',
                color: 'text.primary',
              }
            }}
          >
            <Box>
              <Typography variant="body1">{upgrade.name}</Typography>
              <Typography variant="body2">Cost: {upgrade.cost} DNA</Typography>
              <Typography variant="body2">{upgrade.description}</Typography>
              <Typography variant="body2" fontWeight="bold">
                {purchased.includes(upgrade.id) ? 'Sell' : 'Buy'}
              </Typography>
            </Box>
          </ButtonBase>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default UpgradeModal;
