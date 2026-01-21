// routes/favorite.js
const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");

// Tüm rotalar için authMiddleware uygulandı
router.use(authMiddleware);

// Favorileri getir
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const favorite = await Favorite.findOne({ user: userId }).populate("items.product");
        res.json(favorite || { items: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Favoriler yüklenemedi" });
    }
});

// YENİ: Belirli bir ürünün favorilerde olup olmadığını kontrol et
router.get("/check", async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Geçersiz ürün id" });
        }

        const favorite = await Favorite.findOne({ user: userId });
        
        if (!favorite) {
            return res.json({ success: true, isFavorite: false });
        }

        const isFavorite = favorite.items.some(item => item.product.toString() === productId);
        res.json({ success: true, isFavorite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Kontrol yapılamadı" });
    }
});

// Favoriye ürün ekleme
router.post("/add", async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: "Geçersiz ürün id" });
    }
    
    const productExists = await Product.findById(productId);
    if (!productExists) {
        return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
    }

    try {
        let favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            favorite = new Favorite({ user: userId, items: [] });
        }

        if (favorite.items.find(item => item.product.toString() === productId)) {
            return res.status(200).json({ success: true, message: "Ürün zaten favorilerde" });
        }

        favorite.items.push({ product: productId });
        await favorite.save();
        res.json({ success: true, message: "Ürün favorilere eklendi!", favorite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Favorilere ekleme başarısız" });
    }
});

// YENİ: Favoriden çıkar (POST olarak)
router.post("/remove", async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            return res.status(404).json({ success: false, message: "Favori listesi bulunamadı!" });
        }

        favorite.items = favorite.items.filter(item => item.product.toString() !== productId);
        await favorite.save();
        res.json({ success: true, message: "Ürün favorilerden çıkarıldı!", favorite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Sunucu hatası!" });
    }
});

// Favoriden çıkar (DELETE - Eski versiyon, geriye dönük uyumluluk için)
router.delete("/remove/:productId", async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            return res.status(404).json({ success: false, message: "Favori listesi bulunamadı!" });
        }

        favorite.items = favorite.items.filter(item => item.product.toString() !== productId);
        await favorite.save();
        res.json({ success: true, message: "Ürün favorilerden çıkarıldı!", favorite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Sunucu hatası!" });
    }
});

module.exports = router;