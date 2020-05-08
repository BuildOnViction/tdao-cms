const JobTypes = require('../models/job_type');
var Config = require('../config');
module.exports = (server, options) => [
    {
        name: 'jobTypes.getList',
        method: jobTypelist
    },
]

const jobTypelist = async function (request, h) {
    return JobTypes.find({})
}