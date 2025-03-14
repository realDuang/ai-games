import React from "react";
import { Board as BoardType, Player } from "../types/game";

interface BoardProps {
  board: BoardType;
  onCellClick: (row: number, col: number) => void;
  currentPlayer: Player;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, disabled }) => {
  return (
    <div className="inline-block bg-amber-100 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-15 gap-0">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              className={`
                w-8 h-8 border border-amber-700 relative
                ${!cell && !disabled ? "hover:bg-amber-200" : ""}
                ${i === 0 ? "border-t-2" : ""}
                ${i === board.length - 1 ? "border-b-2" : ""}
                ${j === 0 ? "border-l-2" : ""}
                ${j === row.length - 1 ? "border-r-2" : ""}
              `}
              onClick={() => onCellClick(i, j)}
              disabled={!!cell || disabled}
            >
              {cell && (
                <div
                  className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-6 h-6 rounded-full
                    ${
                      cell === "black"
                        ? "bg-black"
                        : "bg-white border-2 border-black"
                    }
                  `}
                />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
