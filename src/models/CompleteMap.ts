import Cell from './Cell';
import FloorType from './enums/FloorType';
import WallType from './enums/WallType';
import Room from './Room';


type CompleteMap = {
  numberGrid: number[][];
  rooms: Room[];
}


export default CompleteMap;
