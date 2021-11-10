'use strict';

module.exports = {
    getList: (request) => {
        return request.pre.proposals;
    },
    getOne: (request) => {
        return request.pre.proposal;
    },
    approve: (request) => {
        return request.pre.output;
    },
    reject: (request) => {
        return request.pre.output;
    }
};
