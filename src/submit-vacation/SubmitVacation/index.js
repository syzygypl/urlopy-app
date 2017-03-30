// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  FieldArray,
  arrayPush,
  arrayRemove,
  change,
  touch,
  untouch,
  isValid,
  isSubmitting,
  hasSubmitFailed,
} from 'redux-form';
import { AutoComplete, TextField } from 'redux-form-material-ui';
import axios from 'axios';

import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS,
} from 'react-redux-firebase';

import { Grid, Row, Col } from 'react-flexbox-grid';

import { grey400 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import MUIAutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import CalendarIcon from 'material-ui/svg-icons/action/date-range';
import Divider from 'material-ui/Divider';

import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import formatDate from 'date-fns/format';

import Collapse from 'react-collapse';

import DateRangePickerField from '../../ui/DateRangePicker/field';
import { sendVacationRequest } from '../actions';
import { formName } from '../meta';


class SubmitVacation extends React.Component {
  state = {
    loading: false,
  };

  renderVacationItems = (vacation, idx, fields) => {
    const fieldData = fields.get(idx);
    const vacationRange = fieldData.range;
    const startDay = vacationRange[0];
    const endDay = vacationRange[1];

    const title = `Od ${formatDate(startDay, 'DD-MM-YYYY')} do ${formatDate(endDay, 'DD-MM-YYYY')}`;
    const totalDays = differenceInCalendarDays(endDay, startDay) + 1;
    const workingDays = fieldData.workingDays;
    const subTitle = `W sumie dni: ${totalDays}, dni robocze: ${workingDays}`;

    const rightIcon = (
      <IconButton touch tooltip="Usuń" tooltipPosition="bottom-left">
        <DeleteIcon
          color={grey400}
          onClick={() => this.props.formArrayRemove(formName, 'vacationDays', idx)}
        />
      </IconButton>
    );

    return (
      <ListItem
        key={idx}
        leftIcon={<CalendarIcon />}
        rightIconButton={rightIcon}
        primaryText={title}
        secondaryText={subTitle}
        disabled
      />
    );
  };

  renderVacationList = ({ fields }) => (
    <List>
      <Subheader>Dni urlopowe</Subheader>
      <Divider />
      <Collapse isOpened>
        {fields.map(this.renderVacationItems)}
      </Collapse>
    </List>
  );

  render() {
    // show loading spinner if data is loading
    if (!isLoaded(this.props.users) || !isLoaded(this.props.groups)) {
      return (
        <Grid>
          <Row style={{ marginTop: '20px' }}>
            <Col xs={12}>
              <Row center="xs">
                <Col xs={12}>
                  <CircularProgress />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      );
    }

    const users = isEmpty(this.props.users)
      ? []
      : Object.keys(this.props.users).map(userKey => ({
        value: userKey,
        text: this.props.users[userKey].name,
      }));

    // whether the submit button should be disabled
    const disableSubmit = (
      (!this.props.isFormValid && !this.props.hasSubmitFailed) || this.props.isLoading
    );

    return (
      <Grid>

        <Paper zDepth={1}>
          <Subheader>Podstawowe informacje</Subheader>
          <Divider />
          <Row style={{ padding: '0px 20px 20px 20px' }}>
            <Col xs={12} md={6} lg={6}>
              <Field
                name="requestForUser"
                component={AutoComplete}
                hintText="Urlop dla..."
                floatingLabelText="Urlop dla..."
                filter={MUIAutoComplete.fuzzyFilter}
                dataSource={users}
                dataSourceConfig={{
                  text: 'text',
                  value: 'value',
                }}
                openOnFocus
                fullWidth
                validate={(value) => {
                  const error = value ? undefined : 'Wybierz osobę';
                  return error;
                }}
                onBlur={(evt, newValue, prevValue) => {
                  if (prevValue && newValue === prevValue.text) {
                    // we need this to prevent dispatch of blur action in this case
                    // because otherwise it resets field value to just the text value,
                    // rather than setting the value to the object
                    evt.preventDefault();
                  }
                  if (!newValue) {
                    this.props.formChange(formName, 'notifyUser', null);
                  }
                }}
                onChange={(evt, newValue) => {
                  // when selecting the user that the request is for, we want to automatically
                  // select the user that should be notified, that is - "leader" of the group
                  const selectedUserKey = newValue.value;
                  const selectedUserData = this.props.users[selectedUserKey];
                  const selectedUserGroupId = selectedUserData.groupID;

                  if (typeof selectedUserGroupId === 'undefined') {
                    // selected user is not assigned to any group
                    // we need to clear notifyUser field and we're done here
                    this.props.formChange(formName, 'notifyUser', null);
                    return;
                  }

                  const groupData = this.props.groups[selectedUserGroupId];
                  const groupLeaderId = groupData.leaderID;
                  const userToNotify = users.find(u => String(u.value) === String(groupLeaderId));
                  if (userToNotify) {
                    this.props.formChange(formName, 'notifyUser', userToNotify);
                    return;
                  }
                  this.props.formChange(formName, 'notifyUser', null);
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Field
                name="notifyUser"
                component={AutoComplete}
                hintText="Powiadom o zgłoszeniu"
                floatingLabelText="Powiadom o zgłoszeniu"
                filter={MUIAutoComplete.fuzzyFilter}
                dataSource={users}
                dataSourceConfig={{
                  text: 'text',
                  value: 'value',
                }}
                openOnFocus
                fullWidth
                onBlur={(evt, newValue, prevValue) => {
                  if (prevValue && newValue === prevValue.text) {
                    // we need this to prevent dispatch of blur action in this case
                    // because otherwise it resets field value to just the text value,
                    // rather than setting the value to the object
                    evt.preventDefault();
                  }
                }}
              />
            </Col>
          </Row>
        </Paper>

        <Paper zDepth={1} style={{ marginTop: '20px' }}>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <FieldArray
                name="vacationDays"
                component={this.renderVacationList}
                validate={(value) => {
                  const error = value && value.length >= 1 ? undefined : 'Należy wybrać przynajmniej 1 dzień urlopowy';
                  return error;
                }}
              />
              <Collapse isOpened>
                {this.state.loading ? <div style={{ padding: '5px 20px' }}><CircularProgress /></div> : <span />}
              </Collapse>
            </Col>
          </Row>
          <Row middle="xs" style={{ padding: '0px 20px 35px 20px' }}>
            <Col xs={12} md={12} lg={12}>
              <Field
                name="vacationRangeInput"
                component={DateRangePickerField}
                floatingLabelTexts={['Pierwszy dzień', 'Ostatni dzień']}
                hintTexts={['Pierwszy dzień', 'Ostatni dzień']}
                onActionClick={(value) => {
                  this.props.formTouch(formName, 'vacationRangeInput');
                  if (!value[0] || !value[1]) return;
                  this.setState({ loading: true });
                  axios.get(`${process.env.REACT_APP_INTERNAL_API_URL}/vacations/work_days`)
                    .then((res) => {
                      this.props.formArrayPush(formName, 'vacationDays', {
                        range: value,
                        workingDays: res.data,
                      });
                      this.setState({ loading: false });
                      this.props.formChange(formName, 'vacationRangeInput', [undefined, undefined]);
                      this.props.formUntouch(formName, 'vacationRangeInput');
                    })
                    .catch(() => {
                      this.setState({ loading: false });
                    });
                }}
                actionLabel="Dodaj"
                fullWidth
                warn={(value) => {
                  const error = value && value[0] && value[1] ? undefined : 'Uzupełnij dane';
                  return error;
                }}
              />
            </Col>
          </Row>
        </Paper>

        <Row>
          <Col xs={12} md={12} lg={12}>
            <Field
              name="notes"
              component={TextField}
              floatingLabelText="Notatki"
              hintText="Notatki, uwagi, strumień świadomości"
              multiLine
              fullWidth
            />
          </Col>
        </Row>

        <Collapse isOpened={!!this.props.error}>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{ color: '#FF4E50', marginTop: '20px' }}>
                <div><strong>Wystąpił błąd</strong></div>
                <p>{this.props.error}</p>
              </div>
            </Col>
          </Row>
        </Collapse>

        <Row style={{ marginTop: '40px' }}>
          <Col xs={12} md={12} lg={12}>
            <RaisedButton
              backgroundColor="#a4c639"
              label="Wyślij zgłoszenie"
              labelColor="#fff"
              icon={this.props.isLoading ? <CircularProgress size={20} /> : <SendIcon color="#fff" />}
              fullWidth
              onClick={this.props.sendVacationRequest}
              disabled={disableSubmit}
            />
          </Col>
        </Row>

      </Grid>
    );
  }
}

SubmitVacation.propTypes = {
  formArrayPush: PropTypes.func.isRequired,
  formArrayRemove: PropTypes.func.isRequired,
  formChange: PropTypes.func.isRequired,
  formTouch: PropTypes.func.isRequired,
  formUntouch: PropTypes.func.isRequired,
  sendVacationRequest: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasSubmitFailed: PropTypes.bool.isRequired,
  error: PropTypes.string,

  users: PropTypes.objectOf(PropTypes.shape),
  groups: PropTypes.objectOf(PropTypes.shape),
};

SubmitVacation.defaultProps = {
  users: undefined,
  groups: undefined,
  error: undefined,
};

const SubmitVacationForm = reduxForm({
  form: formName,
})(SubmitVacation);

const SubmitVacationFirebase = firebaseConnect([
  '/users',
  '/groups',
])(SubmitVacationForm);

export default connect((state) => {
  const firebase = state.firebase;

  return {
    users: dataToJS(firebase, '/users'),
    groups: dataToJS(firebase, '/groups'),
    isFormValid: isValid(formName)(state),
    isLoading: isSubmitting(formName)(state),
    hasSubmitFailed: hasSubmitFailed(formName)(state),
  };
}, {
  formArrayPush: arrayPush,
  formArrayRemove: arrayRemove,
  formChange: change,
  formTouch: touch,
  formUntouch: untouch,
  sendVacationRequest,
})(SubmitVacationFirebase);
