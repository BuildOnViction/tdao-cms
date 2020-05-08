const Code = require('code');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const Glue = require('glue');
const lab = exports.lab = Lab.script();
let server;
let token;
let id;
lab.before(async () => {
    const options = {relativeTo: __dirname + "/../../../"};
    server = await Glue.compose(Manifest.get('/'), options);
    const db = require('../../../server/db/db');
    await server.start();
    let request = {
        method: 'POST',
        url: '/api/v1/login',
        payload: {
            email: 'admin@gmail.com',
            password: '123456789'
        }
    };
    const response = await server.inject(request);
    token = response.result.data.token.token


});

lab.after(async () => {
    // await Fixtures.Db.removeAllData();
    await server.stop();
});
//post
lab.experiment('POST /api/admins', () => {

    let request;

    lab.test('[admin create] it returns successfully case', async () => {
        request = {
            method: 'POST',
            url: '/api/v1/admins',
            payload: {
                "name": "linhdeptraivkl",
                "email": "admin3@gmail.com",
                "password": "123456789",
                "roles": "editor"
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        id = response.result.data._id;
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.experiment('POST /api/admins', () => {

        let request;

        lab.test('[admins create] it returns error payload case', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/admins',
                payload: {

                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.equal('Invalid request payload input');
            // await User.findOneAndDelete({_id: response.result.data._id})

        });
    })
    lab.experiment('POST /api/admins', () => {

        let request;

        lab.test('[admin create] it returns no authorize', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/admins',
                payload: {
                    "name": "linhdeptraivkl",
                    "email": "admin3@gmail.com",
                    "password": "123456789",
                    "roles": "editor"
                },
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(401);
            Code.expect(response.result.message).to.equal('Missing authentication');

        });
    })
});

//put

lab.experiment('PUT /api/admins/{id}', () => {

    let request;

    lab.test('[admin update] it returns successfully case', async () => {
        request = {
            method: 'PUT',
            url: '/api/v1/admins/'+id,
            payload: {
                "name": "linhxautraivkl",
                "email": "admin3@gmail.com",
                "roles": "editor"
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.experiment('PUT /api/admins/{id}', () => {

        let request;

        lab.test('[admin update] it returns error id case', async () => {
            request = {
                method: 'PUT',
                url: '/api/v1/admins/13123123',
                payload: {

                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.equal('Invalid request params input');
            // await User.findOneAndDelete({_id: response.result.data._id})

        });
    })
    lab.experiment('PUT /api/admins/{id}', () => {

        let request;

        lab.test('[admin update] it returns no authorize', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/admins',
                payload: {
                    "name": "linhdeptraivkl",
                    "email": "admin3@gmail.com",
                    "password": "123456789",
                    "roles": "editor"
                },
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(401);
            Code.expect(response.result.message).to.equal('Missing authentication');

        });
    })
});


//getlist

lab.experiment('GET /api/admins', () => {

    let request;

    lab.test('[admin getlist] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/admins',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        Code.expect(response.result.data.docs.length).to.equal(3)
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});

lab.experiment('GET /api/admins/{id}', () => {

    let request;

    lab.test('[admin getlist] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/admins/'+id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});
lab.experiment('DELETE /api/admins/{id}', () => {

    let request;

    lab.test('[admin getlist] it returns successfully case', async () => {
        request = {
            method: 'DELETE',
            url: '/api/v1/admins/'+id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});

