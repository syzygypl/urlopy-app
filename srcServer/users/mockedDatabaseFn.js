const spyableThen = jest.fn(cb => cb());

const mockedDbFn = ({
  database: () => ({
    ref: jest.fn(() => ({ update: () => ({ then: spyableThen }) })),
  }),
});

module.exports = {
  mockedDbFn, spyableThen,
};
