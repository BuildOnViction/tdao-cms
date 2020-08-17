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
        data: [],
        rescan: {}
    };

    requestTransactions() {
        this.props.listTransactions(this.state.page, this.state.limit, this.state.coin_type, this.state.hash).then((data) => {
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

    onChange = async (type, data) => {
        let updatingData = {}
        updatingData[type] = data
        await this.setState(updatingData)
        this.requestTransactions()
    }

    onChangeRescanProperties = async (type, data) => {
        let rescan = this.state.rescan
        rescan[type] = data
        await this.setState({
            rescan
        })
    }

    rescan = async () => {
        console.log("this.state.rescan ", this.state.rescan)
        this.props.rescan(this.state.rescan).then((data) => {
            alert("Wait for 10 seconds and see new tx in transactions page")
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }

    render() {
        let data;

        if (this.state.data) {
            data = this.state.data.map((job, i) => {
                let time = new Date(job.createdAt* 1000)
                return (<tr key={i}>
                    <td>{time.toString()}</td>
                    <td>{job.intx.cointype}</td>
                    <td style={{wordWrap: "break-word", maxWidth: "250px"}}>{job.intx.hash}</td>
                    <td style={{wordWrap: "break-word", maxWidth: "250px"}}>{job.outtx.hash}</td>
                    <td>{job.intx.to}</td>
                    <td>{job.outtx.to}</td>
                    <td>{job.intx.amount}</td>
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
                                            <Input className="mb-2" onChange={(e) => this.onChangeRescanProperties("cointype", e.target.value)} type="text" placeholder="Coin type in upper case ie BTC, DEC, USDT" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input className="mb-2" onChange={(e) => this.onChangeRescanProperties("blocknumber", e.target.value)} type="text" placeholder="Block number" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input className="mb-2" onChange={(e) => this.onChangeRescanProperties("sc_address", e.target.value)} type="text" placeholder="ERC20 address for token not native coin" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                        <Button color="success" type='button' onClick={this.rescan}>Rescan</Button>
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
                                        <Col xl={7} lg={7} md={7}>
                                            <Input className="mb-2" onChange={(e) => this.onChange("hash", e.target.value)} type="Search" placeholder="search" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input type="select" name="coin_type" onChange={(e) => this.onChange("coin_type", e.target.value)}
                                            >
                                                <option value='ALL'>ALL</option>
                                                <option value='BTC'>Mint BTC</option>
                                                <option value='ETH'>Mint ETH</option>
                                                <option value='USDT'>Mint USDT</option>
                                                <option value='TOMOBTC'>Burn BTC</option>
                                                <option value='TOMOETH'>Burn ETH</option>
                                                <option value='TOMOUSDT'>Burn USDT</option>
                                            </Input>
                                        </Col>
                                        {/* <Col xl={3} lg={3} md={3}>
                                            <Input type="select" name="status" onChange={(e) => this.onChange("status", e.target.value)}
                                            >
                                                <option value='ALL'>All</option>
                                                <option value='SUCCESS'>Success</option>
                                                <option value='FAILURE'>Fail</option>
                                            </Input>
                                        </Col> */}
                                    </Row>
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
                                                        {/* <th >In status</th> */}
                                                        {/* <th >Out status</th> */}
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

