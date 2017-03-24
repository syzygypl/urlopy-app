const sortBy = {
  field: 'userName',
  order: 'ascend',
};

export default (state = sortBy, action) => {
  const order = state.order === 'ascend' ? 'descend' : 'ascend';

  return action.type === 'SORT_ROWS_DATA'
    ? Object.assign({}, { field: action.payload, order })
    : state;
};
