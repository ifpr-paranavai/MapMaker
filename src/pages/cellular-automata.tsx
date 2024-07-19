import React, { useEffect, useState } from 'react';

import { runAutomataUntilChangesStop, runAutomataXTimes } from '../services/cellular-automata';

export default function Index() {
  const [grid, setGrid] = useState<number[][]>([[]]);

  useEffect(() => {
    makeRandomGrid();
  }, []);

  const makeRandomGrid = () => {
    const newGrid: number[][] = [];
    for (let y = 0; y < 160; y++) {
      newGrid.push([]);
      for (let x = 0; x < 160; x++) {
        newGrid[y].push(Math.random() > 0.55 ? 1 : 0);
      }
    }
    setGrid(newGrid);
  };

  const runXTimes = () => {
    setGrid((grid) => runAutomataXTimes(grid, 10));
    // setTimeout(transform, 500);
  };

  const runUntilStop = () => {
    setGrid((grid) => runAutomataUntilChangesStop(grid));
    // setTimeout(transform, 500);
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
      {grid.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: '5px',
                height: '5px',
                backgroundColor: cell === 1 ? 'black' : 'white'
              }}></div>
          ))}
        </div>
      ))}
    </>
  );
}
