// load env variables from .env
require('dotenv').config();

const fs = require('fs');
const cors = require('cors');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const { port } = require('./config');
const usersRouter = require('./srcServer/users');
const firebase = require('./srcServer/firebase');
const loggingInRouter = require('./srcServer/logging-in');
const populateFirebase = require('./srcServer/users/populateFirebase');
const populateFirebaseWithGroupsMembers = require('./srcServer/users/populateFirebaseWithGroupsMembers');
const { sendVacationRequestNotification, sendStatusNotification } = require('./srcServer/mail/MailSender');
const { DatabaseError } = require('./srcServer/errorsHandler');

const populateData = () => {
  populateFirebase('users');
  populateFirebase('groups').then(populateFirebaseWithGroupsMembers);
};

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(loggingInRouter);
app.use(usersRouter);
app.use(express.static(`${__dirname}/build`));

https
  .createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  }, app)
  .on('error', (err) => {
    console.log('error', err);
  })
  .on('clientError', (err) => {
    console.log('clientError', err);
  })
  .listen(port, () => {
    console.log('Up and running...');
    populateData();
  });

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
      throw new Error({ appSpecificErrorCode: 3, message: 'Wybrani użytkownicy nie istnieją w bazie' });
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

    // we can now save the data to the firebase and notify users
    return db.ref().update(updates)
      .then(() =>
        sendVacationRequestNotification(values[0].val(), values[1].val(), vacationDays, notes),
      )
      .then(() => res.send({ status: 'OK' }))
      .catch((err) => {
        throw new DatabaseError('Błąd zapisu bazy danych', 6, err);
      });
  }).catch((err) => {
    // we got some error while adding new vacation request
    // @TODO: send to Sentry, along with some details (e.g. err, plus maybe request data)
    throw new DatabaseError(`Wystąpił problem z bazą danych. Spróbuj ponownie za chwilę a jeśli problem nie znika,
      skontaktuj się z działem IT (kod błędu: E-04).`, 4, err);
  }).catch((err) => {
    res.send(createErrorResponse(`${err.message} (kod błędu: E-${err.code})`));
  });
});

// @MOCK simply returns random INT in a range
// @TODO get data about weekends and holidays and return number of days
// to be subtracted from vacation pool
app.get('/vacations/work_days', (req, res) => {
  res.send(String(getRandomInt(1, 20)));
});

app.post('/mail/statusNotify', (req, res) => {
  const db = firebase.database();

  const { userID, vrID, status } = req.body;

  const notifyUserPromise = db.ref(`/users/${userID}`).once('value');
  const requestForVacationData = db.ref(`/vacationsRequests/${userID}/${vrID}`).once('value');
  const requestForVacationDates = db.ref(`/vacations/${vrID}`).once('value');

  Promise.all([notifyUserPromise, requestForVacationData, requestForVacationDates])
  .then((values) => {
    const [userRef, vacationRef, daysRef] = values;
    const user = userRef.val();
    const vacation = vacationRef.val();
    const days = daysRef.val();

    return sendStatusNotification(user, status, Object.values(days), vacation.notes);
  }).then(() => {
    res.send({
      status: 'OK',
    });
  }).catch(() => {
    // we got some error while sending notification
    // @TODO: send to Sentry, along with some details (e.g. err, plus maybe request data)
    res.send(createErrorResponse(
      'Wystąpił problem z wysyłką maila (kod błędu: E-05).',
    ));
  });
});

cron.schedule('0 4 * * *', populateData);
