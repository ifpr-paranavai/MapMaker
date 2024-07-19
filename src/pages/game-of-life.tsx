import React, { useEffect, useState } from 'react';
import { getLifeGrid } from '../services/game-of-life';

export default function Index() {
  const [grid, setGrid] = useState<number[][]>([[]]);

  useEffect(() => {
    const newGrid: number[][] = [];
    for (let y = 0; y < 50; y++) {
      newGrid.push([]);
      for (let x = 0; x < 50; x++) {
        newGrid[y].push(Math.random() > 0.6 ? 1 : 0);
      }
    }
    setGrid(newGrid);
  }, []);

  const transform = () => {
    setGrid((prevGrid) => getLifeGrid(prevGrid));
    setTimeout(transform, 500);
  };

  return (
    <>
      {grid.map((row, y) => (
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
      <button
        onClick={() => {
          transform();
        }}>
        start game of life
      </button>
    </>
  );
}
