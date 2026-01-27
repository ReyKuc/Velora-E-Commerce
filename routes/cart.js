// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // Stok güncelleme için eklendi
const Order = require("../models/Order");
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
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Sepetiniz boş." });
        }

        const orderItems = [];
        for (const item of cart.items) {
            if (!item.product) continue;

            orderItems.push({
                product: item.product._id.toString,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                quantity: item.quantity
            });

            // Stok düşürme
            const product = await Product.findById(item.product._id);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        const newOrder = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: orderItems.reduce((total, i) => total + (i.price * i.quantity), 0)
        });

        await newOrder.save();
        cart.items = []; // Sepeti temizle
        await cart.save();

        res.json({ success: true, message: "Sipariş başarılı!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;