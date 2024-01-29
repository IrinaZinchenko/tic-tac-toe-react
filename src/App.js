import { useState } from 'react';

function Square({value, onSquareClick}) {
  return <button className = "square" onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function createGameBoard() {
    let board = [];
    const BOARD_SIZE = 3;

    for (let i = 0; i < BOARD_SIZE; i++) {
      let row = [];

      for (let j = 0; j < BOARD_SIZE; j++) {
        const index = BOARD_SIZE * i + j
        row.push(<Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)}/>);
      }

      board.push(<div key={i} className = "board-row">{row}</div>);
    }

    return board;
  }

  return (
    <>
      <div className = "status">{status}</div>
        {createGameBoard()}
    </>
  );
}

export default function Game() {
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

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    let currentMoveText;
    if (move === currentMove) {
      currentMoveText = 'You are at move # ' + move;

      if (move === 0) {
        currentMoveText = 'Let\'s start!';
      }
    }

    return move === currentMove ?
      (<li key = {move}>
        <span>{currentMoveText}</span>
      </li>) :
      (<li key = {move}>
        <button onClick = {() => jumpTo(move)}>{description}</button>
      </li>);
  });

  return (
    <div className = "game">
      <div className = "game-board">
        <Board xIsNext = {xIsNext} squares = {currentSquares} onPlay = {handlePlay}/>
      </div>
      <div className = "game-info">
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
