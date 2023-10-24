// cellUtils.ts

// Constants for the dimensions of the grid
const ROWS = 4;
const COLUMNS = 6;

// Convert a single number representation of a cell into its x, y coordinates
export function getCoordinatesFromCellNumber(n: number): {
  x: number;
  y: number;
} {
  return {
    x: Math.floor(n / COLUMNS),
    y: n % COLUMNS,
  };
}

// Convert x, y coordinates back into a single number representation
export function getCellNumberFromCoordinates(x: number, y: number): number {
  return x * COLUMNS + y;
}

// Return adjacent cell numbers given a single number representation
export function getAdjacentCells(n: number): number[] {
  const { x, y } = getCoordinatesFromCellNumber(n);
  const adjacent = [
    x * COLUMNS + (y - 1), // left
    x * COLUMNS + (y + 1), // right
    (x - 1) * COLUMNS + y, // top
    (x + 1) * COLUMNS + y, // bottom
  ];
  return adjacent.filter((cell) => cell >= 0 && cell < ROWS * COLUMNS); // filtering out invalid cell numbers
}
