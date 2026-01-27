const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true, 
        enum: ['Kadın', 'Erkek', 'Kozmetik', 'Aksesuar', 'Çanta', 'Ayakkabı'], 
    },
    image: {
        type: String,
        required: true, 
    },
    isActive: {
        type: Boolean,
        default: true  
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("Product", ProductSchema);