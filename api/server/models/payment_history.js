'use strict';
const Assert = require('assert');
const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const NewDate = require('joistick/new-date');
const MongoModels = require('mongo-models');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const paymentHistorySchema = new Schema({
        order_id: {type: String},
        amount: {type: Number},
        broker_id: {type: String},
        isSuccess: {type: Boolean},
        user_request: {
            amount: {type: Number},
            clientIp: {type: String},
            locale: {type: String},
            billingCity: {type: String},
            billingPostCode: {type: String},
            billingStateProvince: {type: String},
            billingStreet: {type: String},
            billingCountry: {type: String},
            deliveryAddress: {type: String},
            deliveryCity: {type: String},
            deliveryCountry: {type: String},
            currency: {type: String},
            deliveryProvince: {type: String},
            customerEmail: {type: String},
            customerPhone: {type: String},
            orderId: {type: String},
            // returnUrl: ,
            transactionId: {type: String}, // same as orderId (we don't have retry mechanism)
            customerId: {type: String},
        },
        onepay_response: {
            command: {type: String},
            currencyCode: {type: String},
            locale: {type: String},
            merchant: {type: String},
            message: {type: String},
            gatewayTransactionNo: {type: String},
            orderId: {type: String},
            responseCode: {type: String},
            secureHash: {type: String},
            transactionId: {type: String},
            version: {type: String},
        }
    },
    {
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);

paymentHistorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('payments_history', paymentHistorySchema);
