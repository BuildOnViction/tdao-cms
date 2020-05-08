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
lab.experiment('POST /api/jobs', () => {

    let request;

    lab.test('[jobs create] it returns successfully case', async () => {
        request = {
            method: 'POST',
            url: '/api/v1/jobs',
            payload: {
                "title": "string",
                "country": "string",
                "broker_id": "000000000000000000000000",
                "cv_location": "string",
                "gender": "male",
                "amount": 10,
                "salary": {
                    "from": 10,
                    "to": 1000
                },
                "job_type": [
                    {
                        "id": "5cd53d97298da72c62f816cc",
                        "name": "Chế biến thực phẩm"
                    }
                ],
                "required_experience": true,
                "deadline": "09-10-2020",
                "required_condition": "string",
                "benefit": "string",
                "description": "string",
                "status": "draft"
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        id = response.result.data._id;
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        Code.expect(response.result.data.status).to.equal('draft');
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.experiment('POST /api/jobs', () => {

        let request;

        lab.test('[jobs create] it returns error payload case', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/jobs',
                payload: {
                    "title": "",
                    "country": "",
                    "cv_location": "",
                    "broker_id": "000000000000000000000000",
                    "gender": "male",
                    "amount": 10,
                    "salary": {
                        "from": 10,
                        "to": 1000
                    },
                    "job_type": [],
                    "required_experience": true,
                    "deadline": "09-10-2020",
                    "required_condition": "string",
                    "benefit": "string",
                    "description": "string"
                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.equal('Invalid request payload input');
            // await User.findOneAndDelete({_id: response.result.data._id})

        });
    })
    lab.experiment('POST /api/jobs', () => {

        let request;

        lab.test('[jobs create] it returns no authorize', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/jobs',
                payload: {
                    "title": "",
                    "country": "",
                    "cv_location": "",
                    "broker_id": "000000000000000000000000",
                    "gender": "male",
                    "amount": 10,
                    "salary": {
                        "from": 10,
                        "to": 1000
                    },
                    "job_type": [],
                    "required_experience": true,
                    "deadline": "09-10-2020",
                    "required_condition": "string",
                    "benefit": "string",
                    "description": "string"
                },
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(401);
            Code.expect(response.result.message).to.equal('Missing authentication');

        });
    })
});
lab.experiment('GET /api/jobs/active/{id}', () => {
    lab.test('[jobs Active] it active returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/jobs/active/' + id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        Code.expect(response.result.data.status).to.equal('active');
    });

});
//put
lab.experiment('PUT /api/jobs/{id}', () => {

    let request;

    lab.test('[jobs update] it returns successfully case', async () => {
        request = {
            method: 'PUT',
            url: '/api/v1/jobs/' + id,
            payload: {
                "title": "string1",
                "country": "string",
                "cv_location": "string",
                "broker_id": "000000000000000000000000",
                "gender": "male",
                "amount": 0,
                "salary": {
                    "from": 0,
                    "to": 0
                },
                "job_type": [],
                "required_experience": true,
                "deadline": "09-10-2020",
                "required_condition": "string",
                "benefit": "string",
                "description": "string",
                "status": "active"
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        Code.expect(response.result.data.status).to.equal('active');
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.experiment('PUT /api/jobs/{id}', () => {

        let request;

        lab.test('[jobs update] it returns data same jobs when update case', async () => {
            request = {
                method: 'PUT',
                url: '/api/v1/jobs/' + id,
                payload: {
                    "title": "string1",
                    "country": "string",
                    "cv_location": "string",
                    "broker_id": "000000000000000000000000",
                    "gender": "male",
                    "amount": 0,
                    "salary": {
                        "from": 0,
                        "to": 0
                    },
                    "job_type": [],
                    "required_experience": true,
                    "deadline": "09-10-2020",
                    "required_condition": "string",
                    "benefit": "string",
                    "description": "string"
                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
            Code.expect(response.result.data).to.exist();
            Code.expect(response.result.data.slug).to.equal('string1');
            // await User.findOneAndDelete({_id: response.result.data._id})

        });
    });

    lab.test('[jobs update] it returns wrong id case', async () => {
        request = {
            method: 'PUT',
            url: '/api/v1/jobs/123456',
            payload: {
                "title": "string",
                "country": "string",
                "cv_location": "string",
                "gender": "male",
                "amount": 0,
                "salary": {
                    "from": 0,
                    "to": 0
                },
                "job_type": [],
                "required_experience": true,
                "deadline": "09-10-2020",
                "required_condition": "string",
                "benefit": "string",
                "description": "string"
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(400);
        Code.expect(response.result.message).to.equal('Invalid request params input');
        // await User.findOneAndDelete({_id: response.result.data._id})

    });

    lab.test('[jobs update] it returns false payload case', async () => {
        request = {
            method: 'PUT',
            url: '/api/v1/jobs/' + id,
            payload: {
                "title": "",
                "country": "string",
                "cv_location": "string",
                "gender": "male",
                "amount": 0,
                "salary": {
                    "from": 10,
                    "to": 20
                },
                "job_type": [
                    {
                        "id": "5cd53d97298da72c62f816cc",
                        "name": "Chế biến thực phẩm"
                    }
                ],
                "required_experience": true,
                "deadline": "09-10-2020",
                "required_condition": "string",
                "benefit": "string",
                "description": "string"
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(400);
        Code.expect(response.result.message).to.equal('Invalid request payload input');

        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});
//list
lab.experiment('GET /api/jobs', () => {

    let request;

    lab.test('[jobs get] it returns true case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/jobs?page=1&limit=1',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });

});

lab.experiment('GET /api/jobs/search', () => {

    let request;

    lab.test('[jobs search] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/jobs/search?keywords=string&limit=10&page=1',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.test('[jobs search] it returns successfully without keywords', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/jobs/search?limit=10&page=1',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.test('[jobs get] it returns full input user case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/jobs/search?keywords=string&limit=10&page=1&jobType=5cd53d97298da72c62f816cc&salaryfrom=10&salaryto=20',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
    })

});

///get detail
lab.experiment('GET /api/jobs/{id}', () => {

    let request;

    lab.test('[jobs get] it returns true case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/jobs/' + id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });

});
//delete
lab.experiment('Delete /api/jobs/{id}', () => {

    let request;

    lab.test('[jobs delete] it returns successfully case', async () => {
        request = {
            method: 'DELETE',
            url: '/api/v1/jobs/' + id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });

});


