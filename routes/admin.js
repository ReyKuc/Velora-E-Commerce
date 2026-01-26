// routes/admin.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");



// Tüm admin rotaları için yetki kontrolü
router.use(adminAuth);

// Tüm ürünleri getir (Admin için - inactive olanlar da dahil)
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Ürünler yüklenemedi" });
    }
});

// Ürün fiyatını güncelle
router.put("/products/:id/price", async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        // Sayı kontrolü
        if (price === undefined || price < 0) {
            return res.status(400).json({ success: false, message: "Geçerli bir fiyat giriniz" });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { price: Number(price) }, 
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
        }

        res.json({ success: true, message: "Fiyat güncellendi", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Fiyat güncellenemedi" });
    }
});


router.put("/products/:id/toggle-active", async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.isActive = !product.isActive;
    await product.save();
    res.json({ success: true });
});

router.put("/products/:id/stock", async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { stock: Number(stock) }, 
            { new: true }
        );
        res.json({ success: true, product: updatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;


