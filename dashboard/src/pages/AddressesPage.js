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
import {listAddresses} from '../store/actions/addresses';
import { history } from "App.js";

class AddressesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        page: 1,
        limit: 30,
        coin_type: "ALL",
        address: "",
        data: []
    };

    requestAddresses() {
        this.props.listAddresses(this.state.page, this.state.limit, this.state.coin_type, this.state.address).then((data) => {
            this.setState({
                data: data.payload
            })
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }
    componentDidMount() {
        this.requestAddresses()
    }

    handlePageClick = (data) => {
        this.setState({
            page:parseInt(data.selected) + 1
        }, () => {
                this.requestAddresses();
        });
        
    }

    search = () =>{
        this.requestAddresses()
    };

    onChange = async (type, data) => {
        let updatingData = {}
        updatingData[type] = data
        await this.setState(updatingData)
        // this.requestAddresses()
    }

    render() {
        let data;

        if (this.state.data) {
            data = this.state.data.map((address, i) => {
                return (<tr key={i}>
                    <td>{address.coin}</td>
                    <td>{address.tomo}</td>
                    <td>{address.address}</td>
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
                                        <Col xl={7} lg={7} md={7}>
                                            <Input className="mb-2" onChange={(e) => this.onChange("address", e.target.value)} type="Search" placeholder="search" bsSize="md" />
                                        </Col>
                                        <Col xl={3} lg={3} md={3}>
                                            <Input className="mb-2" placeholder="Coin type" onChange={(e) => this.onChange("coin_type", e.target.value)} />
                                        </Col>
                                        <Col xl={1} lg={1} md={1}>
                                            <Button onClick={this.search} > Search </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Card body>
                                                <Table style={{fontSize: "0.6vw"}}>
                                                    <thead>
                                                    <tr>
                                                        <th>Coin type</th>
                                                        <th> Tomo Address </th>
                                                        <th> Issued Address </th>
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

export default connect(null, {listAddresses})(AddressesPage);

