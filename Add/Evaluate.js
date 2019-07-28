let mongoose = require('mongoose');
let EvaluateSchema = new mongoose.Schema({
    id: String,
    userEvaluateList: []
});

module.exports = mongoose.model('evaluate', EvaluateSchema);