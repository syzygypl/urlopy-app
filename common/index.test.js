const assert = require('assert');
const { zip } = require('./index');

describe('zip', () => {
  it('should zip two arrays into a single object', () => {
    const arr1 = ['age'];
    const arr2 = [30];

    assert.deepEqual(zip(arr1, arr2), { age: 30 });
    assert.deepEqual(zip(arr2, arr1), { 30: 'age' });
  });
});
