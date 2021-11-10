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
import { getOneProposal, approve, reject } from '../store/actions/proposals';

const approveSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    summary: Yup.string().required('Required'),
    milestones: Yup.string().required('Required'),
    team: Yup.string().required('Required'),
    twitter: Yup.string().required('Required'),
    website: Yup.string().required('Required'),
    // communityProof: Yup.string().required('Required'),
    fundingRequest:  Yup.number().required('Required'),
    github: Yup.string().required('Required'),
    neededQuorum: Yup.number().required('Required'),
    // start: Yup.number(),
});

const rejectSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    summary: Yup.string().required('Required'),
    milestones: Yup.string().required('Required'),
    team: Yup.string().required('Required'),
    twitter: Yup.string().required('Required'),
    website: Yup.string().required('Required'),
    communityProof: Yup.string().required('Required'),
    fundingRequest:  Yup.number().required('Required'),
    github: Yup.string().required('Required'),
    reason: Yup.string().required('Required'),
    neededQuorum: Yup.number(),
    start: Yup.number(),
});

class ProposalsDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            detail: null
        }
    }

    requestProposal = () => {
        this.props.getOneProposal(this.props.match.params.id).then((data) => {
            console.log(data)
            this.setState({
                detail: data.payload,
            })
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }

    componentDidMount() {
        this.requestProposal()
    }

    approve = async (id, values) => {
        delete values.rejected;
        this.props.approve(id, values).then((data) => {
            alert("You've approved the proposal " + id);
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }

    reject = async (id, reason) => {
        this.props.reject(id, reason).then((data) => {
            alert("You've rejected the proposal " + id);
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }

    render() {
        let errMsg;
        if(this.state.error && this.state.error.errorMsg){
            errMsg = <UncontrolledAlert color="danger">
                {this.state.error.errorMsg}
            </UncontrolledAlert>
        }
        return (
            <Page
                title="Proposal Detail"
                className="TablePage"
            >
                <Row className="justify-content-center">
                    <Col md={8} xl={5}>
                        <Card>
                            <CardBody>
                                {this.state.detail ?<Formik
                                    initialValues={
                                        {
                                            title: this.state.detail.title,
                                            summary: this.state.detail.summary,
                                            milestones: this.state.detail.milestones,
                                            team: this.state.detail.team,
                                            twitter: this.state.detail.twitter,
                                            github: this.state.detail.github,
                                            website: this.state.detail.website,
                                            telegram: this.state.detail.telegram,
                                            // communityProof: this.state.detail.communityProof,
                                            fundingRequest: this.state.detail.fundingRequest,
                                            neededQuorum: this.state.detail.neededQuorum,
                                            reason: this.state.detail.reason,
                                            // start: this.state.detail.start,
                                        }
                                    }
                                    validationSchema={approveSchema }
                                    onSubmit={async values => {
                                        if (values.rejected) {
                                            this.reject(this.props.match.params.id, values.reason);
                                        } else {
                                            this.approve(this.props.match.params.id, values);
                                        }
                                        // history.push('/proposals/'+this.state.match.params.id+'?success=true');
                                    }}
                                >
                                    {({ errors, touched, values, handleChange,handleBlur, setFieldValue }) => (
                                        <Form>
                                            {errMsg}
                                            <FormGroup>
                                                <Label for="title">Title</Label>
                                                <Input
                                                    type="text"
                                                    name="title"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "title",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Proposal title"
                                                    value={values.title}
                                                />
                                                {errors.title && touched.title ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.title}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="summary">Summary</Label>
                                                <Input
                                                    type="textarea"
                                                    name="summary"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder=""
                                                    value={values.summary}
                                                />
                                                {errors.summary && touched.summary ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.summary}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="milestones">milestones</Label>
                                                <Input
                                                    type="textarea"
                                                    name="milestones"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder=""
                                                    value={values.milestones}
                                                />
                                                {errors.milestones && touched.milestones ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.milestones}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="team">team</Label>
                                                <Input
                                                    type="textarea"
                                                    name="team"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder=""
                                                    value={values.team}
                                                />
                                                {errors.team && touched.team ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.team}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>

                                            {/* <FormGroup>
                                                <Label for="communityProof">communityProof</Label>
                                                <Input
                                                    type="textarea"
                                                    name="communityProof"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder=""
                                                    value={values.communityProof}
                                                />
                                                {errors.communityProof && touched.communityProof ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.communityProof}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup> */}
                                            
                                            <FormGroup>
                                                <Label for="website">website</Label>
                                                <Input
                                                    type="text"
                                                    name="website"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "website",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Proposal website"
                                                    value={values.website}
                                                />
                                                {errors.website && touched.website ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.website}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="github">github</Label>
                                                <Input
                                                    type="text"
                                                    name="github"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "github",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Proposal github"
                                                    value={values.github}
                                                />
                                                {errors.github && touched.github ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.github}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            
                                            <FormGroup>
                                                <Label for="twitter">twitter</Label>
                                                <Input
                                                    type="text"
                                                    name="twitter"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "twitter",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Proposal twitter"
                                                    value={values.twitter}
                                                />
                                                {errors.twitter && touched.twitter ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.twitter}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>
                                            
                                            <FormGroup>
                                                <Label for="telegram">telegram</Label>
                                                <Input
                                                    type="text"
                                                    name="telegram"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "telegram",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Proposal telegram"
                                                    value={values.telegram}
                                                />
                                                {errors.telegram && touched.telegram ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.telegram}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="fundingRequest">fundingRequest</Label>
                                                <Input
                                                    type="number"
                                                    name="fundingRequest"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "fundingRequest",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Proposal fundingRequest"
                                                    value={values.fundingRequest}
                                                />
                                                {errors.fundingRequest && touched.fundingRequest ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.fundingRequest}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="neededQuorum">neededQuorum</Label>
                                                <Input
                                                    type="number"
                                                    name="neededQuorum"
                                                    onChange={evt => {
                                                        let value = evt.target.value;
                                                        if(value){
                                                            value = value.toLowerCase();
                                                        }
                                                        setFieldValue(
                                                            "neededQuorum",
                                                            value
                                                        )
                                                    }
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Proposal neededQuorum"
                                                    value={values.neededQuorum}
                                                />
                                                {errors.neededQuorum && touched.neededQuorum ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.neededQuorum}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="reason">reason</Label>
                                                <Input
                                                    type="textarea"
                                                    name="reason"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder=""
                                                    value={values.reason}
                                                />
                                                {errors.reason && touched.reason ? (
                                                    <UncontrolledAlert color="danger">
                                                        {errors.reason}
                                                    </UncontrolledAlert>
                                                ) : null}
                                            </FormGroup>

                                            <Button color="success" type='submit' onClick={() => {values.rejected = false}}>Approve</Button>
                                            <Button color="danger" type='submit' onClick={() => {values.rejected = true}} style={{marginLeft: "10px"}}>Reject</Button>
                                        </Form>
                                    )}

                                </Formik> : ""}
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
}, {getOneProposal, approve, reject})(ProposalsDetailPage);