export default (state = 'userName', action) => ((action.type === 'SORT_ROWS_DATA') ? action.payload : state);
