import React, { useEffect, useState } from "react";

import { runAutomataXTimes } from "../services/cellular-automata";

export default function Index() {
  const [grid, setGrid] = useState<number[][]>([[]]);

  useEffect(() => {
    const newGrid: number[][] = [];
    for (let y = 0; y < 160; y++) {
      newGrid.push([]);
      for (let x = 0; x < 160; x++) {
        newGrid[y].push(Math.random() > 0.55 ? 1 : 0);
      }
    }
    setGrid(newGrid);
  }, []);

  const transform = () => {
    let newGrid = grid;
    for (let i = 0; i < 10; i++) {
      newGrid = runAutomataXTimes(newGrid);
    }
    setGrid(newGrid);
    // setTimeout(transform, 500);
  };

  return (
    <>
      <button
        onClick={() => {
          transform();
        }}
      >
        transformar grid
      </button>
      {grid.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: cell === 1 ? "black" : "white",
              }}
            ></div>
          ))}
        </div>
      ))}
    </>
  );
}
