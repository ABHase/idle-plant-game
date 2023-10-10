import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import PlantList from './PlantList';

function BiomeDisplay() {
    const biomes = useSelector((state: RootState) => state.biomes);
  
    return (
      <div id="biome-container">
        {biomes.map((biome) => (
          <div key={biome.id} className="biome">
            <h2>{biome.name}</h2>
            <table>
              <PlantList biomeId={biome.id} />
            </table>
            
          </div>
        ))}
      </div>
    );
  }
  

export default BiomeDisplay;
