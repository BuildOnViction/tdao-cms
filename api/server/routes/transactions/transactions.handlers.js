'use strict';

module.exports = {
    getList: (request) => {
        return request.pre.transactions;
    }
};
