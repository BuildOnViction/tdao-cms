'use strict';

// const Models = require('../models');
const Token = require('../models/token');
const Admin = require('../models/admin');
const _ = require('lodash');
const Jwt = require('jsonwebtoken');
const Config = require('../config');
const UAParser = require('ua-parser-js');
const Boom = require('boom');
var ObjectId = require('mongodb').ObjectId;

const getNeededUserAgentInfo = (userAgent) => {
    const ua = UAParser(userAgent);
    return (ua.browser.name || '') + (ua.device.type || '') + (ua.os.name || '');
};

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 401
 */

const isAuthenticated = async function (user_id) {
    // do your checks to see if the person is valid
    // use cache for fast checking purpose 
    const user = await Admin.findOne({
        _id: new ObjectId(user_id),
        },
    ).select('-password');
    if (!user) throw Boom.badRequest('Malform token');

    const _role = await user.roles;

    user.set('roles', undefined, {strict: false} );
    return {
        isValid: true,
        credentials: {
            scope: _role,
            user: {
                ...user,
                _role
            }
        }
    }
};

/**
 * Deprecated - no longer using
 * Checks if the user role meets the minimum requirements of the route
 */
const hasRole = (decoded, request, callback) => {

    isAuthenticated(decoded, request, (authenResult) => {

        callback(null, true);
    });
};
/**
 * Returns a jwt token signed by the app secret
 */
const signToken = (request, id) => {

    let time = (new Date()).valueOf();
    const token = Jwt.sign({
        _id: id,
        agent: getNeededUserAgentInfo(request.headers['user-agent'])
    }, Config.product.jwt.key, {
        expiresIn: '1 days'
    });


    return {
        token
    };
};

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
