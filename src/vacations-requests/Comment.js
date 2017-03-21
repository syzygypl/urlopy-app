import React, { PropTypes } from 'react';
import { firebase as withFirebase } from 'react-redux-firebase';

import * as props from './props';

const Comment = ({ author, ID, body, handleCommentDeletion }) => (
  <div>
    <div style={{ border: '2px solid tomato', display: 'inline-block', width: '70%' }}>
      <p>{body}</p>

      <p>
        Comment by: {author.name}, {author.mail}
      </p>
    </div>

    <button onClick={() => handleCommentDeletion(ID)}>x</button>
  </div>
);

Comment.propTypes = {
  author: props.user.isRequired,
  ID: props.commentID.isRequired,
  body: props.commentBody.isRequired,
  handleCommentDeletion: PropTypes.func.isRequired,
};

export default withFirebase()(Comment);
