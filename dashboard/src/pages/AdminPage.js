import Page from '../components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Alert, Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,ButtonGroup,
    UncontrolledAlert
} from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import * as queryString from "query-string";
import { history } from "App.js";
import { getListAdmin, getDeleteAdmin } from '../store/actions/admins'
class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.getListAdmin(1,10);
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
        this.props.getDeleteAdmin(id);
        this.toggle();
        history.push('/admins');

    };
    handlePageClick(data){
        this.props.getListAdmin(parseInt(data.selected)+1,10);
    }
    render() {
        let alert = null;
        let errMsg;
        if(this.props.error && this.props.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.props.error.errorMsg}
            </UncontrolledAlert>
        }
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
            data = this.props.list.map((admin, i) => {

                return (<tr key={i}>
                    <th scope="row">{(parseInt(i)+1) + (parseInt(this.props.page)-1)*10 }</th>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.roles}</td>
                    <td>
                        <ButtonGroup className="mr-3 mb-3">
                            <Button color="info"><div className="button-detail"><Link to={"/admins/"+admin._id}>detail</Link></div></Button>
                            <Button color="danger" onClick={()=>{ this.setState({id:admin._id, title:admin.name});this.toggle()}}>Delete</Button>
                        </ButtonGroup>

                    </td>
                </tr>)
            })
        }
        return (
            <Page
                title="Admins"
                breadcrumbs={[{ name: 'jobs', active: true }]}
                className="TablePage"
            >
                <Link to={"/admins/create"}><Button color='success'>Tạo admin</Button></Link>
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
                            <CardHeader>Admins list</CardHeader>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Card body>
                                            <Table>
                                                <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Tên</th>
                                                    <th>Email</th>
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
        totalDocs: state.admins.list.totalDocs,
        limit: state.admins.list.limit,
        hasPrevPage: state.admins.list.hasPrevPage,
        hasNextPage: state.admins.list.hasNextPage,
        page: state.admins.list.page,
        totalPages: state.admins.list.totalPages,
        pagingCounter: state.admins.list.pagingCounter,
        prevPage: state.admins.list.prevPage,
        nextPage: state.admins.list.nextPage,
        list: state.admins.list.docs,
        error: state.common.requests.error
    }
}, {getListAdmin, getDeleteAdmin})(AdminPage);
