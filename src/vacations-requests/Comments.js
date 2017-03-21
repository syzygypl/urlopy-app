import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import Comment from './Comment';
import * as props from './props';

function Comments({ users, currentUserID, firebase, comments, vacationsRequestsID }) {
  const addComment = (body, givenVacationsRequestsID) => firebase.push(`/comments/${givenVacationsRequestsID}`, {
    body,
    authorID: currentUserID,
    addedDate: Date.now(),
    modifiedDate: Date.now(),
  });

  const deleteComment = (vrID, ID) => firebase.database().ref(`comments/${vrID}/${ID}`).remove();
  const handleCommentDeletion = deleteComment.bind(null, vacationsRequestsID);

  return (
    <div>
      <button onClick={() => addComment('a comment', vacationsRequestsID)}>
        add comment
      </button>

      <ul>
        {Object
          .keys(comments)
          .map(commentID => (
            <li key={commentID}>
              <Comment
                handleCommentDeletion={handleCommentDeletion}
                author={users[currentUserID]}
                body={comments[commentID].body}
                ID={commentID}
              />
            </li>
          ))}
      </ul>

    </div>
  );
}

Comments.defaultProps = {
  comments: {},
  users: {},
};

Comments.propTypes = {
  users: props.users,
  comments: props.comments,
  firebase: props.firebase.isRequired,
  currentUserID: props.userID.isRequired,
  vacationsRequestsID: props.vacationsRequestsID.isRequired,
};

export default compose(
  firebaseConnect(ownProps => (
    [
      'users/',
      `/comments/${ownProps.vacationsRequestsID}`,
    ]
  )),
  connect(
    (state, ownProps) => ({
      users: dataToJS(state.firebase, 'users') || {},
      comments: dataToJS(state.firebase, `comments/${ownProps.vacationsRequestsID}`) || {},
    }),
  ),
)(Comments);
