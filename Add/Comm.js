let mongoose = require('mongoose');
let CommoditySchema = new mongoose.Schema({
    belong: String,
    id: String,
    title: String,
    desc: String,
    price: Number,
    imgList: Array
});

module.exports = mongoose.model('commodity', CommoditySchema);