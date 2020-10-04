import { ACTION } from "./const.js";

// INITIAL STATE
const initialState = {
  gameActive: true,
  currentPlayer: "X",
  gameState: ["", "", "", "", "", "", "", "", ""],
  history: [],
};

function createStore(reducer, initialState) {
  let state = initialState;
  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
  }

  return { getState, dispatch };
}

// REDUCER
function reducer(state, action) {
  switch (action.type) {
    case ACTION.SET_GAME_ACTIVE:
      return {
        ...state,
        gameActive: action.payload,
      };
    case ACTION.SET_CURRENT_PLAYER:
      return {
        ...state,
        currentPlayer: action.payload,
      };
    case ACTION.SET_GAME_STATE:
      return {
        ...state,
        gameState: action.payload,
      };
    case ACTION.SET_GAME_CELL_STATE:
      const gameState = state.gameState.slice();
      gameState[action.payload] = state.currentPlayer;
      return {
        ...state,
        gameState: gameState,
      };
    case ACTION.SET_NEXT_PLAYER:
      const nextPlayer = state.currentPlayer === "X" ? "O" : "X";
      const step = {
        gameState: state.gameState,
        gameActive: state.gameActive,
      };
      return {
        ...state,
        currentPlayer: nextPlayer,
        history: [].concat(state.history, step),
      };
    case ACTION.UNDO:
      const prevPlayer = state.currentPlayer === "X" ? "O" : "X";
      const prevMoves = state.history.slice(0, -1);

      return {
        gameActive: prevMoves[prevMoves.length - 1].gameActive,
        currentPlayer: prevPlayer,
        gameState: prevMoves[prevMoves.length - 1].gameState,
        history: prevMoves,
      };
    case ACTION.RESTART:
      return initialState;
    default:
      return state;
  }
}

export const store = createStore(reducer, initialState);

// SELECTOR
export function getCurrentPlayer() {
  return store.getState().currentPlayer;
}

export function getGameActive() {
  return store.getState().gameActive;
}

export function getGameState() {
  return store.getState().gameState;
}

export function getGameHistory() {
  return store.getState().history;
}
