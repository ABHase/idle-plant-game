import React, { useEffect, useRef  } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateTime } from './appSlice';
import { RootState } from './store';
import { PlantTimeState } from './plantTimeSlice';
import { initializeBiome } from './biomesSlice';
import BiomeDisplay from './BiomeDisplay';
import { absorbSunlight, absorbWater, initializeNewPlant, produceSugar, updateWaterAndSunlight } from './plantSlice';
import { createSelector } from 'reselect';
import { updateGame } from './gameActions';
import { AppDispatch } from './store';  // Adjust the path if necessary
import GlobalStateDisplay from './GlobalStateDisplay';

const selectPlants = createSelector(
  (state: RootState) => state.plant,
  (plant) => Object.values(plant)
);


function Time(props: { totalTime: number }) {
  return <p>{props.totalTime}</p>;
}

function PlantTimeDisplay(props: { plantTime: PlantTimeState }) {
  return (
    <div>
      <p>Year: {props.plantTime.year}</p>
      <p>Season: {props.plantTime.season}</p>
      <p>Day: {props.plantTime.day}</p>
      <p>Hour: {props.plantTime.hour}:{props.plantTime.update_counter}</p>
    </div>
  );
}

function App() {
  const dispatch: AppDispatch = useDispatch();
  console.log("App component rendered");
  const totalTime = useSelector((state: RootState) => state.app.totalTime);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const biome = useSelector((state: RootState) => state.biomes.find(b => b.name === "Beginner's Garden"));
  const plants = useSelector(selectPlants);

  useEffect(() => {
    if (!biome) {
      console.log("Dispatching initializeBiome action");
      dispatch(initializeBiome("Beginner's Garden"));
    }
    if (biome) {
      dispatch(initializeNewPlant({ biome_id: biome.id }));
    }

    // Call the update function to start the game loop
    update();

    // Cleanup code: stop the loop when the component unmounts
    return () => {
      // You might need to add cleanup logic to stop the requestAnimationFrame loop when component is unmounted
      // If not stopped, it could lead to memory leaks or unwanted behavior.
      // Placeholder for now, we can discuss this further if necessary.
    };
}, [dispatch, biome]);

 

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
    <div className="App">
        <header className="App-header">
        <div className="App-message">
                    Hey there!<br />
                    We've made some significant changes to improve the game.<br />
                    Due to architectural shifts, we're in the process of rebuilding.<br />
                    A big shoutout to some amazing people (like hydroflame) for their guidance!
                </div>
            <GlobalStateDisplay />
            <BiomeDisplay />
            <PlantTimeDisplay plantTime={plantTime} />
        </header>
    </div>
);
}

export default App;
