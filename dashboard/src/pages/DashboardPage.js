import React from 'react';


import {
  Row,
  Col,
} from 'reactstrap';

import Page from 'components/Page';

import { NumberWidget } from 'components/Widget';
import connect from "react-redux/es/connect/connect";
import {getStatisticsUser} from "../store/actions/users";

class DashboardPage extends React.Component {
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
  }
  constructor(props){
      super(props)
  }
  render() {
    return (
      <Page
        className="DashboardPage"
        title="Dashboard"
        breadcrumbs={[{ name: 'Dashboard', active: true }]}>
        <Row>
          We're updating soon
        </Row>
      </Page>
    );
  }
}
export default connect((state) => {
    return {
        statistics: {}
    }
}, {getStatisticsUser})(DashboardPage);

