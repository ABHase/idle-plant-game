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
  console.log("App component rendered");
  const dispatch = useDispatch();
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
 }, [dispatch, biome]);
 

  const lastUpdateTimeRef = useRef(Date.now());

  function update() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTimeRef.current;

    if (deltaTime >= 1000) {
      const newTime = totalTime + 1;
      dispatch(updateTime(newTime));

      plants.forEach((plant) => {
        dispatch(produceSugar({ plantId: plant.id }));
        dispatch(updateWaterAndSunlight({ plantId: plant.id }));
      });

      lastUpdateTimeRef.current = currentTime;
    }

    requestAnimationFrame(update);
  }

  useEffect(() => {
    if (plants.length > 0) {
      requestAnimationFrame(update);
    }

    return () => {
      // Cleanup code if needed
    };
  }, [dispatch, plants, totalTime]);

  return (
    <div className="App">
      <header className="App-header">
        <BiomeDisplay />
        <PlantTimeDisplay plantTime={plantTime} />
      </header>
    </div>
  );
}

export default App;
