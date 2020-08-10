'use strict';

module.exports = {
    getList: (request) => {
        return request.pre.transactions;
    },
    rescan: (request) => {
        return request.pre.output;
    }
};
