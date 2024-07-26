import FloorType from './enums/FloorType';
import WallType from './enums/WallType';

type CellDisplay = {
  img: WallType | FloorType;
};
export type { CellDisplay as default };
