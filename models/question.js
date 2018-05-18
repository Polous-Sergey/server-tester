const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    name: {type: String},
    answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Question', QuestionSchema);