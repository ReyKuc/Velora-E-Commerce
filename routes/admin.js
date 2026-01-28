// routes/admin.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const auth = require("../middleware/auth");
const Review = require("../models/Review");

router.use(adminAuth);


router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Ürünler yüklenemedi" });
    }
});

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

router.put("/products/:id/stock", async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (stock === undefined || stock === null || stock < 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Geçerli bir stok değeri giriniz (0 veya üzeri)" 
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { stock: parseInt(stock) },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Ürün bulunamadı" 
            });
        }

        res.json({ 
            success: true, 
            message: "Stok güncellendi", 
            product 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: "Stok güncellenemedi" 
        });
    }
});

router.post("/products/add", async (req, res) => {
    try {
        const { name, price, stock, category, description, image, isActive } = req.body;

        
        if (!name || !price || stock === undefined || !category || !description || !image) {
            return res.status(400).json({ 
                success: false, 
                message: "Tüm alanları doldurun!" 
            });
        }

       
        const newProduct = new Product({
            name: name.trim(),
            price: Number(price),
            stock: Number(stock),
            category,
            description: description.trim(),
            image: image.trim(),
            isActive: isActive !== undefined ? isActive : true
        });

        await newProduct.save();

        res.status(201).json({ 
            success: true, 
            message: "Ürün başarıyla eklendi!",
            product: newProduct
        });

    } catch (err) {
        console.error("Ürün ekleme hatası:", err);
        res.status(500).json({ 
            success: false, 
            message: "Ürün eklenirken hata oluştu: " + err.message 
        });
    }
});





router.delete("/products/:productId/reviews/:reviewId", async (req, res) => {
    try {
        const { reviewId } = req.params;
        console.log("🗑️ Review Modelinden siliniyor. ID:", reviewId);

      
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