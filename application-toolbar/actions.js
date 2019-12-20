export const UPDATE_SELECTED_GRID = "UPDATE_SELECTED_GRID";

export const updateSelectedGrid = (columns, cells) => {
    return ({
        type: UPDATE_SELECTED_GRID,
        columns,
        cells
    })
};
