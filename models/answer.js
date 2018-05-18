const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    name: {type: String},
    isTrue: {type: Boolean},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Answer', AnswerSchema);