import Page from '../components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Alert, Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,ButtonGroup,
    UncontrolledAlert
} from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import { Link } from "react-router-dom";
import * as queryString from "query-string";
import { history } from "App.js";
import {getListBrokerPaginate, deleteBroker} from '../store/actions/broker';
import ReactPaginate from "react-paginate";
class BrokerPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.getListBrokerPaginate();
    }
    state = {
        modal: false,
        id: null,
        title: null
    };

    toggle = () => {
        return this.setState({
            modal: !this.state.modal,
        });

    };
    delete = (id)=>{
        this.props.deleteBroker(id);
        this.toggle();
        history.push('/brokers');

    };
    handlePageClick(data){
        this.props.getListBrokerPaginate(parseInt(data.selected)+1,10);
    }
    render() {
        let alert = null;
        if(this.props.location.search){
            let parsed = queryString.parse(this.props.location.search);

            if(parsed.success){
                alert = <Alert color="success">
                    Tạo thành công
                </Alert>;
            }
        }
        let errMsg;
        if(this.props.error && this.props.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.props.error.errorMsg}
            </UncontrolledAlert>
        }
        let data;
        if (this.props.list) {
            data = this.props.list.map((broker, i) => {

                return (<tr key={i}>
                    <th scope="row">{parseInt(i)+1 }</th>
                    <td>{broker.username}</td>
                    <td>{broker.email}</td>
                    <td>{broker.phone}</td>
                    <td>{Object.keys(broker.roles)}</td>

                    <td>
                        <ButtonGroup className="mr-3 mb-3">
                            <Button color="info"><div className="button-detail"><Link to={"/brokers/"+broker._id}>detail</Link></div></Button>
                            <Button color="danger" onClick={()=>{ this.setState({id:broker._id, title:broker.username});this.toggle()}}>Delete</Button>
                        </ButtonGroup>

                    </td>
                </tr>)
            })
        }
        return (
            <Page
                title="Broker"
                breadcrumbs={[{ name: 'broker', active: true }]}
                className="TablePage"
            >
                <Link to={"/brokers/create"}><Button color='success'>Tạo người môi giới</Button></Link>
                {alert}
                {errMsg}
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
                            <CardHeader></CardHeader>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Card body>
                                            <Table>
                                                <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Điện thoại</th>
                                                    <th>Quyền</th>
                                                    <th>Hành động</th>
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
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick.bind(this)}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </Page>
        );
    }
}

export default connect((state) => {
    return {
        totalDocs: state.brokers.list_broker.totalDocs,
        limit: state.brokers.list_broker.limit,
        hasPrevPage: state.brokers.list_broker.hasPrevPage,
        hasNextPage: state.brokers.list_broker.hasNextPage,
        page: state.brokers.list_broker.page,
        totalPages: state.brokers.list_broker.totalPages,
        pagingCounter: state.brokers.list_broker.pagingCounter,
        prevPage: state.brokers.list_broker.prevPage,
        nextPage: state.brokers.list_broker.nextPage,
        list: state.brokers.list_broker.docs,
        error: state.common.requests.error,
    }
}, {getListBrokerPaginate,deleteBroker})(BrokerPage);