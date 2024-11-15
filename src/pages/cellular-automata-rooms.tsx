import React, { useEffect, useState } from 'react';
import dirt from '../assets/dirt.png';
import grass from '../assets/Grass.png';
import lava from '../assets/lava.png';
import Mountain from '../assets/Mountain.png';
import Path from '../assets/Path.png';
import rock from '../assets/rock.png';
import Sand from '../assets/Sand.png';
import snow from '../assets/snow.png';

import {
  groupCellsIntoRooms,
  runAutomataUntilChangesStop,
  runAutomataXTimes
} from '../services/cellular-automata';
import { makeFilledGrid, makeFilledGridPath, numberToCellDisplayGrid } from '../utils/gridUtils';
import CellDisplay from '../models/CellDisplay';
import WallType from '../models/enums/WallType';
import FloorType from '../models/enums/FloorType';

export default function Index() {
  const gridWidth = 80;
  const gridHeight = 80;

  const [grid, setGrid] = useState<CellDisplay[][]>([]);
  const [numGrid, setNumGrid] = useState<number[][]>([]);

  const makeRandomGrid = () => {
    const newGrid: number[][] = [];
    for (let y = 0; y < gridHeight; y++) {
      newGrid.push([]);
      for (let x = 0; x < gridWidth; x++) {
        newGrid[y].push(Math.random() > 0.55 ? 1 : 0);
      }
    }
    // console.log('numGrid', numGrid);
    setNumGrid(newGrid);
  };

  const runXTimes = () => {
    setNumGrid((g) => runAutomataXTimes(g, 10));
    // setTimeout(transform, 500);
  };

  const runUntilStop = () => {
    setNumGrid((g) => runAutomataUntilChangesStop(g));
    // setTimeout(transform, 500);
  };

  const separateIntoRooms = () => {
    const rooms = groupCellsIntoRooms(numGrid);
    // console.log('rooms', rooms);

    const gridWithRoomColors = makeFilledGridPath(gridHeight, gridWidth);
    rooms.forEach((room) => {
      room.cells.forEach((cell) => {
        gridWithRoomColors[cell.y][cell.x].img = room.img;
      });
      room.cornerCells.forEach((cell) => {
        gridWithRoomColors[cell.y][cell.x].img = room.img;
        gridWithRoomColors[cell.y][cell.x].isWall = true;
      });
    });
    // console.log('finalGrid', gridWithRoomColors);
    setGrid(gridWithRoomColors);
  };
  const getImageByEnum = (image: FloorType | WallType) => {
    switch (image) {
      case WallType.GRASS:
        return grass;
      case WallType.LAVA:
        return lava;
      case WallType.MOUNTAIN:
        return Mountain;
      case WallType.ROCK:
        return rock;
      case WallType.SAND:
        return Sand;
      // case WallType.SNOW:
      //   return snow;
      case FloorType.DIRT:
        return dirt;
      default:
        return dirt;
    }
  };

  const renderGrid = () => {
    return (
      <>
        {' '}
        {grid.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((cell, x) => (
              <img
                key={x}
                style={{
                  width: '10px',
                  height: '10px',
                  opacity: cell.isWall ? 1.0 : 0.7
                }}
                src={getImageByEnum(cell.img)}
              />
            ))}
          </div>
        ))}
      </>
    );
  };

  const renderNumGrid = () => {
    return (
      <>
        {' '}
        {numGrid.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((cell, x) => (
              <div
                key={x}
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: cell === 1 ? 'black' : 'white'
                }}></div>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <button
        onClick={() => {
          makeRandomGrid();
        }}>
        Gerar nova grid aleatória
      </button>
      <button
        onClick={() => {
          runXTimes();
        }}>
        Correr algoritimo celular 10 vezes
      </button>
      <button
        onClick={() => {
          runUntilStop();
        }}>
        correr algoritimo celular até não existirem mais mudancas
      </button>
      <button
        onClick={() => {
          separateIntoRooms();
        }}>
        Separar em salas
      </button>
      {grid.length === 0 ? renderNumGrid() : renderGrid()}
    </>
  );
}
