import React from 'react';
import { Link } from 'react-router-dom';
import { firebase as withFirebase } from 'react-redux-firebase';

// import MobileTearSheet from 'material-ui/MobileTearSheet'
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionHome from 'material-ui/svg-icons/action/home';
import ContentSend from 'material-ui/svg-icons/content/send';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';

import './style.css';

const Menu = ({ firebase }) => (
  <div className="menu-list">
    <List>
      <Link className="menu-link" to="/"><ListItem primaryText="Strona główna" leftIcon={<ActionHome />} /></Link>
      <Link className="menu-link" to="/vacations/submit"><ListItem primaryText="Nowy urlop" leftIcon={<ContentSend />} /></Link>
      <Link className="menu-link" to="/vacationsRequests"><ListItem primaryText="Aktualności" leftIcon={<ContentInbox />} /></Link>
    </List>
    <Divider />
    <List>
      <ListItem primaryText="Inne" rightIcon={<ActionInfo />} />
    </List>
    <List className="menu-link -logout">
      <ListItem onClick={firebase.logout} primaryText="Wyloguj" leftIcon={<ActionPowerSettingsNew />} />
    </List>
  </div>
);

Menu.propTypes = {
  firebase: React.PropTypes.shape({}).isRequired,
};

export default withFirebase()(Menu);
