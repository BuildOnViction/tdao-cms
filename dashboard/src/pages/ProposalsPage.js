import Page from '../components/Page';
import React from 'react';
import { Card, CardBody, Col, Row, Table, Button, ButtonGroup } from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import XLSX from 'xlsx';
import ReactPaginate from 'react-paginate';
import { listProposals, approve } from '../store/actions/proposals';
import { Link } from "react-router-dom";

class ProposalsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    export = () => {
        let proposals = this.state.data
        var filename = "proposals.xlsx";
        var data = [
            ['Time', 'Token', 'InTx', 'OutTx', 'Receiver', 'Amount'],
        ];

        proposals.forEach(transaction => {
            let time = new Date(transaction.CreatedAt * 1000)
            data.push([
                time.toString(),
                transaction.InTx.CoinType,
                transaction.InTx.Hash,
                transaction.OutTx.Hash,
                transaction.OutTx.To,
                transaction.InTx.Amount
            ])
        });

        var ws_name = "Proposals";
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb, filename);
    }

    state = {
        page: 1,
        limit: 30,
        coin_type: "ALL",
        hash: "",
        from_address: "",
        data: [],
        approve: {}
    };

    requestProposals = () => {
        this.props.listProposals(this.state.page, this.state.limit).then((data) => {
            console.log(data)
            this.setState({
                data: data.payload.rows,
                totalPage: Math.ceil(data.payload.count/this.state.limit)
            })
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    }
    componentDidMount() {
        this.requestProposals()
    }

    handlePageClick = (data) => {
        this.setState({
            page: parseInt(data.selected) + 1
        }, () => {
            this.requestProposals();
        });

    }

    search = (e) => {
        this.setState({ hash: e.target.value });
        this.requestProposals()
    };

    filterProposals = async () => {
        this.requestProposals()
    }

    onChangeFilterProperties = async (type, data) => {
        this.state[type] = data
        await this.setState(this.state)
    }

    onChangeRescanProperties = async (type, data) => {
        let approve = this.state.approve
        approve[type] = data
        await this.setState({
            approve
        })
    }

    approve = async (id) => {
        let quorum = prompt("Please decide the quorum for this proposal ")
        if (quorum = parseInt(quorum)) {
            this.props.approve(id, quorum).then((data) => {
                alert("You've approved the proposal " + id);
                this.requestProposals()
            }).catch((err) => {
                alert(JSON.stringify(err))
            })
        }
    }

    render() {
        let data;

        if (this.state.data) {
            data = this.state.data.map((proposal, i) => {
                return (<tr key={i}>
                    <td><a href={proposal.title} title={proposal.title}>{proposal.title}</a></td>
                    <td><a href={proposal.status} className={"btn-theme proposal_" + proposal.status}>{proposal.status}</a></td>
                    <td><a href={proposal.summary} title={proposal.summary}>{proposal.summary}</a></td>
                    {/* <td><a href={proposal.milestones} title={proposal.milestones}>{proposal.milestones}</a></td> */}
                    <td><a href={proposal.website} title={proposal.website}>{proposal.website}</a></td>
                    <td><a href={proposal.github} title={proposal.github}>{proposal.github}</a></td>
                    <td><a href={proposal.twitter} title={proposal.twitter}>{proposal.twitter}</a></td>
                    <td>{new Date(proposal.start*1000).toString()}</td>
                    {/* <td>{new Date(proposal.end*1000).toString()}</td> */}
                    <td>{proposal.fundingRequest} $</td>
                    <td>
                        <div className="text-center">
                            <Link className="link-detail" to={"/proposals/"+proposal.id}>Detail</Link>
                            <br />
                            {/* <Button className="btn-t1-medium" color="danger" onClick={()=>{ this.approve(proposal.id);}}>Approve</Button> */}
                        </div>
                    </td>
                </tr>)
            })
        }
        return (
            <Page
                title="Proposals"
                breadcrumbs={[{ name: 'proposals', active: true }]}
                className="style-table"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Card body>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Status</th>
                                                        <th>Summary</th>
                                                        <th>Website</th>
                                                        <th>Github</th>
                                                        <th>Twitter</th>
                                                        <th>Start Date</th>
                                                        <th style={{width: '120px'}} title="Request funding">RF</th>
                                                        <th style={{width: '100px'}}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data}
                                                </tbody>
                                            </Table>
                                            {this.state.totalPage > 0 ?
                                                <ReactPaginate
                                                    previousLabel={'previous'}
                                                    nextLabel={'next'}
                                                    breakLabel={'...'}
                                                    pageCount={this.state.totalPage}
                                                    breakClassName={'break-me'}
                                                    onPageChange={this.handlePageClick}
                                                    containerClassName={'pagination'}
                                                    subContainerClassName={'pages pagination'}
                                                    activeClassName={'active'}
                                                /> : <div>No pending proposals found</div>
                                            }
                                            
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

export default connect(null, { listProposals, approve })(ProposalsPage);

