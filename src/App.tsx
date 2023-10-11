import React, { useEffect, useRef  } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { absorbSunlight, absorbWater, initializeNewPlant, produceSugar, updateWaterAndSunlight } from './plantSlice';
import { createSelector } from 'reselect';
import { updateGame } from './gameActions';
import { AppDispatch } from './store';  // Adjust the path if necessary
import GlobalStateDisplay from './GlobalStateDisplay';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import PlantTimeDisplay from './PlantTimeDisplay';
import PlantList from './PlantList';

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
    fontFamily: "'YOUR_FONT_NAME', sans-serif", // Remember to replace 'YOUR_FONT_NAME'
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

  useEffect(() => {
    // Call the update function to start the game loop
    update();

    // Cleanup code: stop the loop when the component unmounts
    return () => {
      // You might need to add cleanup logic to stop the requestAnimationFrame loop when component is unmounted
      // If not stopped, it could lead to memory leaks or unwanted behavior.
      // Placeholder for now, we can discuss this further if necessary.
    };
}, [dispatch]);

 

  const lastUpdateTimeRef = useRef(Date.now());

  function update() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTimeRef.current;

    if (deltaTime >= 1000) {
        dispatch(updateGame());  // This will now handle the time update correctly
        lastUpdateTimeRef.current = currentTime;
    }

    requestAnimationFrame(update);
}

return (
  <ThemeProvider theme={theme}>
    
        <Box 
      display="flex" 
      flexDirection="column" 
      //alignItems="flex-start"  // This will align content to the left
      justifyContent="flex-start"  // This will align content to the top
      height="100vh" 
      bgcolor="background.default"
      color="text.primary"
    >
        <header className="App-header">
          
            
            <PlantList />
            <GlobalStateDisplay />
          <PlantTimeDisplay plantTime={plantTime} />  
        </header>
    </Box>

    </ThemeProvider>
);
}

export default App;
