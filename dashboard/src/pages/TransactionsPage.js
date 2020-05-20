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

import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import * as queryString from "query-string";
import {listTransactions} from '../store/actions/transactions';
import { history } from "App.js";

class TransactionsPage extends React.Component {

    constructor(props) {
        super(props);
        this.timeout =  0;
    }
    componentDidMount() {
        this.props.listTransactions(1, 100).then((data) => {
            console.log(data)
        }).catch((err) => {
            console.log(err)
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
                    Tạo thành công
                </Alert>;
            }
        }
        let data;

        // if (this.props.list) {
        //     data = this.props.list.map((job, i) => {
        //         return (<tr key={i}>
        //             <td>{job._id}</td>
        //             <td>{job.task_name}</td>
        //             <td>{job.state}</td>
        //             {/* <td>{JSON.stringify(job.SIGNATURE}</td> */}
        //             <td>{job.created_at}</td>
        //             <td>{job.error}</td>
        //             <td>
        //                 <ButtonGroup className="mr-3 mb-3">
        //                     <Button color="info"><div className="button-detail"><Link to={"/jobs/" + job._id + "?coin_type=" + this.state.coin_type}>detail</Link></div></Button>
        //                 </ButtonGroup>
        //             </td>
        //         </tr>)
        //     })
        // }
        return (
            <Page
                title="Transactions"
                breadcrumbs={[{ name: 'jobs', active: true }]}
                className="TablePage"
            >
                {/* <Link to={"/jobs/create"}><Button color='success'>Tạo đơn hàng</Button></Link> */}
                {alert}
                {errMsg}
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardBody>
                                    <Row>
                                        <Col xl={7} lg={7} md={7}>
                                            <Input className="mb-2" onChange={this.search} type="Search" placeholder="search" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input type="select" name="coin_type" onChange={(e) => this.onChange("coin_type", e.target.value)}
                                            >
                                                <option value='ALL'>ALL</option>
                                                <option value='BTC'>BTC</option>
                                                <option value='ETH'>ETH</option>
                                                <option value='USDT'>USDT</option>
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

export default connect(null, {listTransactions})(TransactionsPage);

