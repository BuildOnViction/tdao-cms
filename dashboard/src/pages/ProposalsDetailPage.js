import Page from '../components/Page';
import React from 'react';
import { history } from "App.js";
import { Card, Col, Row,
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
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

const createSchema = Yup.object().shape({
    name: Yup.string()
        .required('Mời tên'),
    email: Yup.string()
        .email('Email sai định dạng'),
    password: Yup.string()
        .min(6,'Password nhỏ nhất là 6 ký tự')
        .max(32, 'Password lớn nhất là 32 ký tự')
        .nullable(),
    phone: Yup.string()
        .matches(/^([0-9])\d{9,11}$/,{
            message: 'Điên thoại sai định dạng'
        }).required('Mời nhập số điện thoại'),
    introduce: Yup.string().nullable(),
    dob: Yup.date('Ngày sinh nhật phải là ngày').nullable(),
    repassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password không khớp')

});
class ProposalsDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            detail: {}
        }
    }

    render() {
        let options = []
      
        let errMsg;
        if(this.state.error && this.state.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.state.error.errorMsg}
            </UncontrolledAlert>
        }
        return (
            <Page
                title="Tạo người môi giới"
                breadcrumbs={[{ name: 'proposals', active: true }]}
                className="TablePage"
            >
                <Row>
                    <Col xl={12} lg={12} md={12}>
                        <Card>
                            <CardHeader>Tạo người môi giới</CardHeader>
                            <CardBody>
                                <Formik
                                    initialValues={
                                        {
                                            name: this.state.detail.name,
                                            email: this.state.detail.email,
                                            password: "",
                                            phone: this.state.detail.phone,
                                            introduce: this.state.detail.introduce,
                                        }
                                    }
                                    validationSchema={createSchema }
                                    onSubmit={async values => {
                                        console.log(values);
                                        history.push('/proposals/'+this.state.match.params.id+'?success=true');
                                    }}
                                >
                                    {({ errors, touched, values, handleChange,handleBlur, setFieldValue }) => (
                                        <Form>
                                            {errMsg}
                                            <FormGroup>
                                                <Label for="name">Tên</Label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "name",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Tên người môi giới"
                                                    value={values.name}
                                                />
                                                {errors.name && touched.name ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.name}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="name">Điện thoại</Label>
                                                <Input
                                                    type="text"
                                                    name="phone"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Điện thoại môi giới"
                                                    value={values.phone}
                                                />
                                                {errors.phone && touched.phone ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.phone}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="email">Email</Label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "email",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Email Người môi giới"
                                                    value={values.email}
                                                />
                                                {errors.email && touched.email ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.email}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="password">Password</Label>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Mật khẩu"
                                                    value={values.password}
                                                />
                                                {errors.password && touched.password ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.password}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="repassword">Nhập lại password</Label>
                                                <Input
                                                    type="password"
                                                    name="repassword"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Mật khẩu"
                                                    value={values.repassword}
                                                />
                                                {errors.repassword && touched.reassword ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.repassword}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="introduce">Giới thiệu</Label>
                                                <Input
                                                    type="textarea"
                                                    name="introduce"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder=""
                                                    value={values.introduce}
                                                />
                                                {errors.introduce && touched.introduce ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.introduce}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="company">Công ty</Label>
                                                <br></br>
                                                {this.state.detail&&this.state.detail.broker&&this.state.detail.broker.company?this.state.detail.broker.company.name:null}
                                                <br></br>
                                                <Select
                                                    name="company"
                                                    value={values.company}
                                                    onChange={(value) => {
                                                        if(value){
                                                            value = JSON.parse(value.value);
                                                        }
                                                        setFieldValue(
                                                            "company",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    options={options}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="dob">Ngày sinh</Label>
                                                <Input type="text" name="dob"
                                                       onChange={handleChange}
                                                       onBlur={handleBlur}
                                                       value={values.dob}
                                                >
                                                </Input>
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
    return  {
        detail: [],
        error: null,
    }
}, {})(ProposalsDetailPage);