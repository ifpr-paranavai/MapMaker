// parametros possiveis
const gridHeight = 50;
const gridWidth = 50;
const pctOfInitialGridFilled = 0.5;
const floorTransformRequirement = 4;
const wallTransformRequirement = 3;

//generate empty grid

//fill grid with randomly with 1 and 0

//command called outisde of service
export const runAutomataXTimes = (grid: number[][]) => {
  const newGrid = makeNewGrid(grid);
  console.log(newGrid);
  return newGrid;
};

// run the check for every cell and update it in a new grid
const makeNewGrid = (grid: number[][]) => {
  const newGrid: number[][] = [];
  for (let y = 0; y < grid.length; y++) {
    newGrid.push([]);
    for (let x = 0; x < grid[0].length; x++) {
      const count = countNeighbors(grid, x, y);
      // If a cell is a wall and less than 3 cells in the Moore neighborhood are walls, the cell changes state to a floor.
      // If a cell is a floor and greater than 4 cells in the Moore neighborhood are walls, the cell changes state to a wall.
      if (grid[y][x] === 1) {
        if (count < 3) {
          newGrid[y].push(0);
        } else {
          newGrid[y].push(1);
        }
      } else {
        if (count > 4) {
          newGrid[y].push(1);
        } else {
          newGrid[y].push(0);
        }
      }
    }
  }

  // set the grid to equal new grid
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
    [1, 1],
  ];
  // se x === 0 nao checa a esquerda
  // se y === 0 nao checa em cima
  // se x === gridWidth-1 não checa a direita
  // se y === gridHeight-1 nao checa em baixo
  if (y === 0 || y === grid.length - 1) {
    count += 3;
  }
  if (x === 0 || x === grid[0].length - 1) {
    count += 3;
  }
  for (const [dx, dy] of directions) {
    const ny = y + dy;
    const nx = x + dx;
    if (
      ny >= 0 &&
      ny < grid.length &&
      nx >= 0 &&
      nx < grid[0].length &&
      grid[ny][nx] === 1
    ) {
      count++;
    }
  }
  return count;
}

//repeat until it does not change
