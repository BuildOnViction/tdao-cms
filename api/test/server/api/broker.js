const Code = require('code');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const Glue = require('glue');
const lab = exports.lab = Lab.script();
let Broker = require('../../../server/models/broker');
let Company = require('../../../server/models/company');
let server;
let token;
let id;
let broker_id;
var ObjectId = require('mongodb').ObjectId;

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
    token = response.result.data.token.token;
    await Company.create({
        "_id": ObjectId("000000000000000000000000"),
        "name": "linh home",
        "global_name": "linh home",
        "phone": "0313 814146",
        "address": "Hà nội",
        "status": "Doanh nghiệp đang hoạt động",
        "isActive": true,
    })



});

lab.after(async () => {
    // await Fixtures.Db.removeAllData();
    await server.stop();
});
lab.experiment('POST /api/brokers', () => {

    let request;

    lab.test('[broker create] it returns successfully case', async () => {
        request = {
            method: 'POST',
            url: '/api/v1/brokers',
            payload: {
                "name": "testBroker",
                "email": "testBroker@gmail.com",
                "password": "123456789",
                "phone": "01234567999",
                "introduce": "string",
                "dob": "12-12-2012",
                "company": {
                    "id": "000000000000000000000000",
                    "name": "linh home"
                },
                "owner": true
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        console.log('abc', response.result.data);
        id = response.result.data._id;
        broker_id = response.result.data.roles.broker.id;
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.experiment('POST /api/brokers', () => {

        let request;

        lab.test('[broker create] it returns error payload case', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/brokers',
                payload: {
                    "password": "123456789",
                    "phone": "01234567999",
                    "introduce": "string",
                    "dob": "12-12-2012",
                    "company": {
                        "id": "000000000000000000000000",
                        "name": "linh home"
                    },
                    "owner": true
                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.equal('Invalid request payload input');
            // await User.findOneAndDelete({_id: response.result.data._id})

        });
    })
    lab.experiment('POST /api/broker', () => {

        let request;

        lab.test('[broker create] it returns no authorize', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/brokers',
                payload: {
                    "name": "testBroker",
                    "email": "testBroker@gmail.com",
                    "password": "123456789",
                    "phone": "01234567999",
                    "introduce": "string",
                    "dob": "12-12-2012",
                    "company": {
                        "id": "000000000000000000000000",
                        "name": "linh home"
                    },
                    "owner": true
                },
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(401);
            Code.expect(response.result.message).to.equal('Missing authentication');

        });
    })
    lab.experiment('POST /api/broker', () => {

        let request;

        lab.test('[broker create] company no id', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/brokers',
                payload: {
                    "name": "testBroker",
                    "email": "testBroker@gmail.com",
                    "password": "123456789",
                    "phone": "01234567912",
                    "introduce": "string",
                    "dob": "12-12-2012",
                    "company": {
                        "name": "linh home"
                    },
                    "owner": true
                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(422);
            Code.expect(response.result.message).to.equal('Company phải cố tên và id');

        });
        lab.test('[broker create] company no name', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/brokers',
                payload: {
                    "name": "testBroker",
                    "email": "testBroker@gmail.com",
                    "password": "123456789",
                    "phone": "01234567911",
                    "introduce": "string",
                    "dob": "12-12-2012",
                    "company": {
                        "id": "111111111111111111111111"
                    },
                    "owner": true
                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(422);
            Code.expect(response.result.message).to.equal('Company phải cố tên và id');

        });
        lab.test('[broker create] company not found', async () => {
            request = {
                method: 'POST',
                url: '/api/v1/brokers',
                payload: {
                    "name": "testBroker",
                    "email": "testBroker@gmail.com",
                    "password": "123456789",
                    "phone": "01234567913",
                    "introduce": "string",
                    "dob": "12-12-2012",
                    "company": {
                        "name": "linh home",
                        "id": "111111111111111111111111"
                    },
                    "owner": true
                },
                headers: {'authorization': token}
            };
            const response = await server.inject(request);
            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.equal('Không tìm thấy company');

        });
    })
});
lab.experiment('GET /api/brokers', () => {

    let request;

    lab.test('[broker get] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/brokers',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data.length).to.equal(1);
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});
lab.experiment('GET /api/v1/brokers/paginate', () => {

    let request;

    lab.test('[broker get] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/brokers/paginate',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data.docs.length).to.equal(1);
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});
lab.experiment('GET /api/brokers/broker_id/{id}', () => {

    let request;

    lab.test('[broker get by broker_id] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/brokers/broker_id/' + broker_id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data.name).to.equal('testbroker')
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});
lab.experiment('GET /api/brokers/{broker_id}/jobs', () => {

    let request;

    lab.test('[broker get] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/brokers/'+broker_id+'/jobs',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.test('[broker get] it returns fail params id case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/brokers/123/jobs',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(400);
        Code.expect(response.result.message).to.equal('Invalid request params input');
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
});
lab.experiment('PUT /api/brokers/{id}', () => {
//edit broker
    lab.test('[broker edit] it returns successfully case', async () => {
        request = {
            method: 'PUT',
            url: '/api/v1/brokers/'+id,
            payload: {
                "name": "testbrokerupdate",
                "email": "testbrokerupdate@gmail.com",
                "phone": "01234567111",
                "introduce": "test update",
                "dob": "12-12-2012",
                "owner": true
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data.user.phone).to.equal('01234567111');
        Code.expect(response.result.data.user.email).to.equal('testbrokerupdate@gmail.com');
        Code.expect(response.result.data.broker.name).to.equal('testbrokerupdate');
        Code.expect(response.result.data.broker.introduce).to.equal('test update');


        // await User.findOneAndDelete({_id: response.result.data._id})
    });
    lab.test('[broker edit] it returns false payload', async () => {
        request = {
            method: 'PUT',
            url: '/api/v1/brokers/'+id,
            payload: {
            },
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(400);


        // await User.findOneAndDelete({_id: response.result.data._id})
    });
});

lab.experiment('DELETE /api/brokers/{id}', () => {

    let request;

    lab.test('[broker get] it returns successfully case', async () => {
        request = {
            method: 'DELETE',
            url: '/api/v1/brokers/'+id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        // await User.findOneAndDelete({_id: response.result.data._id})

    });
    lab.test('[broker get] it returns fail parrams case', async () => {
        request = {
            method: 'DELETE',
            url: '/api/v1/brokers/1211',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        await Broker
        Code.expect(response.statusCode).to.equal(400);
        Code.expect(response.result.message).to.equal('Invalid request params input');
        // await User.findOneAndDelete({_id: response.result.data._id})
        await Company.deleteOne({_id: ObjectId('000000000000000000000000')})

    });
});
