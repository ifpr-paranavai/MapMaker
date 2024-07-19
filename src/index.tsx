import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameOfLife from './pages/game-of-life';
import CellularAutomata from './pages/cellular-automata';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<CellularAutomata />} />
        <Route path="/GOL" element={<GameOfLife />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
