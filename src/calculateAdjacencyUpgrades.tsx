import {
  COLUMNS,
  ROWS,
  getAdjacentCells,
  getCellsInColumn,
  getCellsInRow,
} from "./cellUtils";
import { RootState } from "./rootReducer";

export function findCompletedRowsAndColumns(
  state: RootState,
  currentCell: number,
  currentPlantType: string
): string[] {
  const completedRowsAndColumns: string[] = [];

  // Shallow copy the cells object inside cellCompletion
  const tempState = {
    ...state,
    cellCompletion: {
      ...state.cellCompletion,
      cells: { ...state.cellCompletion.cells },
    },
  };
  tempState.cellCompletion.cells[currentCell] = currentPlantType;

  // Check each column
  for (let col = 0; col < COLUMNS; col++) {
    const columnCells = getCellsInColumn(col);
    const firstPlantType = tempState.cellCompletion.cells[columnCells[0]];

    if (
      firstPlantType &&
      columnCells.every(
        (cell) => tempState.cellCompletion.cells[cell] === firstPlantType
      )
    ) {
      completedRowsAndColumns.push(`Column_${firstPlantType}`);
    }
  }

  // Check each row
  for (let row = 0; row < ROWS; row++) {
    const rowCells = getCellsInRow(row);
    const firstPlantType = tempState.cellCompletion.cells[rowCells[0]];

    if (
      firstPlantType &&
      rowCells.every(
        (cell) => tempState.cellCompletion.cells[cell] === firstPlantType
      )
    ) {
      completedRowsAndColumns.push(`Row_${firstPlantType}`);
    }
  }

  return completedRowsAndColumns;
}

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
  } else if (currentPlantType === "Succulent") {
    adjacencyUpgrades.push("Adjacent_to_Succulent");
  } else if (currentPlantType === "Grass") {
    adjacencyUpgrades.push("Adjacent_to_Grass");
  } else if (currentPlantType === "Moss") {
    adjacencyUpgrades.push("Adjacent_to_Moss");
  } else if (currentPlantType === "Bush") {
    adjacencyUpgrades.push("Adjacent_to_Bush");
  }

  filteredAdjacentCells.forEach((cellIndex) => {
    const plantType = state.cellCompletion.cells[cellIndex];

    if (plantType === "Fern") {
      adjacencyUpgrades.push("Adjacent_to_Fern");
    } else if (plantType === "Succulent") {
      adjacencyUpgrades.push("Adjacent_to_Succulent");
    } else if (plantType === "Grass") {
      adjacencyUpgrades.push("Adjacent_to_Grass");
    } else if (plantType === "Moss") {
      adjacencyUpgrades.push("Adjacent_to_Moss");
    } else if (plantType === "Bush") {
      adjacencyUpgrades.push("Adjacent_to_Bush");
    }
    // ...add other checks for other plant types and their adjacency bonuses
  });

  // Find completed rows and columns
  const completedRowsAndColumns = findCompletedRowsAndColumns(
    state,
    currentCell,
    currentPlantType
  );

  // Translate them into upgrades
  const completionUpgrades = completedRowsAndColumns
    .map((completion) => {
      if (completion.startsWith("Column")) {
        return `Column_${completion.split("_")[1]}`;
      } else if (completion.startsWith("Row")) {
        return `Row_${completion.split("_")[1]}`;
      }
      return "";
    })
    .filter(Boolean); // Remove any empty strings

  const uniqueCompletionUpgrades = Array.from(new Set(completionUpgrades));

  // Combine adjacency upgrades and unique row/column completion upgrades
  return [...adjacencyUpgrades, ...uniqueCompletionUpgrades];
}
