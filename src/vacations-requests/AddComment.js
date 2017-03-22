import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import IconButton from 'material-ui/IconButton';
import { TextField } from 'redux-form-material-ui';
import { lightBlue500 } from 'material-ui/styles/colors';
import SendIcon from 'material-ui/svg-icons/content/send';

import Comment from './Comment';

import * as props from './props';

function AddComment({ handleSubmit, author, hasBody }) {
  const actionButton = (
    <div style={{ background: lightBlue500 }}>

      <IconButton
        disabled={!hasBody}
        type="submit"
        tooltip="wyślij"
      >
        <SendIcon />
      </IconButton>

    </div>
  );

  const commentBody = (
    <Field
      style={{ margin: 6 }}
      name="newCommentBody"
      hintText="Twój komentarz..."
      component={TextField}
      underlineShow={false}
      fullWidth
      multiLine type="text"
    />
  );

  return (
    <form onSubmit={handleSubmit} style={{ margin: 6, padding: 6 }}>
      <Comment
        author={author}
        body={commentBody}
        actionButton={actionButton}
      />
    </form>
  );
}

AddComment.defaultProps = {
  author: {
    name: '',
  },
};

AddComment.propTypes = {
  author: props.user.isRequired,
  hasBody: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'addComment',
})(AddComment);
