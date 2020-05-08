const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Bcrypt = require('bcryptjs');
const Assert = require('assert');
const Boom  = require("boom");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
        name: {type: String},
        email: {type: String},
        password: {type: String},
        roles: String
    },
    {
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);


AdminSchema.plugin(mongoosePaginate);
AdminSchema.statics.generatePasswordHash = async function (password) {

    Assert.ok(password, 'Missing password argument.');

    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(password, salt);
    return {password, hash};
}
AdminSchema.statics.findByCredentials = async function (email, password) {

    Assert.ok(email, 'Missing email argument.');
    Assert.ok(password, 'Missing password argument.');

    const query = {
        email
    };

    const user = await this.findOne(query);

    if (!user) {
        return;
    }

    const passwordMatch = await Bcrypt.compare(password, user.password);

    if (passwordMatch) {
        //TODO find other elegant way
        user.set('password', undefined, {strict: false} );
        return user
    } else {
        throw Boom.notFound('Wrong login info');
    }
}
AdminSchema.index({email: 1},{unique: true});

module.exports = mongoose.model('admins', AdminSchema);
