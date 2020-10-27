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
import {listTransactions, rescan} from '../store/actions/transactions';
import { history } from "App.js";

class TransactionsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        page: 1,
        limit: 30,
        coin_type: "ALL",
        hash: "",
        from_address: "",
        data: [],
        rescan: {}
    };

    requestTransactions() {
        this.props.listTransactions(this.state.page, this.state.limit, this.state.coin_type, this.state.hash, this.state.from_address).then((data) => {
            this.setState({
                data: data.payload
            })
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }
    componentDidMount() {
        this.requestTransactions()
    }

    handlePageClick = (data) => {
        this.setState({
            page:parseInt(data.selected) + 1
        }, () => {
                this.requestTransactions();
        });
        
    }

    search = (e) =>{
        this.setState({hash:e.target.value});
        this.requestTransactions()
    };

    filterTransactions = async () => {
        this.requestTransactions()
    }

    onChangeFilterProperties = async (type, data) => {
        this.state[type] = data
        await this.setState(this.state)
    }

    render() {
        let data;

        if (this.state.data) {
            data = this.state.data.map((job, i) => {
                let time = new Date(job.CreatedAt* 1000)
                return (<tr key={i}>
                    <td>{time.toString()}</td>
                    <td>{job.InTx.CoinType}</td>
                    <td style={{ wordWrap: "break-word", maxWidth: "250px" }}>{job.InTx.Hash}</td>
                    <td style={{ wordWrap: "break-word", maxWidth: "250px" }}>{job.OutTx.Hash}</td>
                    <td>{job.InTx.To}</td>
                    <td>{job.OutTx.To}</td>
                    <td>{job.InTx.Amount}</td>
                </tr>)
            })
        }
        return (
            <Page
                title="Transactions"
                breadcrumbs={[{ name: 'jobs', active: true }]}
                className=""
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardBody>
                                    <Row>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input className="mb-2" onChange={(e) => this.onChangeFilterProperties("hash", e.target.value)} type="text" placeholder="Hash " bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                        <Input className="mb-2" onChange={(e) => this.onChangeFilterProperties("coin_type", e.target.value)} type="text" placeholder="Coin type in upper case ie BTC, DEC, USDT" bsSize="md" />
                                        </Col>
                                        
                                        <Col xl={3} lg={3} md={3}>
                                            <Input className="mb-2" onChange={(e) => this.onChangeFilterProperties("from_address", e.target.value)} type="text" placeholder="User address" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                        <Button color="success" type='button' onClick={this.requestTransactions}>Filter</Button>
                                        </Col>
                                    </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardBody>
                                    <Row>
                                        <Col>
                                            <Card body>
                                                <Table style={{fontSize: "0.6vw"}}>
                                                    <thead>
                                                    <tr>
                                                        <th> Timestamp </th>
                                                        <th>Coin type</th>
                                                        <th style={{wordWrap: "break-word", maxWidth: "200px"}}>In Tx hash</th>
                                                        <th style={{wordWrap: "break-word", maxWidth: "200px"}}>Out Tx hash</th>
                                                        <th >In receiver</th>
                                                        <th >Out receiver</th>
                                                        <th >Amount</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {data}
                                                    </tbody>
                                                </Table>
                                            <ReactPaginate
                                                previousLabel={'previous'}
                                                nextLabel={'next'}
                                                breakLabel={'...'}
                                                pageCount={500}
                                                breakClassName={'break-me'}
                                                onPageChange={this.handlePageClick}
                                                containerClassName={'pagination'}
                                                subContainerClassName={'pages pagination'}
                                                activeClassName={'active'}
                                            />
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

export default connect(null, {listTransactions, rescan})(TransactionsPage);

