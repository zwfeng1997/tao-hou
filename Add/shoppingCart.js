let mongoose = require('mongoose');
let shoppingCartSchema = new mongoose.Schema({
    id: String,
    cartList:[{title: String, itemList: [
      {
        desc: String,
        id: String,
        imgUrl: String,
        num: Number,
        selected: Boolean,
        price: Number
      }
    ]}]
});

module.exports = mongoose.model('shoppingCart', shoppingCartSchema);