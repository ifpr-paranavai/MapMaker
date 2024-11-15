import CompleteMap from '../models/CompleteMap';
import MapsData from '../models/MapsData';

export const makeMapsData = (maps: CompleteMap[]) => {
  const mapsData:MapsData = {
    floorsTotal: 0,
    wallsTotal: 0, 
    numOfRooms: 0,
    averageRoomSize: 0,
    numOfTinyRooms: 0,
    data: maps
  };
  maps.forEach(map => {
    mapsData.numOfRooms += map.rooms.length;
    map.rooms.forEach(room => {
      if(room.cornerCells.length <=4){
        mapsData.numOfTinyRooms ++;
      }
    });
    map.numberGrid.forEach(row => {
      row.forEach(col => {
        mapsData.wallsTotal += col;
      });
    });
  });
  const totalCells = maps.length * maps[0].numberGrid.length * maps[0].numberGrid[0].length;
  mapsData.floorsTotal = totalCells - mapsData.wallsTotal;
  mapsData.averageRoomSize = mapsData.floorsTotal / mapsData.numOfRooms;
  console.log(mapsData);
  return mapsData;
};