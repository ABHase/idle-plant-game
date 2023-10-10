import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useDispatch } from 'react-redux';
import { absorbSunlight, absorbWater } from './plantSlice';

interface PlantListProps {
    biomeId: string;
}

function PlantList({ biomeId }: PlantListProps) {
    const dispatch = useDispatch();

    const plantsObject = useSelector((state: RootState) => state.plant); // Assuming it's an object
    const plantsArray = Object.values(plantsObject); // Convert the object to an array

    // Filter plants based on biomeId and make a display for each matching plant
    const filteredPlants = plantsArray.filter((plant) => plant.biome_id === biomeId);

    // Handle absorbing sunlight
    const handleSunlightAbsorption = (plantId: string) => {
        const amount = 10; // You can adjust the amount as needed
        dispatch(absorbSunlight({ plantId, amount }));
    };

    // Handle absorbing water
    const handleWaterAbsorption = (plantId: string) => {
        const amount = 10; // You can adjust the amount as needed
        dispatch(absorbWater({ plantId, amount }));
    };

    return (
        <div>
            {Array.isArray(filteredPlants) ? (
                filteredPlants.map((plant) => (
                    <div key={plant.id} className="plant-container">
                        <table className="plant-info-table">
                            <tbody>
                                <tr>
                                    <td>Plant ID:</td>
                                    <td>{plant.id}</td>
                                </tr>
                                <tr>
                                    <td>Sunlight:</td>
                                    <td>{plant.sunlight}</td>
                                </tr>
                                <tr>
                                    <td>Water:</td>
                                    <td>{plant.water}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="plant-buttons">
                            <button onClick={() => handleSunlightAbsorption(plant.id)}>Absorb Sunlight</button>
                            <button onClick={() => handleWaterAbsorption(plant.id)}>Absorb Water</button>
                        </div>
                    </div>
                ))
            ) : (
                // Handle the case where 'filteredPlants' is not an array (e.g., show an error message)
                <div>No plants matching the provided biomeId.</div>
            )}
        </div>
    );
    
    
}

export default PlantList;
