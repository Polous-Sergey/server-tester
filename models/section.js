const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    name: {type: String},
    questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Section', SectionSchema);