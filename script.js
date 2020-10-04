import store from "./store.js";
import {
  ACTION,
  WINNING_CONDITIONS,
  winningMessage,
  drawMessage,
  currentPlayerTurn,
} from "./const.js";

const statusDisplay = document.querySelector(".game--status");
statusDisplay.innerHTML = currentPlayerTurn(store.getState().currentPlayer);

function handleCellPlayed(clickedCell, clickedCellIndex) {
  store.dispatch({
    type: ACTION.SET_GAME_CELL_STATE,
    payload: clickedCellIndex,
  });
  clickedCell.innerHTML = store.getState().currentPlayer;
}

function handlePlayerChange() {
  const nextPlayer = store.getState().currentPlayer === "X" ? "O" : "X";
  store.dispatch({
    type: ACTION.SET_CURRENT_PLAYER,
    payload: nextPlayer,
  });
  statusDisplay.innerHTML = currentPlayerTurn(store.getState().currentPlayer);
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = WINNING_CONDITIONS[i];
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
    statusDisplay.innerHTML = winningMessage(store.getState().currentPlayer);
    store.dispatch({
      type: ACTION.SET_GAME_ACTIVE,
      payload: false,
    });

    return;
  }

  let roundDraw = !store.getState().gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    store.dispatch({
      type: ACTION.SET_GAME_ACTIVE,
      payload: false,
    });
    return;
  }

  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
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
    type: ACTION.SET_GAME_ACTIVE,
    payload: true,
  });
  store.dispatch({
    type: ACTION.SET_CURRENT_PLAYER,
    payload: "X",
  });
  store.dispatch({
    type: ACTION.SET_GAME_STATE,
    payload: ["", "", "", "", "", "", "", "", ""],
  });
  statusDisplay.innerHTML = currentPlayerTurn(store.getState().currentPlayer);
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);
