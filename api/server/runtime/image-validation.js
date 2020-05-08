const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
module.exports = Joi.object({
    public_id: Joi.string().regex(/([a-z0-9]){20}/g).required(),
    version: Joi.number().required(),
    signature: Joi.string().required(),
    resource_type: Joi.string().required(),
    created_at: Joi.date().required(),
    bytes: Joi.number(),
    type: Joi.string(),
    tags: Joi.array(),
    etag: Joi.string().regex(/([a-z0-9]){32}/g).required(),
    placeholder: Joi.boolean(),
    url: Joi.string().regex(/http:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).required(),
    secure_url: Joi.string().regex(/https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).required(),
    original_filename: Joi.string().required()
})