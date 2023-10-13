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


interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const purchased = useSelector((state: RootState) => state.upgrades.purchased); // Adjust the path if your state structure is different

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="upgrade-modal-title"
    >
      <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 220,
            height: 550,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            overflow: 'auto',
            color: 'text.primary',
        }}
        >
        <Typography id="upgrade-modal-title" variant="h6">Traits for Future Seeds:</Typography>
        {UPGRADES.map(upgrade => (
            <Box key={upgrade.id} mt={2}>
                <Typography variant="body1">{upgrade.name}</Typography>
                <Typography variant="body2">{upgrade.description}</Typography>
                <Typography variant="body2">Cost: {upgrade.cost} DNA</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => {
                        if (purchased.includes(upgrade.id)) {
                            dispatch(sellUpgradeThunk(upgrade.id));
                        } else {
                            dispatch(purchaseUpgradeThunk(upgrade.id));
                        }
                    }}
                >
                    {purchased.includes(upgrade.id) ? 'Sell' : 'Buy'}
                </Button>
            </Box>
        ))}
      </Box>
    </Modal>
  );
};

export default UpgradeModal;
