import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

import VacationsRequestsTable from './Vacations/VacationsRequestsTable';

const VacationsRequests = () => (
  <Grid fluid>

    <Row>
      <Col xs={12} md={12}>
        <VacationsRequestsTable limitToLast="100" />
      </Col>
    </Row>

  </Grid>
);

export default VacationsRequests;
