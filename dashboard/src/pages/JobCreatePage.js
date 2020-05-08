import Page from '../components/Page';
import React from 'react';
import {history} from "App.js";
import {
    Card, Col, Row,
    Button,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Label,
    UncontrolledAlert
} from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import {Formik, Form} from 'formik';
import * as Yup from 'yup';
// Require Font Awesome.
// import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';
import {getJobTypes} from '../store/actions/jobTypes';
import {getListJobTypesState} from "../store/selectors/jobTypes";
import {getListBroker} from "../store/actions/broker";
import {getListBrokerState} from "../store/selectors/broker";
import {getCreateJobs} from "../store/actions/jobs";

const createSchema = Yup.object().shape({
    title: Yup.string()
        .required('Mời nhập tiêu đề'),
    cv_location: Yup.string()
        .required('Mời nhập nơi nhận cv'),
    country: Yup.string()
        .required('Mời nhập quốc gia khởi nghiệp'),
    deadline: Yup.date('Ngày hết hạn phải là ngày').min(new Date(),'Ngày hết hạn nhỏ hơn bây giờ'),
    amount: Yup.number('Số lượng là số'),
    broker: Yup.string().required('Mời chọn broker')


});

class JobsCreatePage extends React.Component {

    constructor(props) {
        super(props);
        this.props.getJobTypes();
        this.props.getListBroker();
        this.state = {
            description: "",
            required_condition: "",
            benefit: "",
        };
    }


    handleDescriptionChange = (model) => {
        this.setState({
            description: model
        });
    }
    handleBenefitChange = (model) => {
        this.setState({
            benefit: model
        });
    }
    handleRequireConditionChange = (model) => {
        this.setState({
            required_condition: model
        });
    }

