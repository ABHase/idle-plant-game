import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './rootReducer';
import { absorbSunlight, absorbWater, initializeNewPlant, produceSugar, updateWaterAndSunlight } from './plantSlice';
import { createSelector } from 'reselect';
import { evolveAndRecordPlant, updateGame } from './gameActions';
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
import { resetUpgrades } from './upgradesSlice';
import HistoryModal from './HistoryModal';
import HelpModal from './HelpModal';
import MenuModal from './MenuModal';
import MushroomStoreModal from './MushroomStoreModal';



const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',  // A more vibrant forest green for buttons and highlights
    },
    secondary: {
      main: '#607D8B',  // Bluish-grey, reminiscent of a night sky or moonlit water
    },
    background: {
      default: '#1f1107',  // A very dark brown, almost black, like deep woods at night
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
  const isTimeBoostActive = useSelector((state: RootState) => state.timeBoost);

  const handleDeleteConfirm = () => {
    clearState(); // Clear the state from localStorage
  
    // Reset state for each slice
    dispatch(resetApp());
    dispatch(resetGlobalState());
    dispatch(resetPlant());
    dispatch(resetPlantTime());
    dispatch(resetUpgrades());
  

    window.location.reload();
  
  };

  const [evolveDialogOpen, setEvolveDialogOpen] = useState(false);

const handleEvolve = () => {
  dispatch(evolveAndRecordPlant(purchasedUpgrades));
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
    const timeElapsed = currentTime - lastUpdateTimeRef.current;

    if (!isTimeBoostActive && timeElapsed >= 1000) {
        const numTicksMissed = Math.floor(timeElapsed / 1000);
        
        for (let i = 0; i < numTicksMissed; i++) {
            dispatch(updateGame());
            
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
        
        lastUpdateTimeRef.current = currentTime;
    }

    requestAnimationFrame(update);
}

const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
const [historyModalOpen, setHistoryModalOpen] = useState(false);
const [helpModalOpen, setHelpModalOpen] = useState(true);
const [menuModalOpen, setMenuModalOpen] = useState(false);
const [mushroomStoreModalOpen, setMushroomStoreModalOpen] = useState(false);

const handleOpenMushroomStoreModal = () => {
  setMushroomStoreModalOpen(true);
}

const handleCloseMushroomStoreModal = () => {
  setMushroomStoreModalOpen(false);
}

const handleOpenUpgradeModal = () => {
  setUpgradeModalOpen(true);
};

const handleCloseUpgradeModal = () => {

  setUpgradeModalOpen(false);
};

const handleOpenHistoryModal = () => {
  setHistoryModalOpen(true);
};

const handleCloseHistoryModal = () => {
  console.log("Closing History Modal");
  setHistoryModalOpen(false);
};

const handleOpenHelpModal = () => {
  setHelpModalOpen(true);
};

const handleCloseHelpModal = () => {
  setHelpModalOpen(false);
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
    margin="0 auto"
>
      <Button 
              variant="contained" 
              onClick={() => setMenuModalOpen(true)}
              sx={{ width: '100%', mt: 1, mb: 1 }}  // This will set the width to 90% of the parent and add some margin at the top and bottom
          >
              Open Menu
          </Button>
      </Box>
        
        <PlantTimeDisplay plantTime={plantTime} /> 
        <GlobalStateDisplay />
        <PlantList />


      <UpgradeModal open={upgradeModalOpen} onClose={handleCloseUpgradeModal} />
      
      </header>
      <ConfirmDeleteDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onConfirm={handleDeleteConfirm}
      />
      <HistoryModal open={historyModalOpen} onClose={handleCloseHistoryModal} />
      <HelpModal open={helpModalOpen} onClose={handleCloseHelpModal} />
      <ConfirmEvolveDialog
            open={evolveDialogOpen}
            onClose={() => setEvolveDialogOpen(false)}
            onConfirm={handleEvolve}
        />
        <MenuModal
          open={menuModalOpen}
          onClose={() => setMenuModalOpen(false)}
          onOpenUpgrade={handleOpenUpgradeModal}
          onPlantSeed={() => setEvolveDialogOpen(true)}
          historyModalOpen={historyModalOpen}
          handleOpenHistoryModal={handleOpenHistoryModal}
          handleCloseHistoryModal={handleCloseHistoryModal}
          helpModalOpen={helpModalOpen}
          handleOpenHelpModal={handleOpenHelpModal}
          handleCloseHelpModal={handleCloseHelpModal}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onOpenMushroomStore={handleOpenMushroomStoreModal}

          

        />
        <MushroomStoreModal open={mushroomStoreModalOpen} onClose={handleCloseMushroomStoreModal} />

      
    </Box>
  </ThemeProvider>
);

}

export default App;

