const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurveySchema = new Schema({
    name: {type: String},
    sections: [{type: Schema.Types.ObjectId, ref: 'Section'}],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Survey', SurveySchema);