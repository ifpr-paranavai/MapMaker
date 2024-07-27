import FloorType from './enums/FloorType';
import WallType from './enums/WallType';

type CellDisplay = {
  img: WallType | FloorType;
  isWall: boolean;
};
export type { CellDisplay as default };
