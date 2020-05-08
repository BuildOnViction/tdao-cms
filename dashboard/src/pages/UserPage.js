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
import { history } from "App.js";
import {getListUser,getDeleteUser, getDisableUser} from '../store/actions/users';

class UserPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.getListUser('',1,10);
        this.timeout =  0;
    }
    state = {
        modal: false,
        id: null,
        title: null,
        search: ''
    };

    toggle = () => {
        return this.setState({
            modal: !this.state.modal,
        });

    };
    delete = (id)=>{
        this.props.getDeleteUser(id);
        this.toggle();
        history.push('/users');

    };
    handlePageClick(data){
        this.props.getListUser(this.state.search,parseInt(data.selected)+1,10);
    }
    search = (e) => {
        this.setState({search:e.target.value});
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.props.getListUser(this.state.search,1,10);
        }, 1000);


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
        if (this.props.list) {
            data = this.props.list.map((user, i) => {
                let disableBtn;
                if (user.isActive === true){
                    disableBtn = <Button color="primary" onClick={()=>{this.props.getDisableUser(user._id)}}>Disable</Button>
                }
                return (<tr key={i}>
                    <th scope="row">{(parseInt(i)+1) + (parseInt(this.props.page)-1)*10 }</th>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>
                        <ButtonGroup className="mr-3 mb-3">
                            <Button color="info"><div className="button-detail"><Link to={"/users/"+user._id}>detail</Link></div></Button>
                            <Button color="danger" onClick={()=>{ this.setState({id:user._id, title:user.username});this.toggle()}}>Delete</Button>
                            {disableBtn}
                        </ButtonGroup>

                    </td>
                </tr>)
            })
        }
        return (
            <Page
                title="Users"
                breadcrumbs={[{ name: 'users', active: true }]}
                className="TablePage"
            >
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
                            <CardHeader>Job list</CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xl={7} lg={7} md={7}>
                                        <Input className="mb-2" type="Search" onChange={this.search} placeholder="search" bsSize="sm" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card body>
                                            <Table>
                                                <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Điện thoại</th>
                                                    <th>Email</th>
                                                    <th>Username</th>
                                                    <th>detail</th>
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
        totalDocs: state.users.list.totalDocs,
        limit: state.users.list.limit,
        hasPrevPage: state.users.list.hasPrevPage,
        hasNextPage: state.users.list.hasNextPage,
        page: state.users.list.page,
        totalPages: state.users.list.totalPages,
        pagingCounter: state.users.list.pagingCounter,
        prevPage: state.users.list.prevPage,
        nextPage: state.users.list.nextPage,
        list: state.users.list.docs,
        error: state.common.requests.error,

    }
}, {getListUser,getDeleteUser,getDisableUser})(UserPage);
