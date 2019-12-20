import * as actions from "./actions";

const INITIAL_STATE = {
    columns: [],
    gridCells: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actions.UPDATE_SELECTED_GRID:
            return {
                ...state,
                cells: action.cells,
                columns: action.columns
            };
        default:
            return state;
    }
};
