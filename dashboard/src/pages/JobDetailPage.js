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
    }

    componentDidMount() {
        this.loadJobDetail()
    }

    state = {
        job: {
        }
    }

    loadJobDetail = async() => {
        if(this.props.match.params.id){
            let job = await this.props.getDetailJobs(this.props.match.params.id, getQueryVariable("from_node"));
            console.log(job.payload)
            this.setState({
                job: job.payload || {}
            })
        }
    }

    relay = async () => {
        let result = await this.props.relayJob(this.state.job.SIGNATURE)
        alert(JSON.stringify(result.payload))
    }

    delete = async () => {
        let result = await this.props.relayJob(this.state.job.SIGNATURE)
        alert(JSON.stringify(result.payload))
    }

    handleChange = (value) => {
        console.log(value)
        this.state.job.SIGNATURE = value
        this.setState({
            job: this.state.job
        })
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
                                    
                                    <CardTitle>{this.state.job._id}</CardTitle>
                                    
                                    <CardText>
                                        <b>State </b>: {this.state.job.state}
                                    </CardText>

                                    <CardText>
                                        <b>Error </b>: {this.state.job.error}
                                    </CardText>
                                    <CardText>
                                        <b>Task Name </b> {this.state.job.task_name}
                                    </CardText>
                                    <Button color="success" type='button' onClick={this.relay}>Relay</Button>
                                    <Button color="danger" type='button' onClick={this.delete}>Delete</Button>
                                    { this.state.job.SIGNATURE ? 
                                        <Editor
                                            value={this.state.job.SIGNATURE}
                                            onChange={this.handleChange}
                                        /> : ""
                                    }
                                    
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
