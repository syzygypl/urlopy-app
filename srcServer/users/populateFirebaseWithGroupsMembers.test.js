const moxios = require('moxios');

const populateFirebaseWithGroupsMembers = require('./populateFirebaseWithGroupsMembers');

const dummyData = {
  adam_nowak: { cn: 'Adam Nowak' },
  jan_kowalski: { cn: 'Jan Kowalski' },
};

jest.mock('../firebase', () => ({
  database: () => ({
    ref: () => ({
      update: () => Promise.resolve({
        adam_nowak: { cn: 'Adam Nowak' },
        jan_kowalski: { cn: 'Jan Kowalski' },
      }),
    }),
  }),
}));

global.console = { log: jest.fn() };

const groups = {
  CS: dummyData,
  IT: dummyData,
  Studio: dummyData,
  PM: dummyData,
  Strategy: dummyData,
  Creative: dummyData,
};

describe('populateFirebaseWithGroupsMembers', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return a promise containing an array with data related to API response', async () => {
    moxios.stubRequest('https://localhost:4000/groups-members', { status: 200, response: groups });

    return expect(
      (Object.values(await populateFirebaseWithGroupsMembers()))).toEqual(Object.values(groups));
  });

  it('should log an error when an API call failed', async () => {
    moxios.stubRequest('https://localhost:4000/groups-members', { status: 500, response: {} });

    await populateFirebaseWithGroupsMembers();

    expect(console.log).toBeCalled();
  });
});
