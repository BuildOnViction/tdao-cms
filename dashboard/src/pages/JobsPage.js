import Page from '../components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Alert, Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,ButtonGroup,
    Input,
    UncontrolledAlert
} from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import {listJobs} from '../store/actions/jobs';
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import * as queryString from "query-string";
import { history } from "App.js";
import { getDeleteJobs, getSearchJobs, getActiveJobs} from '../store/actions/jobs';

class JobsPage extends React.Component {

    constructor(props) {
        super(props);
        this.timeout =  0;
    }
    
    loadJobs = async (page, limit, fromNode, status) => {
        try {
            let jobs = await this.props.listJobs(page, limit, fromNode, status);
            this.setState({
                jobs: jobs
            })
        } catch (err){
            alert(JSON.stringify(err))
        }
    }

    componentDidMount(){
        this.loadJobs(1, 100)
    }

    state = {
        modal: false,
        id: null,
        title: null,
        keywords:"",
        status:"ALL",
        jobs: [],
    };

    toggle = () => {
        return this.setState({
            modal: !this.state.modal,
        });

    };
    delete = (id)=>{
        this.props.getDeleteJobs(id);
        this.toggle();
        history.push('/jobs');
    };
    handlePageClick(data){
        this.loadJobs(parseInt(data.selected) + 1, 100, this.state.from_node, this.state.status);
    }
    search = (e) =>{
            this.setState({keywords:e.target.value});
            if(this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.loadJobs(1, 100,this.state.from_node, this.state.status)
            }, 1000);
    };
    // status = async (e) =>{
    //     await this.setState({status:e.target.value});
    //     await this.loadJobs(1, 100 ,this.state.from_node, this.state.status);
    // }
    onChange = async (type, data) => {
        let updatingData = {}
        updatingData[type] = data
        await this.setState(updatingData)
        await this.loadJobs(1, 100 ,this.state.from_node, this.state.status);
    }
    render() {
        let data
        if (this.state.jobs) {
            data = this.state.jobs.map((job, i) => {
                let active_button;
                return (<tr key={i}>
                    <td>{job._id}</td>
                    <td>{job.task_name}</td>
                    <td>{job.state}</td>
                    {/* <td>{JSON.stringify(job.SIGNATURE}</td> */}
                    <td>{job.created_at}</td>
                    <td>{job.error}</td>
                    <td>
                        <ButtonGroup className="mr-3 mb-3">
                            <Button color="info"><div className="button-detail"><Link to={"/jobs/" + job._id + "?from_node=" + this.state.from_node}>detail</Link></div></Button>
                        </ButtonGroup>
                    </td>
                </tr>)
            })
        }
        return (
            <Page
                title="Jobs"
                breadcrumbs={[{ name: 'jobs', active: true }]}
                className="TablePage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <Modal
                                isOpen={this.state.modal}
                                toggle={this.toggle}
                                className={this.props.className}>
                                <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                                <ModalBody>
                                    Bạn có chắc muốn xóa {this.state.title}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={()=>this.delete(this.state.id)}>
                                        Delete
                                    </Button>{' '}
                                    <Button color="secondary" onClick={this.toggle}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* <CardHeader>Job list</CardHeader> */}
                            <CardBody>
                                    <Row>
                                        <Col xl={7} lg={7} md={7}>
                                            <Input className="mb-2" onChange={this.search} type="Search" placeholder="search" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input type="select" name="from_node" onChange={(e) => this.onChange("from_node", e.target.value)}
                                            >
                                                <option value='master'>Master Node</option>
                                                <option value='verifier'>Verifier Node</option>
                                                <option value='wallet'>Wallet Node</option>
                                                <option value='proxy'>Proxy Node</option>
                                                <option value='api'>Api Node</option>
                                            </Input>
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input type="select" name="status" onChange={(e) => this.onChange("status", e.target.value)}
                                            >
                                                <option value='ALL'>All</option>
                                                <option value='SUCCESS'>Success</option>
                                                <option value='FAILURE'>Fail</option>
                                            </Input>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Card body>
                                                <Table>
                                                    <thead>
                                                    <tr>
                                                        <th>#ID</th>
                                                        <th>Task Name</th>
                                                        <th>Status</th>
                                                        {/* <th>SIGNATURE</th> */}
                                                        <th>Created at</th>
                                                        <th >Error</th>
                                                        <th> </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {data}
                                                    </tbody>
                                                </Table>
                                            </Card>
                                        </Col>
                                    </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                
            </Page>
        );
    }
}

export default connect(null, {listJobs,getDeleteJobs,getSearchJobs,getActiveJobs})(JobsPage);
