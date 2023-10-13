import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { MUSHROOM_ITEMS } from './mushroomItems';
import { RootState } from './rootReducer';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface MushroomStoreModalProps {
    open: boolean;
    onClose: () => void;
}

const MushroomStoreModal: React.FC<MushroomStoreModalProps> = ({ open, onClose }) => {
    const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
    const sugar = useSelector((state: RootState) => state.plant.sugar);
    const currentState = useSelector((state: RootState) => state); // Retrieve the whole state here

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="mushroom-store-modal-title"
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
                }}
            >
                <Typography id="mushroom-store-modal-title" variant="h6">Mushroom Store:</Typography>
                {MUSHROOM_ITEMS.map(item => (
                    <Box key={item.id} mt={2}>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body2">{item.description}</Typography>
                        <Typography variant="body2">Cost: {item.cost} sugar</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => {
                                // Use the fetched state directly
                                item.effect(dispatch, () => currentState);
                            }}
                            disabled={sugar < item.cost}
                        >
                            Buy
                        </Button>
                    </Box>
                ))}
            </Box>
        </Modal>
    );
};

export default MushroomStoreModal;
