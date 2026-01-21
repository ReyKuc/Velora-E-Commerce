// models/Product.js
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
    // Kategori listesi güncellendi
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
        default: true  // Varsayılan olarak tüm ürünler aktif
    }
});

module.exports = mongoose.model("Product", ProductSchema);