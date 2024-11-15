import Cell from '../models/Cell';
import WallType from '../models/enums/WallType';
import Room from '../models/Room';
import { countMooreNeighbors, findVonNeumannFloorNeighbors } from '../utils/cellUtils';

// parametros possiveis
const gridHeight = 50;
const gridWidth = 50;
const pctOfInitialGridFilled = 0.5;
const floorTransformRequirement = 4;
const wallTransformRequirement = 3;

//generate empty grid

//fill grid with randomly with 1 and 0

//commands called outisde of service
export const runAutomataUntilChangesStop = (grid: number[][], wallToFloor = 2, floorToWall = 5, infiniteLoopCallback = ()=>{}) => {
  let stopCounter = 1000; //counter to stop infinite loops if gens > 1000
  const startingGrid = grid;

  let finalGrid = grid;
  let loop = true;
  while (loop) {
    const newGrid = makeNewGrid(finalGrid, wallToFloor, floorToWall);
    if (compare(finalGrid, newGrid)) {
      loop = false;
    }
    stopCounter--;
    if(stopCounter === 0) {
      console.log('Infinite loop, startingGrid:', startingGrid);
      infiniteLoopCallback();
      loop = false;
    }
    finalGrid = newGrid;
  }
  return finalGrid;
};

export const runAutomataXTimes = (grid: number[][], numOfLoops = 5, wallToFloor = 2, floorToWall = 5) => {
  let newGrid = grid;
  for (let i = 0; i <= numOfLoops; i++) {
    newGrid = makeNewGrid(newGrid, wallToFloor, floorToWall);
    // console.log(newGrid);
  }
  return newGrid;
};

// run the check for every cell and update it in a new grid
const makeNewGrid = (grid: number[][], wallToFloor: number, floorToWall: number) => {
  const newGrid: number[][] = [];
  for (let y = 0; y < grid.length; y++) {
    newGrid.push([]);
    for (let x = 0; x < grid[0].length; x++) {
      const count = countMooreNeighbors(grid, x, y);
      // If a cell is a wall and less than 3 cells in the Moore neighborhood are walls, the cell changes state to a floor.
      // If a cell is a floor and greater than 4 cells in the Moore neighborhood are walls, the cell changes state to a wall.
      if (grid[y][x] === 1) {
        if (count <= wallToFloor) {
          newGrid[y].push(0);
        } else {
          newGrid[y].push(1);
        }
      } else {
        if (count >= floorToWall) {
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
            img: getRandomFloor(),
            cells: [],
            cornerCells: []
          };
          // console.log('criando nova sala', cell);
          //cria um array de celulas a adicionar
          const cellsToAdd: Cell[] = [cell];
          //percorre o array de celulas a serem adicionadas
          while (cellsToAdd.length !== 0) {
            const cellAdd = cellsToAdd[0];
            // console.log('celula sendo adicionada', cellAdd);
            //acha os seus vizinhos
            const floorNeighbors = findVonNeumannFloorNeighbors(cellAdd, grid);
            printCellArray('vizinhos', floorNeighbors);
            const cellTestLog: Cell[] = [];
            for (const neighbor of floorNeighbors) {
              //se o vizinho nao foi adicionado e nao esta na fila adiciona na fila a ser adicionada
              const isNeighborToAdd = cellsToAdd.find((c) => {
                return c.x === neighbor.x && c.y === neighbor.y;
              });
              const isNeighborAdded = isCellInRoom(room, neighbor);

              if (!isNeighborToAdd && !isNeighborAdded) {
                cellsToAdd.push(neighbor);
                cellTestLog.push(neighbor);
              }
            }
            printCellArray('novas celulas', cellTestLog);
            //adiciona na sala, se um dos vizinhos é chao ele é um canto
            if (floorNeighbors.length !== 4) {
              room.cornerCells.push(cellAdd);
            } else {
              room.cells.push(cellAdd);
            }
            //remove de cellsToAdd
            cellsToAdd.shift();
            printCellArray('cellsToAdd', cellsToAdd);
            printCellArray('addedCells', [...room.cells, ...room.cornerCells]);
          }
          rooms.push(room);
        }
      }
    }
  }
  return rooms;
};

const printCellArray = (text: string, cells: Cell[]) => {
  // console.log(
  //   text,
  //   cells.map((c) => {
  //     return `x: ${c.x}, y: ${c.y}`;
  //   })
  // );
};

const findCellRoom = (rooms: Room[], cell: Cell) => {
  return rooms.find((room) => {
    return isCellInRoom(room, cell);
  });
};

const isCellInRoom = (room: Room, cell: Cell) => {
  return (
    room.cells.find((c) => {
      return c.x === cell.x && c.y === cell.y;
    }) ||
    room.cornerCells.find((c) => {
      return c.x === cell.x && c.y === cell.y;
    })
  );
};

const getRandomFloor = (): WallType => {
  const wallTypes = Object.values(WallType).filter(
    (value) => typeof value === 'number'
  ) as number[];
  const randomIndex = Math.floor(Math.random() * wallTypes.length);
  // console.log('Random floor asset selected:', randomIndex, WallType[randomIndex]);
  return randomIndex;
};
//TODO
const guaranteePathBetweenRooms = () => {};
