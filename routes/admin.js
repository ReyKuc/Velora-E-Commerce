// routes/admin.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const auth = require("../middleware/auth");
const Review = require("../models/Review");


// Tüm admin rotaları için admin kontrolünü başlat
router.use(adminAuth);

// Ürünleri Getir
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Ürünler yüklenemedi" });
    }
});

// Fiyat Güncelle
router.put("/products/:id/price", async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

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

// Aktif/Pasif Yap
router.put("/products/:id/toggle-active", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
        product.isActive = !product.isActive;
        await product.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Stok Güncelle
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

// Admin için belirli bir yorumu silme rotası
// routes/admin.js içindeki silme rotasını BU ŞEKİLDE GÜNCELLE:

router.delete("/products/:productId/reviews/:reviewId", async (req, res) => {
    try {
        const { reviewId } = req.params;
        console.log("🗑️ Review Modelinden siliniyor. ID:", reviewId);

        // Product modelinde reviews dizisi OLMADIĞI için 
        // direkt Review modeline gidip ID ile siliyoruz.
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ success: false, message: "Yorum zaten silinmiş veya bulunamadı." });
        }

        res.json({ success: true, message: "Yorum başarıyla silindi." });
        
    } catch (err) {
        console.error("❌ Silme Hatası:", err);
        res.status(500).json({ success: false, message: "Sunucu hatası: " + err.message });
    }
});

module.exports = router;