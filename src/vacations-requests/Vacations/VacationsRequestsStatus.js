import React, { PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { lightBlue200 } from 'material-ui/styles/colors';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import SvgIconFace from 'material-ui/svg-icons/action/face';

import * as props from '../props';

import statuses from '../../app/helpers/statuses';

const VacationsRequestsStatus = ({
  vacationsRequest,
  vacationsRequestID,
  userID,
  doAfterPrompt,
}) => {
  const rejectButton = (
    <RaisedButton
      label="odrzuć"
      onClick={() => doAfterPrompt(vacationsRequest, 'rejected', userID, vacationsRequestID)}
      backgroundColor={lightBlue200}
      icon={<ClearIcon style={{ marginLeft: 0 }} />}
    />
  );

  const acceptButton = (
    <RaisedButton
      label="akceptuj"
      onClick={() => doAfterPrompt(vacationsRequest, 'accepted', userID, vacationsRequestID)}
      icon={<DoneIcon style={{ marginLeft: 0 }} />}
    />
  );

  const buttons = {
    rejected: [acceptButton],
    accepted: [rejectButton],
    pending: [acceptButton, rejectButton],
  };

  const style = { display: 'flex', alignItems: 'center', justifyContent: 'space-around' };

  return (
    <div style={style}>

      <Chip style={style}>
        <Avatar color="#444" icon={<SvgIconFace />} />
        {statuses[vacationsRequest.status]}
      </Chip>

      {buttons[vacationsRequest.status || 'pending']
        .map((Button, idx) => {
          const key = `button-${idx}`;

          return (<div key={key}>{Button}</div>);
        })}

    </div>
  );
};

VacationsRequestsStatus.propTypes = {
  doAfterPrompt: PropTypes.func.isRequired,
  vacationsRequest: props.vacationsRequest.isRequired,
  vacationsRequestID: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
};

export default VacationsRequestsStatus;
