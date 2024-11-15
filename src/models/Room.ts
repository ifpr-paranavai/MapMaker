import Cell from './Cell';
import FloorType from './enums/FloorType';
import WallType from './enums/WallType';

type Room = {
  img: WallType | FloorType;
  cells: Cell[];
  cornerCells: Cell[];
};

export default Room;
