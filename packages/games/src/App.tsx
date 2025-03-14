import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Minesweeper from "./pages/MineSweeper";
import Gomoku from "./pages/Gomoku";
import Snake from "./pages/Snake";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/minesweeper" element={<Minesweeper />} />
        <Route path="/games/gomoku" element={<Gomoku />} />
        <Route path="/games/snake" element={<Snake />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
