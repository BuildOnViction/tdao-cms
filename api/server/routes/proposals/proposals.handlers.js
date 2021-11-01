'use strict';

module.exports = {
    getList: (request) => {
        return request.pre.proposals;
    },
    approve: (request) => {
        return request.pre.output;
    }
};
