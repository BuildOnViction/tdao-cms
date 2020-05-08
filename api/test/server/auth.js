// 'use strict';
// const Auth = require('../../server/auth');
// const AuthService = require('../../server/auth/auth.services');
// const Code = require('code');
// const Fixtures = require('./fixtures');
// const Hapi = require('hapi');
// const Lab = require('lab');
// const Manifest = require('../../manifest');
// const Session = require('../../server/models/session');
// const User = require('../../server/models/user');
// const lab = exports.lab = Lab.script();

// let server;

// lab.before(async () => {
//     const options = { relativeTo: __dirname + "/../../../" };
//     server = await Glue.compose(Manifest.get('/'), options);
//     await server.start();
// });

// lab.after(async () => {
//     // await Fixtures.Db.removeAllData();
//     await server.stop();
// });

// lab.experiment('Auth by jwt to main server', () => {
//     lab.test('it returns as invalid without token provided', async () => {
//         const request = {
//             method: 'GET',
//             url: '/'
//         };
//         const response = await server.inject(request);
//     });

//     lab.test('it returns as invalid when the session query misses', async () => {
//         const sessionId = '000000000000000000000001';
//         const sessionKey = '01010101-0101-0101-0101-010101010101';
//         const request = {
//             method: 'GET',
//             url: '/',
//             headers: {
//                 authorization: Fixtures.Creds.authHeader(sessionId, sessionKey)
//             }
//         };

//         const response = await server.inject(request);

//         Code.expect(response.statusCode).to.equal(200);
//         Code.expect(response.result.isValid).to.equal(false);
//     });

//     lab.test('it returns as invalid when the user query misses', async () => {

//         const session = await Session.create('000000000000000000000000', '127.0.0.1', 'Lab');
//         const request = {
//             method: 'GET',
//             url: '/',
//             headers: {
//                 authorization: Fixtures.Creds.authHeader(session._id, session.key)
//             }
//         };
//         const response = await server.inject(request);

//         Code.expect(response.statusCode).to.equal(200);
//         Code.expect(response.result.isValid).to.equal(false);
//     });


//     lab.test('it returns as invalid when the user is not active', async () => {

//         const { user } = await Fixtures.Creds.createAdminUser(
//             'Ben Hoek', 'ben', 'badben', 'ben@stimpy.show'
//         );
//         const session = await Session.create(`${user._id}`, '127.0.0.1', 'Lab');
//         const update = {
//             $set: {
//                 isActive: false
//             }
//         };

//         await User.findByIdAndUpdate(user._id, update);

//         const request = {
//             method: 'GET',
//             url: '/',
//             headers: {
//                 authorization: Fixtures.Creds.authHeader(session._id, session.key)
//             }
//         };

//         const response = await server.inject(request);

//         Code.expect(response.statusCode).to.equal(200);
//         Code.expect(response.result.isValid).to.equal(false);
//     });


//     lab.test('it returns as valid when all is well', async () => {

//         const { user } = await Fixtures.Creds.createAdminUser(
//             'Ren Hoek', 'ren', 'baddog', 'ren@stimpy.show'
//         );
//         const session = await Session.create(`${user._id}`, '127.0.0.1', 'Lab');

//         const request = {
//             method: 'GET',
//             url: '/',
//             headers: {
//                 authorization: Fixtures.Creds.authHeader(session._id, session.key)
//             }
//         };

//         const response = await server.inject(request);

//         Code.expect(response.statusCode).to.equal(200);
//         Code.expect(response.result.isValid).to.equal(true);
//     });
// });
