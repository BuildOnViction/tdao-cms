const Code = require('code');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const Glue = require('glue');
const lab = exports.lab = Lab.script();
const Broker = require('../../../server/models/broker');
const User = require('../../../server/models/user');
var ObjectId = require('mongodb').ObjectId;

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
    await Broker.create(new Broker({
        _id: ObjectId('000000000000000000000099'),
        name: 'test',
        dob: '11-10-1990',
        balance : 9000000000,
        company: []
    }));

    const passwordHash = await User.generatePasswordHash('123654789');

    await User.create(new User({
        _id: ObjectId('000000000000000000000099'),
        phone: "0976192661",
        email: "test@gmail.com",
        isActive: true,
        username: "0976192661",
        password: passwordHash.hash,
        roles: {
            broker: {
                id: '000000000000000000000099',
                name: 'Tuấn Anh Nguyễn'
            }
        }
    }));

});

lab.after(async () => {
    // await Fixtures.Db.removeAllData();
    await server.stop();
});
//post


///get detail
lab.experiment('GET /api/users', () => {

    let request;

    lab.test('[users get] it returns true case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/users?keyword=0976192661',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        id = response.result.data.docs[0]._id
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data.docs.length).to.equal(1);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });


});
//delete
lab.experiment('GET /api/users/{id}', () => {

    let request;

    lab.test('[users get one] it returns successfully case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/users/' + id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        Code.expect(response.result.data).to.exist();
        // await User.findOneAndDelete({_id: response.result.data._id})

    });

});

lab.experiment('GET /api/users/{id}', () => {

    let request;

    lab.test('[users get one] it returns false payload case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/users/'+'3131',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(400);
    });

});

lab.experiment('GET /api/users/{id}/disable', () => {

    let request;

    lab.test('[users disable one] it returns true case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/users/'+id+'/disable',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
    });
    lab.test('[users disable one] it returns false payload case', async () => {
        request = {
            method: 'GET',
            url: '/api/v1/users/123/disable',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(400);
    });

});
lab.experiment('DELETE /api/users/{id}', () => {

    let request;

    lab.test('[users disable one] it returns true case', async () => {
        request = {
            method: 'DELETE',
            url: '/api/v1/users/'+id,
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.error).to.be.a.boolean().and.to.equal(false);
        await Broker.deleteOne({_id : ObjectId('000000000000000000000099')})
    });
    lab.test('[users disable one] it returns false payload case', async () => {
        request = {
            method: 'DELETE',
            url: '/api/v1/users/123',
            headers: {'authorization': token}
        };
        const response = await server.inject(request);
        Code.expect(response.statusCode).to.equal(400);
    });

});