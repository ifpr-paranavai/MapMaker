import CellDisplay from '../models/CellDisplay';

export const makeFilledGrid = <T>(height: number, width: number, fillValue: T) => {
  const grid: T[][] = [];
  for (let y = 0; y < height; y++) {
    grid.push([]);
    for (let x = 0; x < width; x++) {
      grid[y].push(fillValue);
    }
  }
  return grid;
};

export const makeFilledGridBlack = (height: number, width: number) => {
  const grid: CellDisplay[][] = [];
  for (let y = 0; y < height; y++) {
    grid.push([]);
    for (let x = 0; x < width; x++) {
      const col = { color: 'black' };
      grid[y].push(col);
    }
  }
  return grid;
};

export const numberToCellDisplayGrid = (grid: number[][]) => {
  const newGrid: CellDisplay[][] = [];
  for (let y = 0; y < grid.length; y++) {
    newGrid.push([]);
    for (let x = 0; x < grid[0].length; x++) {
      newGrid[y].push({
        color: grid[y][x] === 1 ? 'black' : 'white'
      });
    }
  }
  return newGrid;
};

export const CellDisplayToNumberGrid = (grid: CellDisplay[][]) => {
  const newGrid: number[][] = [];
  for (let y = 0; y < grid.length; y++) {
    newGrid.push([]);
    for (let x = 0; x < grid[0].length; x++) {
      newGrid[y].push(grid[y][x].color === 'black' ? 1 : 0);
    }
  }
  return newGrid;
};
