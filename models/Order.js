const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        image: String,
        quantity: Number
    }],
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now }
});

// module.exports = Order; <--- BU YANLIŞ, HATA VERDİRİR
module.exports = mongoose.model("Order", orderSchema); // DOĞRUSU BU