import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebase as withFirebase } from 'react-redux-firebase';

import * as props from '../props';

const Comment = ({ author, body, addedDate, actionButton }) => (
  <Grid style={{ margin: 6, padding: 6 }} fluid>

    <Row>

      <Col xs={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <div>

          <Avatar size={60} style={{ fontSize: '0.8em', textAlign: 'center' }}>{author.name}</Avatar>

          <div>
            {addedDate}
          </div>

        </div>


      </Col>

      <Col xs={6}>

        <Row>

          <Col xs={12}>

            <Paper zDepth={2}>

              {body}

              <Divider />

              <Row end="xs">

                <Col xs={12}>

                  {actionButton}

                </Col>


              </Row>


            </Paper>

          </Col>

        </Row>

      </Col>

    </Row>

  </Grid>
);

Comment.defaultProps = {
  addedDate: '',
};

Comment.propTypes = {
  addedDate: PropTypes.string,
  author: props.user.isRequired,
  actionButton: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
};

export default withFirebase()(Comment);
