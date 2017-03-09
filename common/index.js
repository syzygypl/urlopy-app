const compose = (...args) => initialValue => args.reduceRight(
  (result, fn) => fn(result),
  initialValue
);

module.exports = {
  compose
};