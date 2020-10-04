const initialState = {
  gameActive: true,
  currentPlayer: "X",
  gameState: ["", "", "", "", "", "", "", "", ""],
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

function reducer(state, action) {
  switch (action.type) {
    case "SET_GAME_ACTIVE":
      return {
        ...state,
        gameActive: action.payload,
      };
    case "SET_CURRENT_PLAYER":
      return {
        ...state,
        currentPlayer: action.payload,
      };
    case "SET_GAME_STATE":
      return {
        ...state,
        gameState: action.payload,
      };
    case "SET_GAME_CELL_STATE":
      const gameState = state.gameState.slice();
      gameState[action.payload] = state.currentPlayer;
      return {
        ...state,
        gameState: gameState,
      };
    default:
      return state;
  }
}

const store = createStore(reducer, initialState);

export default store;