    render() {
        let errMsg;
        if(this.props.error && this.props.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.props.error.errorMsg}
            </UncontrolledAlert>
        }
        return (
            <Page
                title="Jobs Create"
                breadcrumbs={[{name: 'jobs', active: true}]}
                className="TablePage"
            >
                <Row>
                    <Col xl={12} lg={12} md={12}>
                        <Card>
                            <CardHeader>Input Types</CardHeader>
                            <CardBody>
                                <Formik
                                    initialValues={
                                        {
                                            amount: 0,
                                            salary:"0-0",
                                            country: "jp",
                                            cv_location: "Hà Nội",
                                            jobTypes: [],
                                            title: "",
                                            required_experience: false,
                                            deadline: '',
                                            gender: "male",
                                            status: "draft",
                                            broker: "",
                                        }
                                    }
                                    validationSchema={createSchema}
                                    onSubmit={async values => {
                                        let data = {};
                                        data = Object.assign(data, {amount: values.amount});
                                        data = Object.assign(data, {benefit: this.state.benefit});
                                        data = Object.assign(data, {broker_id: values.broker});
                                        data = Object.assign(data, {country: values.country});
                                        data = Object.assign(data, {cv_location: values.cv_location});
                                        data = Object.assign(data, {job_type: values.jobTypes});
                                        data = Object.assign(data, {
                                            salary: {
                                                from: values.salary.split('-')[0],
                                                to: values.salary.split('-')[1]
                                            }
                                        });
                                        data = Object.assign(data, {title: values.title});
                                        data = Object.assign(data, {required_experience: values.required_experience});
                                        data = Object.assign(data, {required_condition: this.state.required_condition});
                                        data = Object.assign(data, {description: this.state.description});
                                        data = Object.assign(data, {deadline: values.deadline});
                                        data = Object.assign(data, {gender: values.gender});
                                        data = Object.assign(data, {status: values.status});
                                        await this.props.getCreateJobs(data);
                                        history.push('/jobs/?success=true');

                                    }}
                                >
                                    {({errors, touched, values, handleChange, handleBlur, setFieldValue}) => (
                                        <Form>
                                            {errMsg}
                                            <FormGroup>
                                                <Label for="title">Tiêu đề</Label>
                                                <Input
                                                    type="text"
                                                    name="title"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Tiêu đề của công việc"
                                                    value={values.title}
                                                />

                                                {errors.title && touched.title ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.title}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleText">Mô tả</Label>
                                                <FroalaEditor
                                                    model={this.state.description}
                                                    onModelChange={this.handleDescriptionChange}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="country">Nước tuyển dụng</Label>
                                                <Input
                                                    type="select"
                                                    name="country"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.country}
                                                >
                                                <option value="jp">Nhật Bản</option>
                                                <option value="kr">Hàn quốc</option>
                                                </Input>

                                                {errors.country && touched.country ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.country}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="cv_location">Nơi nhận hồ sơ</Label>
                                                <Input
                                                    type="text"
                                                    name="cv_location"
                                                    value={values.cv_location}
                                                />
                                                {errors.cv_location && touched.cv_location ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.cv_location}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="required_condition">Điều kiện tuyển dụng</Label>
                                                <FroalaEditor
                                                    model={this.state.required_condition}
                                                    onModelChange={this.handleRequireConditionChange}
                                                />
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label for="checkbox2" sm={2}>
                                                    Kinh nghiệm
                                                </Label>
                                                <Col sm={{size: 10}}>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="checkbox" name='required_experience'
                                                                   onChange={handleChange}
                                                                   onBlur={handleBlur}
                                                                   value={values.required_experience}

                                                            /> Kinh nghiệm
                                                        </Label>
                                                    </FormGroup>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="benefit">Quyền lợi</Label>
                                                <FroalaEditor
                                                    model={this.state.benefit}
                                                    onModelChange={this.handleBenefitChange}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="deadline">Ngày hết hạn</Label>
                                                <Input
                                                    type="text"
                                                    name="deadline"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.deadline}
                                                />
                                                {errors.deadline && touched.deadline ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.deadline}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleColor">Số lượng</Label>
                                                <Input
                                                    type="number"
                                                    name="amount"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.amount}
                                                />
                                                {errors.amount && touched.amount ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.amount}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="salary">Lương</Label>
                                                <Input
                                                    type="select"
                                                    name="salary"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.salary}
                                                >   <option value="0-0">Tất cả mức lương</option>
                                                    <option value="7-10">7 - 10 triệu</option>
                                                    <option value="10-15">10 - 15 triệu</option>
                                                    <option value="15-20" selected="">15 - 20 triệu</option>
                                                    <option value="20-30">20 - 30 triệu</option>
                                                    <option value="30-40">30 - 40 triệu</option>
                                                    <option value="40-60">40 - 60 triệu</option>
                                                    <option value="60-80">60 - 80 triệu</option>
                                                    <option value="80-0">&gt;80 triệu</option>
                                                </Input>
                                            </FormGroup>
                                            {errors.salary && touched.salary ? (
                                                <UncontrolledAlert color="danger">
                                                    {errors.salary}
                                                </UncontrolledAlert>
                                            ) : null}
                                            <FormGroup>
                                                <Label for="jobTypes">Loại Ngành nghề</Label>
                                                <br></br>
                                                {this.props.job_type}
                                                <br></br>
                                                <Input name="jobTypes"
                                                       onChange={evt =>
                                                           setFieldValue(
                                                               "jobTypes",
                                                               [].slice
                                                                   .call(evt.target.selectedOptions)
                                                                   .map(option => JSON.parse(option.value))
                                                           )
                                                       }
                                                       type='select'
                                                       onBlur={handleBlur}
                                                       multiple>
                                                    {
                                                        this.props.listjobType ? this.props.listjobType.map((jobtype, index) => {
                                                            return <option value={JSON.stringify({
                                                                id: jobtype._id,
                                                                name: jobtype.name
                                                            })} key={index}> {jobtype.name} </option>
                                                        }) : null
                                                    }
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="gender">Giới tính</Label>
                                                <Input type="select" name="gender"
                                                       onChange={handleChange}
                                                       onBlur={handleBlur}
                                                       value={values.gender}
                                                >
                                                    <option value='male'>Male</option>
                                                    <option value='female'>Female</option>
                                                    <option value='unset'>Unset</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="gender">Trạng thái</Label>
                                                <Input type="select" name="status"
                                                       onChange={handleChange}
                                                       onBlur={handleBlur}
                                                       value={values.status}
                                                >
                                                    <option value='draft'>Draft</option>
                                                    <option value='active'>Active</option>
                                                    <option value='inactive'>Inactive</option>
                                                    <option value='publish'>Public</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="broker">Người đăng tin</Label>
                                                <Input type="select"
                                                       name="broker"
                                                       onChange={handleChange}
                                                       onBlur={handleBlur}
                                                       value={values.broker}
                                                >
                                                    <option value=''>Chon mooi gioi</option>
                                                    {
                                                        this.props.listBroker.length > 0 ? this.props.listBroker.map((broker, index) => {
                                                            return <option value={broker.roles.broker.id.toString()}
                                                                           key={index}> {broker.roles.broker.name} </option>
                                                        }) : ''
                                                    }
                                                </Input>
                                                {errors.broker && touched.broker ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.broker}
                                                    </UncontrolledAlert>
                                                ) : null}

                                            </FormGroup>
                                            <Button color="success" type='submit'>Gửi</Button>

                                        </Form>
                                    )}

                                </Formik>
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
            </Page>
        );
    }
}

export default connect((state) => {
    return {
        listjobType: getListJobTypesState(state),
        listBroker: getListBrokerState(state),
        error: state.common.requests.error,

    }
}, {getJobTypes, getListBroker, getCreateJobs})(JobsCreatePage);
