// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // Stok güncelleme için eklendi
const auth = require("../middleware/auth");

// SEPETİ GETİR
router.get("/", auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart) cart = { items: [] };
        res.json(cart);
    } catch (err) {
        res.status(500).json({ success: false, message: "Sepet yüklenemedi" });
    }
});

// SEPETE EKLE
router.post("/add", auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = new Cart({ user: req.user.id, items: [] });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (item) item.quantity += quantity;
        else cart.items.push({ product: productId, quantity });

        await cart.save();
        res.json({ success: true, message: "Ürün eklendi", cart });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ÜRÜNÜ SEPETTEN SİL
router.delete("/remove/:id", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (cart) {
            cart.items = cart.items.filter(i => i.product.toString() !== req.params.id);
            await cart.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// SATIN ALMA (CHECKOUT) - STOK DÜŞÜRME EKLENDİ
const Order = require("../models/Order");

router.post("/checkout", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart || cart.items.length === 0) return res.status(400).json({ success: false });

        // 1. Sipariş kaydı oluştur
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity
        }));

        const newOrder = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        });

        // 2. Stokları düşür
        for (let item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        await newOrder.save();
        cart.items = []; // Sepeti boşalt
        await cart.save();

        res.json({ success: true, message: "Siparişiniz 'Siparişlerim' sekmesine eklendi!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;