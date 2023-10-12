import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './rootReducer';
import { absorbSunlight, absorbWater, initializeNewPlant, produceSugar, updateWaterAndSunlight } from './plantSlice';
import { createSelector } from 'reselect';
import { updateGame } from './gameActions';
import store, { AppDispatch } from './store';  // Adjust the path if necessary
import GlobalStateDisplay from './GlobalStateDisplay';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import PlantTimeDisplay from './PlantTimeDisplay';
import PlantList from './PlantList';
import { clearState, saveState } from './localStorage';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ConfirmEvolveDialog from './ConfirmEvolveDialog';
import { Button } from '@mui/material';
import { resetApp } from './appSlice';
import { resetGlobalState } from './gameStateSlice';
import { resetPlant } from './plantSlice';
import { resetPlantTime } from './plantTimeSlice';
import { evolvePlant } from './plantSlice';
import UpgradeModal from './UpgradeModal';


const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',  // A more vibrant forest green for buttons and highlights
    },
    secondary: {
      main: '#607D8B',  // Bluish-grey, reminiscent of a night sky or moonlit water
    },
    background: {
      default: '#1f1107',  // A very dark green, almost black, like deep woods at night
      paper: '#2E4A38',  // A slightly lighter green, like forest undergrowth in moonlight
    },
    text: {
      primary: '#FFFFFF',  // Pure white for text to ensure good contrast against the dark background
      secondary: '#B0BEC5',  // A lighter grey, used for secondary text elements
    }
  },
  typography: {
    fontFamily: "'YOUR_FONT_NAME', lato", // Remember to replace 'YOUR_FONT_NAME'
  },
  // Add any other theme customizations here
});


const selectPlants = createSelector(
  (state: RootState) => state.plant,
  (plant) => Object.values(plant)
);

function App() {
  const dispatch: AppDispatch = useDispatch();
  console.log("App component rendered");
  const totalTime = useSelector((state: RootState) => state.app.totalTime);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const plants = useSelector(selectPlants);
  const [openDialog, setOpenDialog] = React.useState(false);
  const purchasedUpgrades = useSelector((state: RootState) => state.upgrades.purchased);

  const handleDeleteConfirm = () => {
    clearState(); // Clear the state from localStorage
  
    // Reset state for each slice
    dispatch(resetApp());
    dispatch(resetGlobalState());
    dispatch(resetPlant());
    dispatch(resetPlantTime());
  

    window.location.reload();
  
  };

  const [evolveDialogOpen, setEvolveDialogOpen] = useState(false);

  const handleEvolve = () => {
      dispatch(evolvePlant(purchasedUpgrades));
  };
  

  useEffect(() => {
    // Call the update function to start the game loop
    update();
    // Cleanup code: stop the loop when the component unmounts
    return () => {

    };
}, [dispatch]);

 

  const lastUpdateTimeRef = useRef(Date.now());
  const saveCounterRef = useRef(0);


  function update() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTimeRef.current;

    if (deltaTime >= 1000) {
        dispatch(updateGame());
        lastUpdateTimeRef.current = currentTime;

        // Increment the save counter
        saveCounterRef.current += 1;

        // Check if the save counter reaches 30
        if (saveCounterRef.current === 30) {
            // Save the state to localStorage
            saveState(store.getState());

            // Reset the counter
            saveCounterRef.current = 0;
        }
    }

    requestAnimationFrame(update);
}

const [modalOpen, setModalOpen] = useState(false);

const handleOpenModal = () => {
  setModalOpen(true);
};

const handleCloseModal = () => {
  setModalOpen(false);
};


return (
  <ThemeProvider theme={theme}>
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="flex-start"
      height="100vh" 
      bgcolor="background.default"
      color="text.primary"
    >
      <header className="App-header">
      <Box 
        border={1} 
        borderColor="grey.300" 
        borderRadius={2}
        width="320px"
        padding={1}
        margin= "0 auto"
      >
        <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setEvolveDialogOpen(true)}
            sx={{ mr: 8 }}
        >
            Plant Seed
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Evolve Traits
        </Button>

        <ConfirmEvolveDialog
            open={evolveDialogOpen}
            onClose={() => setEvolveDialogOpen(false)}
            onConfirm={handleEvolve}
        />
      </Box>        
        <PlantTimeDisplay plantTime={plantTime} /> 
        <GlobalStateDisplay />
        <PlantList />


      <UpgradeModal open={modalOpen} onClose={handleCloseModal} />
      </header>
      
      {/* Spacer */}
      <Box flexGrow={1}></Box>

      {/* Button at the bottom */}
      <Box pb={2} textAlign="center">
      <Button onClick={() => setOpenDialog(true)} style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
        Purge Save
      </Button>
      <ConfirmDeleteDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onConfirm={handleDeleteConfirm}
      />
      </Box>
    </Box>
  </ThemeProvider>
);

}

export default App;

