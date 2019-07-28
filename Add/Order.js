let mongoose = require('mongoose');
let OrderSchema = new mongoose.Schema({
    id: String,
    orderList: [{
      id: String,
      list: [{
        title: String,
        id: String,
        desc: String,
        num: Number,
        price: Number,
        evaluate: Boolean,
        imgUrl: String
      }]
    }]
});

module.exports = mongoose.model('order', OrderSchema);