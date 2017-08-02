const R = require('ramda');
const dnToCapitalizedFullName = require('./dnToCapitalizedFullName');

module.exports = allGroups => R.mapObjIndexed(
  namesInGroup =>
    namesInGroup
      .filter(R.identity)
      .map(dnToCapitalizedFullName)
      .map(fullName => `(cn=${fullName})`)
      .join(''),
  allGroups,
);
