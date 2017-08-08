const postmark = require('postmark');

const client = new postmark.Client('f12fa17c-6ef7-4c25-846f-119977f6506a');

const prepareVacationDataString = (dates, notes) => `
${dates.map(date => `${date.from} - ${date.to} (dni roboczych: ${date.workDays})\r\n`).join('')}\r\n
${notes}`;

const sendVacationRequestNotification = (from, to, dates, notes) => client.sendEmail({
  From: 'admin.mirek@szg.io',
  To: to.mail,
  Subject: `[urlop] ${from.name}`,
  TextBody: prepareVacationDataString(dates, notes),
});

const sendStatusNotification = (to, status, dates, notes) => client.sendEmail({
  From: 'admin.mirek@szg.io',
  To: to.mail,
  Subject: `[urlop] ${to.name} - ${status}`,
  TextBody: `Status urlopu: ${status}\r\n\r\n${prepareVacationDataString(dates, notes)}`,
});

module.exports = {
  sendVacationRequestNotification,
  sendStatusNotification,
};
