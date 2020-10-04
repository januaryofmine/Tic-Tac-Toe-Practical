export const ACTION = {
  SET_GAME_ACTIVE: "SET_GAME_ACTIVE",
  SET_CURRENT_PLAYER: "SET_CURRENT_PLAYER",
  SET_GAME_STATE: "SET_GAME_STATE",
  SET_GAME_CELL_STATE: "SET_GAME_CELL_STATE",
  SET_NEXT_PLAYER: "SET_NEXT_PLAYER",
  UNDO: "UNDO",
  RESTART: "RESTART",
};

export const WINNING_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const winningMessage = (currentPlayer) =>
  `Player ${currentPlayer} has won!`;
export const drawMessage = () => `Game ended in a draw!`;
export const currentPlayerTurn = (currentPlayer) =>
  `It's ${currentPlayer}'s turn`;
