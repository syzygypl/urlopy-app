const zip = (arr1, arr2) => arr1
  .map((val, index) => ({ [val]: arr2[index] }))
  .reduce((prev, val) => Object.assign({}, prev, val), {});

module.exports = {
  zip,
};
