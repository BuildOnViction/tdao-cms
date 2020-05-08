'use strict';
const AuthServices = require('../auth.services');
const CacheConfig = require('../../runtime/cache');
const Config = require('../../config');

module.exports = (server, options) => {
    const tokenCache = server.cache({
        ...CacheConfig.auth,
        generateFunc: async (user_id) => {
            return await AuthServices.isAuthenticated(user_id)
        }
    });

    server.auth.strategy('jwt', 'jwt', {
        key: Config.product.jwt.key,          // Never Share your secret key
        verifyOptions: {
            algorithms: ['HS256']
        },
        // validate: AuthServices.isAuthenticated
        validate: async (decoded, request) => {
            return await tokenCache.get(decoded._id);
        }
    });

    server.auth.default('jwt');
};
