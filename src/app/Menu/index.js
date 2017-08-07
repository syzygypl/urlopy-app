import React from 'react';
import { Link } from 'react-router-dom';

// import MobileTearSheet from 'material-ui/MobileTearSheet'
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionHome from 'material-ui/svg-icons/action/home';
import ContentSend from 'material-ui/svg-icons/content/send';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';

import './style.css';

const Menu = () => (
  <div className="menu-list">
    <List>
      <Link className="menu-link" to="/"><ListItem primaryText="Strona główna" leftIcon={<ActionHome />} /></Link>
      <Link className="menu-link" to="/vacations/submit"><ListItem primaryText="Nowy urlop" leftIcon={<ContentSend />} /></Link>
      <Link className="menu-link" to="/vacationsRequests"><ListItem primaryText="Aktualności" leftIcon={<ContentInbox />} /></Link>
      <Link className="menu-link" to="/login"><ListItem primaryText="Login" leftIcon={<ActionPowerSettingsNew />} /></Link>
    </List>
    <Divider />
    <List>
      <ListItem primaryText="Inne" rightIcon={<ActionInfo />} />
    </List>
  </div>
);

export default Menu;
