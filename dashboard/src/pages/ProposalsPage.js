import Page from '../components/Page';
import React from 'react';
import { Card, CardBody, Col, Row, Table, Button, ButtonGroup } from 'reactstrap';
import connect from "react-redux/es/connect/connect";
import XLSX from 'xlsx';
import ReactPaginate from 'react-paginate';
import { listProposals, approve } from '../store/actions/proposals';
// import { history } from "App.js";

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
                    <td>{proposal.title}</td>
                    <td>{proposal.descriptions}</td>
                    <td>{proposal.milestones}</td>
                    <td>{proposal.website}</td>
                    <td>{proposal.github}</td>
                    <td>{proposal.twitter}</td>
                    <td>{new Date(proposal.start*1000).toString()}</td>
                    <td>{new Date(proposal.end*1000).toString()}</td>
                    <td>{proposal.fundingRequest} $</td>
                    <td>
                        <Button color="info" onClick={() => this.approve(proposal.id)}><div className="button-detail">
                            Approve
                        </div></Button>
                    </td>
                </tr>)
            })
        }
        return (
            <Page
                title="Pending Proposal"
                breadcrumbs={[{ name: 'proposals', active: true }]}
                className=""
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Card body>
                                            <Table style={{ fontSize: "0.6vw" }}>
                                                <thead>
                                                    <tr>
                                                        <th> Title </th>
                                                        <th> Description </th>
                                                        <th> Milestones </th>
                                                        <th> Website </th>
                                                        <th >Github</th>
                                                        <th >Twitter</th>
                                                        <th >Start Date</th>
                                                        <th >End Date</th>
                                                        <th >Request funding</th>
                                                        <td>
                                                            
                                                        </td>
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

