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
import {scanBalance, transferBalance} from '../store/actions/addresses';
import { history } from "App.js";

class AddressesBalancePage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        page: 1,
        limit: 30,
        coin_type: "",
        address: "",
        data: []
    };

    requestAddressesBalance() {
        if (!this.state.coin_type) {
            return alert("Coin type needed")
        }

        this.props.scanBalance(this.state.coin_type).then((data) => {
            if (data.payload.length == 0) {
                return alert("No address got any balance - all transfer")
            }
            this.setState({
                data: data.payload
            })
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }

    search = () =>{
        this.requestAddressesBalance()
    };

    transferBalance = (address) => {
        this.props.transferBalance(this.state.coin_type, address).then((data) => {
            alert("Success ...")
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }

    onChange = async (type, data) => {
        let updatingData = {}
        updatingData[type] = data
        await this.setState(updatingData)
    }

    render() {
        let data;

        if (this.state.data) {
            data = this.state.data.map((address, i) => {
                return (<tr key={i}>
                    <td>{address.address}</td>
                    <td>{address.balance}</td>
                    <td>
                        <Col xl={1} lg={1} md={1}>
                            <Button onClick={() => this.transferBalance(address.address)} > transfer balance </Button>
                        </Col>
                    </td>
                </tr>)
            })
        }
        return (
            <Page
                title="Addresses"
                breadcrumbs={[{ name: 'addresss', active: true }]}
                className=""
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardBody>
                                    <Row>
                                        {/* <Col xl={7} lg={7} md={7}>
                                            <Input className="mb-2" onChange={(e) => this.onChange("address", e.target.value)} type="Search" placeholder="search" bsSize="md" />
                                        </Col> */}
                                        <Col xl={3} lg={3} md={3}>
                                            <Input className="mb-2" placeholder="Coin type" onChange={(e) => this.onChange("coin_type", e.target.value)} />
                                        </Col>
                                        <Col xl={1} lg={1} md={1}>
                                            <Button onClick={this.search} > Scan </Button>
                                        </Col>
                                    </Row>
                                    
                                    <Row>
                                        <Col>
                                            <Card body>
                                                <Table style={{fontSize: "0.6vw"}}>
                                                    <thead>
                                                    <tr>
                                                        <th> Issued Address </th>
                                                        <th> Balance </th>
                                                        <th></th>
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

export default connect(null, {scanBalance, transferBalance})(AddressesBalancePage);

