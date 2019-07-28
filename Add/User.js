let mongoose = require('mongoose');
let CommSchema = new mongoose.Schema({
    id: String,
    imgUrl: String,
    title: String,
    price: Number
});

module.exports = mongoose.model('comm', CommSchema);