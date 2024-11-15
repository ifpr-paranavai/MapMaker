import Cell from './Cell';
import FloorType from './enums/FloorType';
import WallType from './enums/WallType';
import CompleteMap from './CompleteMap';
import Room from './Room';


type MapsData = {
  numOfRooms: number;
  wallsTotal: number;
  floorsTotal: number;
  averageRoomSize: number;
  numOfTinyRooms: number;
  data: CompleteMap[];
};


export default MapsData;
