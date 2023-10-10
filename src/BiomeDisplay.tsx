import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';

function BiomeDisplay() {
  const biomes = useSelector((state: RootState) => state.biomes); // Assuming you named your slice 'biomes'
  console.log(biomes.map(biome => biome.id));
  // Render the list of biomes
  return (
    <div id="biome-container">
      {biomes.map((biome, biomeIndex) => (
        <div key={biome.id} className="biome" id={`biome-${biome.id}`}>
          <h2 id={`biome-header-${biomeIndex}`}>
            {/* ... You can render biome details here ... */}
            {biome.name}
          </h2>
          <table>
            {/* ... You can render more biome details here ... */}
          </table>
        </div>
      ))}
    </div>
  );
}

export default BiomeDisplay;
