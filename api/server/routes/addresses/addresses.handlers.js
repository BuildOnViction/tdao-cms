'use strict';

module.exports = {
   
    getList: (request) => {
        return request.pre.Address;
    },
    scanBalance: (request) => {
        return request.pre.data;
    },
    transferBalance: (request) => {
        return request.pre.data;
    },
};
