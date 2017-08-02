const moxios = require('moxios');

const populateFirebase = require('./populateFirebase');
const dbFn = require('./mockedDatabaseFn');

jest.mock('../firebase', () => require('./mockedDatabaseFn').mockedDbFn); //eslint-disable-line

global.console = { log: jest.fn() };

describe('populateFirebase', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    dbFn.spyableThen.mockReset();

    moxios.uninstall();
  });

  it('should return an object with data field containing entities', async () => {
    moxios.stubRequest('https://localhost:4000/users', { status: 200, response: { STUDIO: {} } });

    const { data } = await populateFirebase('users');

    expect(dbFn.spyableThen).toBeCalled();

    return expect(data).toEqual({ STUDIO: {} });
  });

  it('should log an error when an API call failed', async () => {
    moxios.stubRequest('https://localhost:4000/groups', { status: 500, response: { STUDIO: {} } });

    await populateFirebase('groups');

    expect(dbFn.spyableThen).not.toBeCalled();
    expect(console.log).toBeCalled();
  });
});
