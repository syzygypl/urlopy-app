import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { firebaseConnect, dataToJS, toJS } from 'react-redux-firebase';
import isDataLoaded from '../../app/helpers/isDataLoaded';

import AddComment from './AddComment';
import ViewComment from './ViewComment';

import * as props from '../props';

const Comments = ({
  users,
  addComment,
  currentUser,
  comments,
  vacationsRequestsID,
  commentBody,
  firebase,
  deleteComment,
}) => (
  !isDataLoaded([users, comments])
    ? null
    : (
      <div>
        <AddComment
          hasBody={!!commentBody}
          author={{ name: currentUser.name }}
          handleSubmit={(evt) => {
            evt.preventDefault();
            addComment(firebase.auth().currentUser.uid, commentBody, vacationsRequestsID);
          }}
        />

        <ul style={{ listStyle: 'none' }}>
          {Object
            .keys(comments || {})
            .map((commentID) => {
              const comment = comments[commentID];

              return (
                <li style={{ margin: 4 }} key={commentID}>
                  <ViewComment
                    handleCommentDeletion={() => deleteComment(vacationsRequestsID, commentID)}
                    author={users[comment.authorID]}
                    comment={comment}
                  />
                </li>
              );
            })}
        </ul>

      </div>
    )
);

Comments.defaultProps = {
  commentBody: '',
  currentUser: {
    name: '',
    mail: '',
  },
  users: undefined,
  comments: undefined,
};

Comments.propTypes = {
  users: props.users,
  currentUser: props.user,
  comments: props.comments,
  firebase: props.firebase.isRequired,
  commentBody: props.commentBody,
  addComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
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
      currentUser: toJS(state.firebase).profile,
      users: dataToJS(state.firebase, 'users'),
      commentBody: formValueSelector('addComment')(state, 'newCommentBody'),
      comments: dataToJS(state.firebase, `comments/${ownProps.vacationsRequestsID}`),
    }),
    (dispatch, { firebase }) => ({
      addComment(currentUserID, body, givenVacationsRequestsID) {
        return firebase.push(`/comments/${givenVacationsRequestsID}`, {
          body,
          authorID: currentUserID,
          addedDate: Date.now(),
          modifiedDate: Date.now(),
        });
      },
      deleteComment(vrID, ID) {
        return firebase.database().ref(`comments/${vrID}/${ID}`).remove();
      },
    }),
  ),
)(Comments);
