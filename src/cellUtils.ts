// cellUtils.ts

// Constants for the dimensions of the grid
export const ROWS = 4;
export const COLUMNS = 6;

// Convert a single number representation back into x, y coordinates
export function getCoordinatesFromCellNumber(n: number): {
  x: number;
  y: number;
} {
  const x = Math.floor(n / COLUMNS);
  const y = n % COLUMNS;
  return { x, y };
}

// Ensure the coordinates wrap around if they go out of bounds
const wrap = (value: number, max: number): number =>
  ((value % max) + max) % max;

// Convert wrapped x, y coordinates back into a single number representation
export function getCellNumberFromCoordinates(x: number, y: number): number {
  const wrappedX = wrap(x, ROWS);
  const wrappedY = wrap(y, COLUMNS);
  return wrappedX * COLUMNS + wrappedY;
}

export function getAdjacentCells(n: number): number[] {
  // Get x, y coordinates from cell number
  const { x, y } = getCoordinatesFromCellNumber(n);

  // Calculate adjacent cells with wrapping
  const left = getCellNumberFromCoordinates(x, wrap(y - 1, COLUMNS));
  const right = getCellNumberFromCoordinates(x, wrap(y + 1, COLUMNS));
  const top = getCellNumberFromCoordinates(wrap(x - 1, ROWS), y);
  const bottom = getCellNumberFromCoordinates(wrap(x + 1, ROWS), y);

  return [left, right, top, bottom];
}

// Get all cell numbers in a particular column
export function getCellsInColumn(column: number): number[] {
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    cells.push(getCellNumberFromCoordinates(row, column));
  }
  return cells;
}

// Get all cell numbers in a particular row
export function getCellsInRow(row: number): number[] {
  const cells = [];
  for (let col = 0; col < COLUMNS; col++) {
    cells.push(getCellNumberFromCoordinates(row, col));
  }
  return cells;
}
