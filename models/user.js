const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    picture: String,
    isSeller: {type: Boolean, default: false},
    address: {
        addr1: String,
        addr2: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    created: {type: Date, default: Date.now}
});

UserSchema.pre('save', function (next) {
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    })

});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

UserSchema.methods.gravatar = function (size) {
    if (!this.size) size = 200;
    if (!this.email) {
        return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    } else {
        let md5 = crypto.createHash('md5').update(this.email).digest('hex');
        return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro'
    }
};

module.exports = mongoose.model('User', UserSchema);