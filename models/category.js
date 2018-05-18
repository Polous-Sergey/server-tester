const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, unique: true, lowercase: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Category', CategorySchema);