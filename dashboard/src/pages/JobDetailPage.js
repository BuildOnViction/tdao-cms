import Page from '../components/Page';
import React from 'react';
import { Link } from "react-router-dom";
import * as queryString from 'query-string';

import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Row,
    Alert,
    UncontrolledAlert
} from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import { getDetailJobs, getDeleteJobs } from '../store/actions/jobs';
// import { JsonEditor as Editor } from 'jsoneditor-react';
// import 'jsoneditor-react/es/editor.min.css';

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

class JobsDetailPage extends React.Component {

    constructor(props) {
        super(props);

        if(this.props.match.params.id){
            this.props.getDetailJobs(this.props.match.params.id, getQueryVariable("from_node"));
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
        console.log("this.props.detail 11 ", this.props.detail)
            return (
                <Page title="Job detail" breadcrumbs={[{ name: 'job detail', active: true }]}>
                    <Col md="12" sm="12" xs="12">
                        {alert}
                        {errMsg}
                            <Card>

                        </Card>
                    </Col>
                    
                    <Row>
                        <Col md={12} sm={12} xs={12} className="mb-12">
                            <Card className="flex-row">
                                <CardBody>
                                    {/* <Editor
                                        value={this.props.detail.SIGNATURE}
                                        onChange={this.handleChange}
                                    /> */}
                                    <CardTitle>{this.props.detail.title}</CardTitle>
                                    <CardText>
                                        <b>MÔ TẢ</b>: {this.props.detail.description}
                                    </CardText>
                                    <CardText>
                                        <b>NƯỚC TUYỂN DỤNG:</b> {this.props.detail.country}
                                    </CardText>
                                    <CardText>
                                        <b>NƠI NỘP HỒ SƠ:</b> {this.props.detail.cv_location}
                                    </CardText>
                                    <CardText>
                                        <b>ĐIỀU KIỆN TUYỂN DỤNG:</b> {this.props.detail.required_condition}
                                    </CardText>
                                    <CardText>
                                        <b>KINH NGHIỆM:</b> {this.props.experience}
                                    </CardText>
                                    <CardText>
                                        <b>QUYỀN LỢI:</b> {this.props.detail.benefit}
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
    }
}, {getDetailJobs,getDeleteJobs})(JobsDetailPage);
