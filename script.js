import store from "./store.js";

const statusDisplay = document.querySelector(".game--status");

const winningMessage = () =>
  `Player ${store.getState().currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${store.getState().currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
  //   gameState[clickedCellIndex] = store.getState().currentPlayer;
  store.dispatch({
    type: "SET_GAME_CELL_STATE",
    payload: clickedCellIndex,
  });
  clickedCell.innerHTML = store.getState().currentPlayer;
}

function handlePlayerChange() {
  const nextPlayer = store.getState().currentPlayer === "X" ? "O" : "X";
  store.dispatch({
    type: "SET_CURRENT_PLAYER",
    payload: nextPlayer,
  });
  statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = store.getState().gameState[winCondition[0]];
    let b = store.getState().gameState[winCondition[1]];
    let c = store.getState().gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerHTML = winningMessage();
    store.dispatch({
      type: "SET_GAME_ACTIVE",
      payload: false,
    });

    return;
  }

  let roundDraw = !store.getState().gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    store.dispatch({
      type: "SET_GAME_ACTIVE",
      payload: false,
    });
    return;
  }

  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
  console.log(store.getState());
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (
    store.getState().gameState[clickedCellIndex] !== "" ||
    !store.getState().gameActive
  ) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleRestartGame() {
  store.dispatch({
    type: "SET_GAME_ACTIVE",
    payload: true,
  });
  store.dispatch({
    type: "SET_CURRENT_PLAYER",
    payload: "X",
  });
  store.dispatch({
    type: "SET_GAME_STATE",
    payload: ["", "", "", "", "", "", "", "", ""],
  });
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);
