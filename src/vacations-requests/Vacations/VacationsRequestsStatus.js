import React, { PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { lightBlue200 } from 'material-ui/styles/colors';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import SvgIconFace from 'material-ui/svg-icons/action/face';

import * as props from '../props';

const VacationsRequestsStatus = ({
  vacationsRequest,
  vacationsRequestID,
  currentUserID,
  doAfterPrompt,
}) => {
  const statuses = {
    rejected: 'Odrzucone',
    accepted: 'Zaakceptowane',
    pending: 'Oczekujące',
  };

  const rejectButton = (
    <RaisedButton
      label="odrzuć"
      onClick={() => doAfterPrompt(vacationsRequest, 'rejected', currentUserID, vacationsRequestID)}
      backgroundColor={lightBlue200}
      icon={<ClearIcon />}
    />
  );

  const acceptButton = (
    <RaisedButton
      label="akceptuj"
      onClick={() => doAfterPrompt(vacationsRequest, 'accepted', currentUserID, vacationsRequestID)}
      icon={<DoneIcon />}
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
  currentUserID: PropTypes.string.isRequired,
};

export default VacationsRequestsStatus;
