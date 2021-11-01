var Config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
const { strict } = require('joi');
var ObjectId = require('mongodb').ObjectId;
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(Config.mysql.uri)

class Proposal extends Model {}
Proposal.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    author: DataTypes.STRING,
    created:DataTypes.DATE,
    space: DataTypes.STRING,
    summary: DataTypes.TEXT,
    network: DataTypes.NUMBER,
    type: DataTypes.STRING,
    strategies: DataTypes.JSON,
    plugins: DataTypes.JSON,
    title: DataTypes.STRING(100),
    description: DataTypes.TEXT(1000),
    team: DataTypes.TEXT(1000),
    website: DataTypes.STRING(100),
    twitter: DataTypes.STRING(100),
    github: DataTypes.STRING(100),
    milestones: DataTypes.TEXT(1000),
    category: DataTypes.STRING(50),
    status: DataTypes.STRING(64),
    tag: DataTypes.STRING(50),
    fundingRequest: DataTypes.INTEGER,
    externalFunding: DataTypes.BOOLEAN,
    choices: DataTypes.JSON,
    start: DataTypes.TIME,
    end: DataTypes.TIME,
    snapshot: DataTypes.NUMBER,
    quorum: DataTypes.NUMBER,
    neededQuorum: DataTypes.NUMBER,
    approvedBy: DataTypes.JSON,
}, {
    sequelize,
    modelName: 'proposals',
    timestamps: false
});

module.exports = (server, options) => [
    {
        name: 'proposals.getList',
        method: getProposals
    },
    {
        name: 'proposals.approve',
        method: approveProposal
    },
]

const getProposals = async function (request, h) {
    let lm = request.query.limit || 50;
    let page = request.query.page || 1;

    const proposals = await Proposal.findAndCountAll({
        limit: lm,
        offset: (page-1)*lm,
        where: {
            status: "PENDING"
        },
        order: [
          ['created', 'DESC']
        ],
    
    });
    return proposals;
}


const approveProposal = async function (request, h) {
    let id = request.params.id;
    const result = await Proposal.update({
        status: 'APPROVED',
        quorum: request.query.quorum
    },{
        where: { id: id }
    });
    return result;
}

