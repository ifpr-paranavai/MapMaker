export const getLifeGrid = (grid: number[][]) => {
  const newGrid = makeNewGrid(grid);
  console.log(newGrid);
  return newGrid;
};
const makeNewGrid = (grid: number[][]) => {
  const newGrid: number[][] = [];
  for (let y = 0; y < grid.length; y++) {
    newGrid.push([]);
    for (let x = 0; x < grid[0].length; x++) {
      const count = countNeighbors(grid, x, y);
      // Any live cell with fewer than two live neighbors dies, as if caused by under-population.
      // Any live cell with two or three live neighbors lives on to the next generation.
      // Any live cell with more than three live neighbors dies, as if by overcrowding.
      // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
      if (grid[y][x] === 1) {
        if (count < 2 || count > 3) {
          newGrid[y].push(0);
        } else {
          newGrid[y].push(1);
        }
      } else {
        if (count === 3) {
          newGrid[y].push(1);
        } else {
          newGrid[y].push(0);
        }
      }
    }
  }
  return newGrid;
};

function countNeighbors(grid: number[][], x: number, y: number) {
  let count = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ];
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length && grid[ny][nx] === 1) {
      count++;
    }
  }
  return count;
}
