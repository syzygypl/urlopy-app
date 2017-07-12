import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { TextField } from 'redux-form-material-ui';
import { lightBlue200 } from 'material-ui/styles/colors';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { firebase as withFirebase } from 'react-redux-firebase';
import formatDate from 'date-fns/format';
import Comment from './Comment';

import * as props from '../props';

const ViewComment = ({ author, comment, handleCommentDeletion }) => {
  const addedDateObj = new Date(comment.addedDate);

  const actionButton = (
    <div style={{ background: lightBlue200 }}>
      <IconButton
        onClick={handleCommentDeletion}
        tooltip="usuń"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const commentBody = (
    <TextField
      style={{ margin: 6 }}
      name="commentBody"
      underlineShow={false}
      fullWidth
      multiLine type="text"
      value={comment.body.trim()}
    />
  );

  return (
    <Comment
      author={author}
      addedDate={`${formatDate(addedDateObj, 'HH:mm')} - ${formatDate(addedDateObj, 'YYYY-MM-DD')}`}
      body={commentBody}
      actionButton={actionButton}
    />
  );
};

ViewComment.propTypes = {
  author: props.user.isRequired,
  comment: props.comment.isRequired,
  handleCommentDeletion: PropTypes.func.isRequired,
};

export default withFirebase()(ViewComment);
