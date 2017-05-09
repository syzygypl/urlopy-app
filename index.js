// load env variables from .env
require('dotenv').config();

const populateFireWithUsers = require('./srcServer/users/populateFireWithUsers');

const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const { port } = require('./config');

const usersRouter = require('./srcServer/users');
const loggingInRouter = require('./srcServer/logging-in');

const firebase = require('./srcServer/firebase');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(loggingInRouter);
app.use(usersRouter);
app.use(express.static(`${__dirname}/build`));

app.listen(port, () => console.log('Up and running...'));

populateFireWithUsers();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createErrorResponse(msg) {
  return {
    status: 'ERROR',
    message: msg,
  };
}

// @TODO integrate with Auth
app.post('/vacations/', (req, res) => {
  // validate that request_for_user and notify_user exist

  // validate vacation ranges array:
  // - each range is correct (i.e. start date <= end date)
  // - work days are correctly calculated
  // - ranges are not overlapping
  console.log(req.body);

  const db = firebase.database();

  const vacationRequestData = req.body;

  const requestForUser = vacationRequestData.requestForUser;
  const notifyUser = vacationRequestData.notifyUser;

  const notes = vacationRequestData.notes;

  const vacationDays = vacationRequestData.vacationDays;

  if (!vacationDays || vacationDays.length < 1) {
    res.send(createErrorResponse('Należy podać przynajmniej 1 dzień/przedział urlopowy (kod błędu: E-01).'));
    return;
  }

  // @TODO: add proper validation for vacationDays. Check that:
  // - all properties exist: from, to, workingDays: DONE
  // - workingDays value is correct
  // - ranges are not overlapping
  const vacationDaysValid = vacationDays.reduce((isValid, currentRange) => (
    isValid && currentRange.from && currentRange.to && currentRange.workDays
  ), true);

  if (!vacationDaysValid) {
    res.send(createErrorResponse('Dane o urlopach wydają się być niepoprawne (kod błędu: E-02).'));
    return;
  }

  // check whether selected users (one that gets the vacation and, optionally,
  // one that should be notified) exist in the DB.
  const requestForUserPromise = db.ref(`users/${requestForUser}`).once('value');
  const notifyUserPromise = db.ref(`users/${notifyUser}`).once('value');

  let objectsExistenceToValidate = [requestForUserPromise];
  if (notifyUser) objectsExistenceToValidate = objectsExistenceToValidate.concat(notifyUserPromise);

  Promise.all(objectsExistenceToValidate).then((values) => {
    // check if we already have values for each user - i.e. they exist
    const objectsExist = values.reduce((isValid, current) => !!current.val(), true);

    if (!objectsExist) {
      res.send(createErrorResponse('Wybrani użytkownicy nie istnieją w bazie (kod błędy: E-03).'));
      return;
    }

    // generate new unique key for vacation request
    const newVacationRequestKey = db.ref().child('vacationRequests').push().key;

    const vacationRequestBasicData = {
      status: 'pending',
      vacationerID: requestForUser,
      notifyUser,
      notes: notes || null,
    };

    const vacationRequestDays = vacationDays.reduce((vacationRanges, currentRange) => {
      const rangeKey = db.ref('vacations').child(newVacationRequestKey).push().key;
      return Object.assign({}, vacationRanges, {
        [rangeKey]: currentRange,
      });
    }, {});

    const updates = {};
    // updates[`/vacationRequests/${newVacationRequestKey}`] = vacationRequestBasicData;
    updates[`/vacationsRequests/${String(requestForUser)}/${newVacationRequestKey}`] = vacationRequestBasicData;
    updates[`/vacations/${newVacationRequestKey}/`] = vacationRequestDays;

    // we can now save the data to the firebase
    db.ref().update(updates).then(() => {
      // success!
      res.send({
        status: 'OK',
      });
    });
  }).catch(() => {
    // we got some error while adding new vacation request
    // @TODO: send to Sentry, along with some details (e.g. err, plus maybe request data)
    res.send(createErrorResponse(
      `Wystąpił problem z bazą danych. Spróbuj ponownie za chwilę a jeśli problem nie znika,
      skontaktuj się z działem IT (kod błędu: E-04).`,
    ));
  });
});

// @MOCK simply returns random INT in a range
// @TODO get data about weekends and holidays and return number of days
// to be subtracted from vacation pool
app.get('/vacations/work_days', (req, res) => {
  res.send(String(getRandomInt(1, 20)));
})
