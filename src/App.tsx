import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateTime } from './appSlice';  
import { RootState } from './store';     
import { PlantTimeState } from './plantTimeSlice';
import { initializeBiome } from './biomesSlice';
import BiomeDisplay from './BiomeDisplay';
import { initializeNewPlant } from './plantSlice';


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
  const dispatch = useDispatch();
  const totalTime = useSelector((state: RootState) => state.app.totalTime);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const biome = useSelector((state: RootState) => state.biomes.find(b => b.name === "Beginner's Garden"));

  // This useEffect will run only once when the component mounts
  useEffect(() => {
    // Initialize the biome
    console.log("Dispatching initializeBiome action");
    dispatch(initializeBiome("Beginner's Garden"));

    // After initializing the biome, get its ID from the Redux state
    if (biome) {
      // Initialize the plant with the biome's ID
      dispatch(initializeNewPlant({ biome_id: biome.id }));
    }
  }, [dispatch, biome]);

  // This useEffect will run every time totalTime changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = totalTime + 1;
      dispatch(updateTime(newTime));  
    }, 200);

    return () => clearInterval(interval);
  }, [totalTime, dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plant App</h1>
        <p>Total Time: {totalTime}</p>
        <BiomeDisplay /> 
        <PlantTimeDisplay plantTime={plantTime} />
      </header>
    </div>
  );
}
export default App;
