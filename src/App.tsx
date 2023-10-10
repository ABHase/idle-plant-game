import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateTime } from './appSlice';  
import { RootState } from './store';     
import { PlantTimeState } from './plantTimeSlice';
import { initializeBiome } from './biomesSlice';
import BiomeDisplay from './BiomeDisplay';


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

// This useEffect will run only once when the component mounts
useEffect(() => {
  console.log("Dispatching initializeBiome action");  // Debugging line
  dispatch(initializeBiome("Beginner's Garden"));
}, [dispatch]);

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
        <BiomeDisplay />
        <Time totalTime={totalTime} />
        <PlantTimeDisplay plantTime={plantTime} />
      </header>
    </div>
  );
}

export default App;
