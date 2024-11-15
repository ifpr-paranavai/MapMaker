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
import { makeMapsData } from '../services/tests';
import CompleteMap from '../models/CompleteMap';

export default function Index() {

  const [grid, setGrid] = useState<CellDisplay[][]>([]);
  const [numGrid, setNumGrid] = useState<number[][]>([]);

  const [gridWidth, setGridWidth] = useState(50);
  const [gridHeight, setGridHeight] = useState(50);
  const [pctWall, setPctWall] = useState(45);
  const [numOfLoops, setNumOfLoops] = useState(3);
  const [wallToFloor, setWallToFloor] = useState(2);
  const [floorToWall, setFloorToWall] = useState(5); 

  const makeRandomGrid = (pctInt: number) => {
    const newGrid: number[][] = [];
    console.log('making wall with ', pctInt/100);
    for (let y = 0; y < gridHeight; y++) {
      newGrid.push([]);
      for (let x = 0; x < gridWidth; x++) {
        newGrid[y].push(Math.random() < pctInt/100 ? 1 : 0);
      }
    }
    // console.log('numGrid', numGrid);
    return newGrid;
  };

  const runXTimes = (grid: number[][]) => {
    return runAutomataXTimes(grid, numOfLoops, wallToFloor, floorToWall);
    // setTimeout(transform, 500);
  };

  const runUntilStop = (grid: number[][], infiniteLoopCallback = ()=>{}) => {
    return runAutomataUntilChangesStop(grid, wallToFloor, floorToWall, infiniteLoopCallback);
    // setTimeout(transform, 500);
  };


  const separateIntoRooms = (grid: number[][]) => {
    return groupCellsIntoRooms(grid);

  };

  const makeRoomColorGrid = (grid: number[][]) => {
    const rooms = groupCellsIntoRooms(grid);
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
    return gridWithRoomColors;
  };

  const hadleMakeMapData = () => {
    let maps: CompleteMap[] = [];
    let numOfInfiniteLoops = 0;
    // for (let z = 0; z <= 50; z++) {
    maps = [];
    // console.log(z);
    for (let x = 0; x < 1000; x++) {
      let grid = makeRandomGrid(45);
      // grid = runXTimes(grid, z);
      grid = runUntilStop(grid, () => {numOfInfiniteLoops++; console.log(numOfInfiniteLoops);});
      setNumGrid(grid);
      const rooms = separateIntoRooms(grid);
      maps.push({numberGrid: grid, rooms: rooms});
    }
    const mapsData = makeMapsData(maps);

    const jsonString = JSON.stringify(mapsData);

    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapsRuleFloors4.json';
    // a.download = `mapsDataGens${z}.json`;
    
    document.body.appendChild(a);
    a.click();
    
    a.remove();
    URL.revokeObjectURL(url);
    // }

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
      <div>
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
      </div>
    );
  };

  const fetchJsonData = async () => {
    const data = [];
    for (let i = 1; i <= 4; i++) {
      console.log(i);
      try {
        const response = await fetch(`/dados/mapsDataFloors${i}.json`);
        // const response = await fetch(`../dados/mapsData${i}.json`);
        if (!response.ok) {
          throw new Error(`Error fetching mapsData${i}.json`);
        }
        const json = await response.json();
        data.push(json);
        delete json.data;
      } catch (error) {
        console.error(error);
      }
    }
    return data;
  };

  const jsonToCsv = (jsonData: any) => {
    const headers = [
      'floorsTotal',
      'wallsTotal',
      'numOfRooms',
      'averageRoomSize',
      'numOfTinyRooms',
    ];
    
    const csvRows = [
      headers.join(','), // header row
      ...jsonData.map((item: any) => headers.map(header => item[header]).join(',')), // data rows
    ];

    return csvRows.join('\n');
  };

  const downloadCsv = (csvContent: any) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mapsData.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConvert = async () => {
    const jsonData = await fetchJsonData();
    console.log(jsonData);
    const csvContent = jsonToCsv(jsonData);
    console.log(csvContent);
    // downloadCsv(csvContent);
  };

  const renderInputs = () => {
    return (
      <div style={{display: 'flex', gap: '5px'}}>
        <div>
          <label>
           Numero de linhas da grid:
            <input
              type="number"
              value={gridHeight}
              onChange={(e) => setGridHeight(parseInt(e.target.value))}
              min="0"
              max="100"
              required
            />
          </label>
        </div>
        <div>
          <label>
           Numero de colunas da grid:
            <input
              type="number"
              value={gridWidth}
              onChange={(e) => setGridWidth(parseInt(e.target.value))}
              min="0"
              max="100"
              required
            />
          </label>
        </div>
        <div>
          <label>
            chance de celula ser chão na  grid inicial(%):
            <input
              type="number"
              value={pctWall}
              onChange={(e) => setPctWall(parseInt(e.target.value))}
              min="0"
              max="100"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Numero de gerações:
            <input
              type="number"
              value={numOfLoops}
              onChange={(e) => setNumOfLoops(parseInt(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
          wallToFloor (0-8):
            <input
              type="number"
              value={wallToFloor}
              onChange={(e) => setWallToFloor(Math.min(8, Math.max(0, parseInt(e.target.value))))}
              min="0"
              max="8"
              required
            />
          </label>
        </div>
        <div>
          <label>
          floorToWall (0-8):
            <input
              type="number"
              value={floorToWall}
              onChange={(e) => setFloorToWall(Math.min(8, Math.max(0, parseInt(e.target.value))))}
              min="0"
              max="8"
              required
            />
          </label>
        </div> 
      </div>
    );
  };

  const renderButtons = () => {
    return (
      <div style={{display: 'flex', gap: '5px'}}>
        <button
          onClick={() => {
            setNumGrid(makeRandomGrid(pctWall));
          }}>
        Gerar nova grid aleatória
        </button>
        <button
          onClick={() => {
            setNumGrid((g) => runXTimes(g));
          }}>
        Correr algoritimo celular {numOfLoops} vezes
        </button>
        <button
          onClick={() => {
            setNumGrid((g) => runUntilStop(g));
          }}>
        correr algoritimo celular até não existirem mais mudancas
        </button>
        <button
          onClick={() => {
            setGrid(makeRoomColorGrid(numGrid));
          }}>
        Separar em salas
        </button>
        <button
          onClick={() => {
            hadleMakeMapData();
          }}>
          make json
        </button>
        <button
          onClick={() => {
            handleConvert();
          }}>
          csv
        </button>
      </div>
    );
  };

  const renderNumGrid = () => {
    return (
      <div>
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
      </div>
    );
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
      {renderInputs()}
      {renderButtons()}
      {grid.length === 0 ? renderNumGrid() : renderGrid()}
    </div>
  );
}
