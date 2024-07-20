import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameOfLife from './pages/game-of-life';
import CellularAutomata from './pages/cellular-automata';
import CellularAutomataRooms from './pages/cellular-automata-rooms';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<CellularAutomata />} />
        <Route path="/rooms" element={<CellularAutomataRooms />} />
        <Route path="/gol" element={<GameOfLife />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
