import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import AddComment from './AddComment';
import ViewComment from './ViewComment';

import * as props from './props';

function Comments({ users, currentUserID, firebase, comments, vacationsRequestsID, commentBody }) {
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
      <AddComment
        hasBody={!!commentBody}
        author={users[currentUserID]}
        handleSubmit={(evt) => {
          evt.preventDefault();
          addComment(commentBody, vacationsRequestsID);
        }}
      />

      <ul style={{ listStyle: 'none' }}>
        {Object
          .keys(comments)
          .map(commentID => (
            <li style={{ margin: 4 }} key={commentID}>
              <ViewComment
                handleCommentDeletion={() => handleCommentDeletion(commentID)}
                author={users[currentUserID]}
                comment={comments[commentID]}
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
  commentBody: '',
};

Comments.propTypes = {
  users: props.users,
  comments: props.comments,
  commentBody: props.commentBody,
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
      commentBody: formValueSelector('addComment')(state, 'newCommentBody'),
      comments: dataToJS(state.firebase, `comments/${ownProps.vacationsRequestsID}`) || {},
    }),
  ),
)(Comments);
