// parametros possiveis
const gridHeight = 50;
const gridWidth = 50;
const pctOfInitialGridFilled = 0.5;
const floorTransformRequirement = 4;
const wallTransformRequirement = 3;

//generate empty grid

//fill grid with randomly with 1 and 0

//commands called outisde of service
export const runAutomataUntilChangesStop = (grid: number[][]) => {
  let finalGrid = grid;
  let loop = true;
  while (loop) {
    const newGrid = makeNewGrid(finalGrid);
    if (compare(finalGrid, newGrid)) {
      loop = false;
    }
    finalGrid = newGrid;
  }
  return finalGrid;
};

export const runAutomataXTimes = (grid: number[][], numOfLoops = 5) => {
  let newGrid = grid;
  for (let i = 0; i <= numOfLoops; i++) {
    newGrid = makeNewGrid(newGrid);
    console.log(newGrid);
  }
  return newGrid;
};

// run the check for every cell and update it in a new grid
const makeNewGrid = (grid: number[][]) => {
  const newGrid: number[][] = [];
  for (let y = 0; y < grid.length; y++) {
    newGrid.push([]);
    for (let x = 0; x < grid[0].length; x++) {
      const count = countMooreNeighbors(grid, x, y);
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

function countMooreNeighbors(grid: number[][], x: number, y: number) {
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
}

// compare if two grids are equal assuming both grid widths and heights are the same
const compare = (gridA: number[][], gridB: number[][]) => {
  for (let y = 0; y < gridA.length; y++) {
    for (let x = 0; x < gridA[0].length; x++) {
      if (gridA[y][x] !== gridB[y][x]) {
        return false;
      }
    }
  }
  return true;
};

type Cell = {
  x: number;
  y: number;
};

type Room = {
  color: string;
  cells: Cell[];
};

export const groupCellsIntoRooms = (grid: number[][]) => {
  //cria um array para guardar grupos de chãos representando salas
  const rooms: Room[] = [];
  //percorre por toda a grid
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      //se a celula é chao e não pertence a uma sala
      if (grid[y][x] === 0) {
        const cell = { x: x, y: y };
        const cellRoom = findCellRoom(rooms, cell);
        if (!cellRoom) {
          //cria uma sala nova
          const room: Room = {
            color: makeRandomColor(),
            cells: []
          };
          console.log('criando nova sala', cell);
          //cria um array de celulas a adicionar
          const cellsToAdd: Cell[] = [cell];
          const addedCells: Cell[] = [];
          //percorre o array de celulas a serem adicionadas
          while (cellsToAdd.length !== 0) {
            const cellAdd = cellsToAdd[0];
            console.log('celula sendo adicionada', cellAdd);
            //acha os seus vizinhos
            const floorNeighbors = findVonNeumannFloorNeighbors(cellAdd, grid);
            printCellArray('vizinhos', floorNeighbors);
            const cellTestLog: Cell[] = [];
            for (const neighbor of floorNeighbors) {
              //se o vizinho nao foi adicionado e nao esta na fila adiciona na fila a ser adicionada
              const isNeighborToAdd = cellsToAdd.find((c) => {
                return c.x === neighbor.x && c.y === neighbor.y;
              });
              const isNeighborAdded = addedCells.find((c) => {
                return c.x === neighbor.x && c.y === neighbor.y;
              });
              if (!isNeighborToAdd && !isNeighborAdded) {
                cellsToAdd.push(neighbor);
                cellTestLog.push(neighbor);
              }
            }
            printCellArray('novas celulas', cellTestLog);
            //adiciona na sala e remove de cellsToAdd
            addedCells.push(cellAdd);
            cellsToAdd.shift();
            printCellArray('cellsToAdd', cellsToAdd);
            printCellArray('addedCells', addedCells);
          }
          room.cells = addedCells;
          rooms.push(room);
        }
      }
    }
  }
  return rooms;
};

const printCellArray = (text: string, cells: Cell[]) => {
  console.log(
    text,
    cells.map((c) => {
      return `x: ${c.x}, y: ${c.y}`;
    })
  );
};

const findCellRoom = (rooms: Room[], cell: Cell) => {
  return rooms.find((room) => {
    return room.cells.find((c) => {
      return cell.y === c.y && cell.x === c.x;
    });
  });
};

const findVonNeumannFloorNeighbors = (cell: Cell, grid: number[][]) => {
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

const makeRandomColor = () => {
  // return '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substring(1, 6);
  // Math.pow is slow, use constant instead.
  const color = Math.floor(Math.random() * 16777216).toString(16);
  // Avoid loops.
  return '#000000'.slice(0, -color.length) + color;
};
