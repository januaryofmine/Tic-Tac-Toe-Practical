import {
  store,
  getCurrentPlayer,
  getGameActive,
  getGameState,
  getGameHistory,
} from "./store.js";
import {
  ACTION,
  WINNING_CONDITIONS,
  winningMessage,
  drawMessage,
  currentPlayerTurn,
} from "./const.js";

const statusDisplay = document.querySelector(".game--status");
statusDisplay.innerHTML = currentPlayerTurn(getCurrentPlayer());

function handleCellPlayed(clickedCell, clickedCellIndex) {
  store.dispatch({
    type: ACTION.SET_GAME_CELL_STATE,
    payload: clickedCellIndex,
  });
  clickedCell.innerHTML = getCurrentPlayer();
}

function handlePlayerChange() {
  store.dispatch({
    type: ACTION.SET_NEXT_PLAYER,
  });
  statusDisplay.innerHTML = currentPlayerTurn(getCurrentPlayer());
}

function handleResultValidation() {
  let roundWon = false;
  for (const condition of WINNING_CONDITIONS) {
    const gameState = getGameState();
    let a = gameState[condition[0]];
    let b = gameState[condition[1]];
    let c = gameState[condition[2]];
    if (a === b && b === c && a !== "") {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerHTML = winningMessage(getCurrentPlayer());
    store.dispatch({
      type: ACTION.SET_GAME_ACTIVE,
      payload: false,
    });

    return;
  }

  let roundDraw = !getGameState().includes("");
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
  // 1. Get index of cell
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  // 2. Check if that cell not tick yet and game still active (not have winner)
  if (getGameState()[clickedCellIndex] !== "" || !getGameActive()) {
    return;
  }

  // 3. Handle cell change
  handleCellPlayed(clickedCell, clickedCellIndex);

  // 4. Check if have winner or not
  handleResultValidation();
}

// Restart all states and text
function handleRestartGame() {
  store.dispatch({
    type: ACTION.RESTART,
    payload: true,
  });
  statusDisplay.innerHTML = currentPlayerTurn(getCurrentPlayer());
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}

function handleUndo() {
  // Check if have data to undo or not
  if (getGameHistory().length > 1) {
    store.dispatch({
      type: ACTION.UNDO,
      payload: true,
    });
    const gameState = getGameState();
    document
      .querySelectorAll(".cell")
      .forEach((cell, i) => (cell.innerHTML = gameState[i]));
  } else handleRestartGame();
}

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);
document.querySelector(".game--undo").addEventListener("click", handleUndo);
