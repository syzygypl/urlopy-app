const postmark = require('postmark');
const { PostmarkError } = require('../errorsHandler');

const client = new postmark.Client(process.env.POSTMARK_API_KEY + 'a');

const prepareVacationDataString = (dates, notes) => `
${dates.map(date => `${date.from} - ${date.to} (dni roboczych: ${date.workDays})\r\n`).join('')}\r\n
${notes}`;

const sendVacationRequestNotification = (from, to, dates, notes) => client.sendEmail({
  From: process.env.POSTMARK_DEFAULT_SENDER_MAIL,
  To: to.mail,
  Subject: `[urlop] ${from.name}`,
  TextBody: prepareVacationDataString(dates, notes),
}).catch((err) => { throw new PostmarkError('sendVacationRequestNotification error', 6, err); });

const sendStatusNotification = (to, status, dates, notes) => client.sendEmail({
  From: process.env.POSTMARK_DEFAULT_SENDER_MAIL,
  To: to.mail,
  Subject: `[urlop] ${to.name} - ${status}`,
  TextBody: `Status urlopu: ${status}\r\n\r\n${prepareVacationDataString(dates, notes)}`,
}).catch((err) => { throw new PostmarkError('sendStatusNotification error', 7, err); });

module.exports = {
  sendVacationRequestNotification,
  sendStatusNotification,
};
