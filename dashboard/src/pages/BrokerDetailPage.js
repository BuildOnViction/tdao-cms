import Page from '../components/Page';
import React from 'react';
import { Link } from "react-router-dom";
import * as queryString from 'query-string';

import {
    Button,
    Card,
    CardBody,
    CardText,
    Col,
    Row,
    Alert,
    UncontrolledAlert
} from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import {getBrokerDetail} from "../store/actions/broker"
class BrokerDetailPage extends React.Component {

    constructor(props) {
        super(props);
        if(this.props.match.params.id){
            this.props.getBrokerDetail(this.props.match.params.id)
        }
    }

    render() {
        let alert = null;
        if(this.props.location.search){
            let parsed = queryString.parse(this.props.location.search);

            if(parsed.success){
                alert = <Alert color="success">
                    Cập nhật thành công
                </Alert>;
            }
        }
        let errMsg = null;
        if(this.props.error && this.props.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.props.error.errorMsg}
            </UncontrolledAlert>
        }
        if(this.props.detail){
            let id = this.props.detail && this.props.detail.user?this.props.detail.user._id:''
            let link = '/brokers/edit/'+id;
            return (
                <Page title="Job detail" breadcrumbs={[{ name: 'broker detail', active: true }]}>
                    <Col md="12" sm="12" xs="12">
                        {alert}
                        {errMsg}
                        <Card>

                        </Card>
                    </Col>
                    <CardBody>
                        <Link to={link} ><Button color="primary">Edit</Button></Link>
                    </CardBody>
                    <Row>
                        <Col md={12} sm={12} xs={12} className="mb-12">
                            <Card className="flex-row">
                                <CardBody>
                                    <CardText>
                                        <b>TÊN:</b> {this.props.detail && this.props.detail.broker?this.props.detail.broker.name:null}
                                    </CardText>
                                    
                                    <CardText>
                                        <b>CÔNG TY:</b> {this.props.detail && this.props.detail.broker && this.props.detail.broker.company ?this.props.detail.broker.company.name:null}
                                    </CardText>
                                    <CardText>
                                        <b>GIỚI THIỆU:</b> {this.props.detail && this.props.detail.broker && this.props.detail.broker.company ?this.props.detail.broker.introduce:null}
                                    </CardText>
                                    <CardText>
                                        <b>TIỀN TRONG TÀI KHOẢN:</b> {this.props.detail && this.props.detail.broker?this.props.detail.broker.balance:null}
                                    </CardText>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Page>
            );
        }

    }
}

export default connect((state) => {
    return  {
        error: state.common.requests.error,
        detail: state.brokers.broker_detail
    }
}, {getBrokerDetail})(BrokerDetailPage);
