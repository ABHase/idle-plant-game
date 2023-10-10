import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { absorbSunlight, absorbWater, toggleSugarProduction, buyLeaves, buyRoots } from './plantSlice'; // Import the toggleSugarProduction action

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

    // Handle toggling sugar production
    const handleToggleSugarProduction = (plantId: string) => {
        dispatch(toggleSugarProduction({ plantId }));
    };

    // Handle buying roots
    const handleBuyRoots = (plantId: string) => {
        // Define the cost of roots
        const cost = 10; // Replace with your cost
        dispatch(buyRoots({ plantId, cost }));
    };

    // Handle buying leaves
    const handleBuyLeaves = (plantId: string) => {
        // Define the cost of leaves
        const cost = 5; // Replace with your cost
        dispatch(buyLeaves({ plantId, cost }));
    };


    return (
        <div>
            {Array.isArray(filteredPlants) ? (
                filteredPlants.map((plant) => (
                    <div key={plant.id} className="plant-container">
                        <table className="plant-info-table">
                            <tbody>
                                <tr>
                                    <td><button onClick={() => handleSunlightAbsorption(plant.id)}>Absorb Sunlight</button></td>
                                    <td>{plant.sunlight}</td>
                                </tr>
                                <tr>
                                    <td><button onClick={() => handleWaterAbsorption(plant.id)}>Absorb Water</button></td>
                                    <td>{plant.water}</td>
                                </tr>
                                <tr>
                                    <td>Produce Sugar?:</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={plant.is_sugar_production_on}
                                            onChange={() => handleToggleSugarProduction(plant.id)}
                                        />
                                    </td>                                    
                                    <td>{plant.sugar}</td>
                                </tr>
                                <tr>
                                    <td><button onClick={() => handleBuyRoots(plant.id)}>Buy Roots</button></td>
                                    <td>{plant.roots}</td>
                                </tr>
                                <tr>
                                    <td><button onClick={() => handleBuyLeaves(plant.id)}>Buy Leaves</button></td>
                                    <td>{plant.leaves}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="plant-buttons">
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
