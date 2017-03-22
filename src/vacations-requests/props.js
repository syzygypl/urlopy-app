import { PropTypes } from 'react';

const addedDate = PropTypes.date;
const modifiedDate = PropTypes.date;

/* vacations:start */

const vacation = PropTypes.shape({
  addedDate,
  modifiedDate,

  endDate: PropTypes.number,
  startDate: PropTypes.number,
});

const vacations = PropTypes.shape({
  [PropTypes.string]: PropTypes.arrayOf(vacation),
});

/* vacations:end */

/* vacationsRequests:start */

const vacationsRequest = PropTypes.shape({
  vocationerID: PropTypes.number,
  status: PropTypes.oneOf([
    'pending', 'rejected', 'accepted',
  ]),
});

const vacationsRequests = PropTypes.shape({
  [PropTypes.string]: vacationsRequest,
});

const vacationsRequestsID = PropTypes.string;

/* vacationsRequests:end */


/* comments:start */

const commentID = PropTypes.string;
const commentBody = PropTypes.string;

const comment = PropTypes.shape({
  addedDate,
  modifiedDate,

  body: PropTypes.string,
  authorID: PropTypes.string,
});

const comments = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.shape({ [PropTypes.string]: PropTypes.arrayOf(comment) })),
  PropTypes.shape({}),
]);

/* comments:end */

/* users:start */

const name = PropTypes.string;
const mail = PropTypes.string;

const user = PropTypes.shape({ name, mail });
const userID = PropTypes.string;

const users = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.shape({ [PropTypes.string]: PropTypes.arrayOf(user) })),
  PropTypes.shape({}),
]);

/* users:end */

const match = PropTypes.shape({
  params: PropTypes.shape({}),
});

const firebase = PropTypes.shape({
  push: PropTypes.func,
  database: PropTypes.func,
});

export {
  comments,

  firebase,

  match,

  vacation,
  vacations,
  vacationsRequest,
  vacationsRequests,
  vacationsRequestsID,

  comment,
  commentID,
  commentBody,

  user,
  users,
  userID,
};
