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
import { putEditAdmin } from '../store/actions/admins';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// Require Font Awesome.
// import 'font-awesome/css/font-awesome.css';


const editSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name'),
    email: Yup.string()
        .required('Email')
        .email('Mailform'),
    password: Yup.string()
        .min(6,'Password length is from 6-32')
        .max(32, 'Password length is from 6-32')
        .nullable(),
    repassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password not match')

});
class AdminEditPage extends React.Component {

    render() {
        let errMsg;
        if(this.props.error && this.props.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.props.error.errorMsg}
            </UncontrolledAlert>
        }
        if(this.props.detail){
            return (
                <Page
                    title="Admins Edit"
                    breadcrumbs={[{ name: 'admins edit', active: true }]}
                    className="TablePage"
                >
                    <Row>
                        <Col xl={12} lg={12} md={12}>
                            <Card>
                                <CardHeader>Input Types</CardHeader>
                                <CardBody>
                                    <Formik
                                        initialValues={
                                            {...this.props.detail,
                                                password:'',
                                                repassword: ''

                                                }
                                        }
                                        validationSchema={editSchema}
                                        onSubmit={async values => {
                                            let data ={name:values.name,email:values.email,roles: values.roles};
                                            if(values.password){
                                               data = Object.assign(data,{password:values.password})
                                            }
                                            await this.props.putEditAdmin(this.props.match.params.id, data);
                                            history.push('/admins/'+this.props.match.params.id+'?success=true');
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
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Tên admin"
                                                        value={values.name}
                                                    />
                                                    {errors.name && touched.name ? (
                                                        <UncontrolledAlert color="danger">
                                                            {errors.name}
                                                        </UncontrolledAlert>
                                                    ) : null}
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="email">Email</Label>
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Email admin"
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
                                                    <Label for="password">Nhập lại Password</Label>
                                                    <Input
                                                        type="password"
                                                        name="repassword"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Mật khẩu"
                                                        value={values.repassword}
                                                    />
                                                    {errors.repassword && touched.repassword ? (
                                                        <UncontrolledAlert color="danger">
                                                            {errors.repassword}
                                                        </UncontrolledAlert>
                                                    ) : null}
                                                </FormGroup>
                                                <FormGroup>
                                                        <Label for="roles">Trạng thái</Label>
                                                        <Input type="select" name="roles"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.roles}
                                                        >
                                                            <option value='editor'>Editor</option>
                                                            <option value='admin'>Admin</option>
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
}

export default connect((state) => {
    return  {
        detail: state.admins.detail,
        error: state.common.requests.error,

    }
}, {putEditAdmin})(AdminEditPage);
