export default (state = [], action) => ((action.type === 'SORT_ROWS_DATA') ? action.payload : state);
