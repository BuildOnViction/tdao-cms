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
import { getDetailAdmin } from "../store/actions/admins";
class AdminDetailPage extends React.Component {

    constructor(props) {
        super(props);
        if(this.props.match.params.id){
            this.props.getDetailAdmin(this.props.match.params.id);
        }
    }

    render() {
        let errMsg;
        if(this.props.error && this.props.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.props.error.errorMsg}
            </UncontrolledAlert>
        }
        let alert = null;
        if(this.props.location.search){
            let parsed = queryString.parse(this.props.location.search);

            if(parsed.success){
                alert = <Alert color="success">
                    Cập nhật thành công
                </Alert>;
            }
        }
            return (
                <Page title="Admins detail" breadcrumbs={[{ name: 'admins detail', active: true }]}>
                    <Col md="12" sm="12" xs="12">
                        {alert}
                        {errMsg}
                        <Card>

                        </Card>
                    </Col>
                    <CardBody>
                        <Link to={'/admins/edit/'+this.props.detail._id} ><Button color="primary">Edit</Button></Link>
                    </CardBody>
                    <Row>
                        <Col md={12} sm={12} xs={12} className="mb-12">
                            <Card className="flex-row">
                                <CardBody>
                                    <CardText>
                                        <b>TÊN:</b> {this.props.detail.name}
                                    </CardText>
                                    <CardText>
                                        <b>EMAIL:</b> {this.props.detail.email}
                                    </CardText>
                                    <CardText>
                                        <b>ROLES:</b> {this.props.detail.roles}
                                    </CardText>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Page>
            );
        }
}

export default connect((state) => {
    return  {
        detail: state.admins.detail,
        error: state.common.requests.error,

    }
}, {getDetailAdmin})(AdminDetailPage);
