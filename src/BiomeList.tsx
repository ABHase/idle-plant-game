import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { Biome } from './biomesSlice';

const BiomeList: React.FC = () => {
  const biomes = useSelector((state: RootState) => state.biomes);
  const dispatch = useDispatch();

  // Define the methods to handle UI logic
  
  return (
    <div>
      {biomes.map((biome) => (
        <div key={biome.id}>
          {/* Biome display logic here */}
        </div>
      ))}
    </div>
  );
}

export default BiomeList;

export {};  // Add this line
