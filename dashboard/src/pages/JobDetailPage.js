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
import { getDetailJobs, relayJob } from '../store/actions/jobs';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

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

    submit = async () => {
        let result = await this.props.relayJob(this.props.detail.SIGNATURE)
        alert(JSON.stringify(result.payload))
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
        console.log("this.props.detail 11 ", this.props)
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
                                    
                                    <CardTitle>{this.props.detail._id}</CardTitle>
                                    
                                    <CardText>
                                        <b>State </b>: {this.props.detail.state}
                                    </CardText>

                                    <CardText>
                                        <b>Error </b>: {this.props.detail.error}
                                    </CardText>
                                    <CardText>
                                        <b>Task Name </b> {this.props.detail.task_name}
                                    </CardText>
                                    <Button color="success" type='button' onClick={this.submit}>Relay</Button>
                                    <Editor
                                        value={this.props.detail.SIGNATURE}
                                        onChange={this.handleChange}
                                    />
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
        detail: state.jobs.detail
    }
}, {getDetailJobs,relayJob})(JobsDetailPage);
