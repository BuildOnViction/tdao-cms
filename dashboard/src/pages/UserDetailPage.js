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
import {getDetailUser} from "../store/actions/users";

class JobsDetailPage extends React.Component {

    constructor(props) {
        super(props);
        if(this.props.match.params.id){
            this.props.getDetailUser(this.props.match.params.id);
        }
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
        let detail;
        if(this.props.detail && this.props.detail.roles){
           let roles =  Object.keys(this.props.detail.roles);
           if(roles[0] === 'labor'){
               detail=<div>
                   <CardText>
                       <b>TÊN:</b> {this.props.detail.users.name}
                   </CardText>
                   <CardText>
                       <b>TỪ:</b> {this.props.detail.users.from}
                   </CardText>
                   <CardText>
                       <b>CMND:</b> {this.props.detail.users.id_number}
                   </CardText>
                   <CardText>
                       <b>CMND:</b> {this.props.detail.users.id_image}
                   </CardText>
               </div>
           }else if (roles[0] === 'broker'){
               detail=<div>
                   <CardText>
                       <b>TÊN:</b> {this.props.detail.users.name}
                   </CardText>
                   <CardText>
                       <b>CÔNG TY:</b> {this.props.detail.users&&this.props.detail.company&&this.props.detail.company.name?this.props.detail.users.company.name:null}
                   </CardText>
                   <CardText>
                       <b>SỐ DƯ TÀI KHOẢN:</b> {this.props.detail.users.balance}
                   </CardText>
               </div>
           }
        };
        return (
            <Page title="Job detail" breadcrumbs={[{ name: 'job detail', active: true }]}>
                <Col md="12" sm="12" xs="12">
                    {alert}
                    {errMsg}
                    <Card>

                    </Card>
                </Col>
                <CardBody>
                    <Link to={'/jobs/edit/'+this.props.detail._id} ><Button color="primary">Edit</Button></Link>
                </CardBody>
                <Row>
                    <Col md={12} sm={12} xs={12} className="mb-12">
                        <Card className="flex-row">
                            <CardBody>
                                <CardTitle><b>{this.props.detail.username}</b></CardTitle>
                                <CardText>
                                    <b>Điện thoại:</b> {this.props.detail.phone}
                                </CardText>
                                <CardText>
                                    <b>EMAIL:</b> {this.props.detail.email}
                                </CardText>
                                {detail}
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
        detail: state.users.detail,
        error: state.common.requests.error,
    }
}, {getDetailUser})(JobsDetailPage);
