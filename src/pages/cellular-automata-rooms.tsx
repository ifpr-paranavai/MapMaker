import React, { useEffect, useState } from 'react';

import {
  groupCellsIntoRooms,
  runAutomataUntilChangesStop,
  runAutomataXTimes
} from '../services/cellular-automata';
import { makeFilledGrid, makeFilledGridBlack, numberToCellDisplayGrid } from '../utils/gridUtils';
import CellDisplay from '../models/CellDisplay';

export default function Index() {
  const gridWidth = 50;
  const gridHeight = 50;

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
    console.log('numGrid', numGrid);
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
    console.log('rooms', rooms);

    const gridWithRoomColors = makeFilledGridBlack(gridHeight, gridWidth);
    rooms.forEach((room) => {
      room.cells.forEach((cell) => {
        gridWithRoomColors[cell.y][cell.x].color = room.color;
      });
    });
    console.log('finalGrid', gridWithRoomColors);
    setGrid(gridWithRoomColors);
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
      {grid.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: cell.color
              }}></div>
          ))}
        </div>
      ))}
    </>
  );
}
