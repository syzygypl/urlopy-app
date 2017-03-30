import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => (
  <ul>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/login">Login</Link></li>
    <li><Link to="/vacationsRequests">Vacations Requests</Link></li>
    <li><Link to="/vacations/submit">Nowy urlop</Link></li>
  </ul>
);

export default Menu;
