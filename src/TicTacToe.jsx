import React, { useState } from 'react';
import './TicTacToe.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, gridSize }) {
  function handleClick(i) {
    if (calculateWinner(squares, gridSize) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, gridSize);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(square => square !== null)) {
    status = "It's a draw!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Generate board dynamically based on grid size
  const rows = [];
  for (let row = 0; row < gridSize; row++) {
    const cells = [];
    for (let col = 0; col < gridSize; col++) {
      const index = row * gridSize + col;
      cells.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    rows.push(
      <div key={row} className="board-row">
        {cells}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board" style={{ '--grid-size': gridSize }}>
        {rows}
      </div>
    </>
  );
}

export default function TicTacToe() {
  const [gridSize, setGridSize] = useState(3);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function changeGridSize(newSize) {
    const size = Math.max(3, Math.min(100, parseInt(newSize) || 3));
    setGridSize(size);
    setHistory([Array(size * size).fill(null)]);
    setCurrentMove(0);
  }

  function handleCustomSize(e) {
    e.preventDefault();
    const input = e.target.elements.customSize;
    const size = parseInt(input.value);
    if (size >= 3 && size <= 100) {
      changeGridSize(size);
      input.value = '';
    } else {
      alert('Please enter a grid size between 3 and 100');
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <div className="grid-size-selector">
          <label>Grid Size:</label>
          {[3, 5, 10, 20].map(size => (
            <button
              key={size}
              className={`size-button ${gridSize === size ? 'active' : ''}`}
              onClick={() => changeGridSize(size)}
            >
              {size}x{size}
            </button>
          ))}
          <form onSubmit={handleCustomSize} className="custom-size-form">
            <input
              type="number"
              name="customSize"
              min="3"
              max="100"
              placeholder="Custom"
              className="custom-size-input"
            />
            <button type="submit" className="custom-size-submit">Go</button>
          </form>
        </div>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          gridSize={gridSize}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, gridSize) {
  // Check rows
  for (let row = 0; row < gridSize; row++) {
    const first = squares[row * gridSize];
    if (!first) continue;

    let won = true;
    for (let col = 1; col < gridSize; col++) {
      if (squares[row * gridSize + col] !== first) {
        won = false;
        break;
      }
    }
    if (won) return first;
  }

  // Check columns
  for (let col = 0; col < gridSize; col++) {
    const first = squares[col];
    if (!first) continue;

    let won = true;
    for (let row = 1; row < gridSize; row++) {
      if (squares[row * gridSize + col] !== first) {
        won = false;
        break;
      }
    }
    if (won) return first;
  }

  // Check diagonal (top-left to bottom-right)
  const first = squares[0];
  if (first) {
    let won = true;
    for (let i = 1; i < gridSize; i++) {
      if (squares[i * gridSize + i] !== first) {
        won = false;
        break;
      }
    }
    if (won) return first;
  }

  // Check anti-diagonal (top-right to bottom-left)
  const firstAnti = squares[gridSize - 1];
  if (firstAnti) {
    let won = true;
    for (let i = 1; i < gridSize; i++) {
      if (squares[i * gridSize + (gridSize - 1 - i)] !== firstAnti) {
        won = false;
        break;
      }
    }
    if (won) return firstAnti;
  }

  return null;
}
