import Cell from '../models/Cell';

// moore === 8 celulas ao redor
export const countMooreNeighbors = (grid: number[][], x: number, y: number) => {
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
    if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length && grid[ny][nx] === 1) {
      count++;
    }
  }
  return count;
};

// von neumann === 4 celulas ao redor
export const findVonNeumannFloorNeighbors = (cell: Cell, grid: number[][]) => {
  const floorNeighbors: Cell[] = [];
  // checando celula a esquerda
  if (cell.y !== 0 && grid[cell.y - 1][cell.x] === 0) {
    floorNeighbors.push({
      x: cell.x,
      y: cell.y - 1
    });
  }
  // checando celula a direita
  if (cell.y !== grid.length - 1 && grid[cell.y + 1][cell.x] === 0) {
    floorNeighbors.push({
      x: cell.x,
      y: cell.y + 1
    });
  }
  // checando celula em cima
  if (cell.x !== 0 && grid[cell.y][cell.x - 1] === 0) {
    floorNeighbors.push({
      x: cell.x - 1,
      y: cell.y
    });
  }
  // checando celula em baixo
  if (cell.x !== grid[0].length - 1 && grid[cell.y][cell.x + 1] === 0) {
    floorNeighbors.push({
      x: cell.x + 1,
      y: cell.y
    });
  }
  return floorNeighbors;
};
