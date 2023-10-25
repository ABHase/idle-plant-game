import { getAdjacentCells } from "./cellUtils";
import { RootState } from "./rootReducer";

export function calculateAdjacencyUpgrades(
  state: RootState,
  currentCell: number,
  currentPlantType: string
): string[] {
  const adjacentCells = getAdjacentCells(currentCell);
  const adjacencyUpgrades: string[] = [];

  // Filter out currentCell from adjacentCells
  const filteredAdjacentCells = adjacentCells.filter(
    (cell) => cell !== currentCell
  );

  // Handle currentCell separately
  if (currentPlantType === "Fern") {
    adjacencyUpgrades.push("Adjacent_to_Fern");
    console.log("Adjacent to Fern from current cell");
  } else if (currentPlantType === "Succulent") {
    adjacencyUpgrades.push("Adjacent_to_Succulent");
    console.log("Adjacent to Succulent from current cell");
  } else if (currentPlantType === "Grass") {
    adjacencyUpgrades.push("Adjacent_to_Grass");
    console.log("Adjacent to Grass from current cell");
  } else if (currentPlantType === "Moss") {
    adjacencyUpgrades.push("Adjacent_to_Moss");
    console.log("Adjacent to Moss from current cell");
  } else if (currentPlantType === "Bush") {
    adjacencyUpgrades.push("Adjacent_to_Bush");
    console.log("Adjacent to Bush from current cell");
  }

  filteredAdjacentCells.forEach((cellIndex) => {
    const plantType = state.cellCompletion.cells[cellIndex];

    if (plantType === "Fern") {
      adjacencyUpgrades.push("Adjacent_to_Fern");
      console.log("Adjacent to Fern");
    } else if (plantType === "Succulent") {
      adjacencyUpgrades.push("Adjacent_to_Succulent");
      console.log("Adjacent to Succulent");
    } else if (plantType === "Grass") {
      adjacencyUpgrades.push("Adjacent_to_Grass");
      console.log("Adjacent to Grass");
    } else if (plantType === "Moss") {
      adjacencyUpgrades.push("Adjacent_to_Moss");
      console.log("Adjacent to Moss");
    } else if (plantType === "Bush") {
      adjacencyUpgrades.push("Adjacent_to_Bush");
      console.log("Adjacent to Bush");
    }
    // ...add other checks for other plant types and their adjacency bonuses
  });

  console.log(adjacencyUpgrades);

  return adjacencyUpgrades;
}
