// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

// GET CART
router.get("/", auth, async (req, res) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) cart = { items: [] };
    res.json(cart);
});

// ADD TO CART
router.post("/add", auth, async (req, res) => {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity += quantity;
    else cart.items.push({ product: productId, quantity });

    await cart.save();
    res.json({ success:true, message:"Ürün eklendi", cart });
});

// REMOVE
router.delete("/remove/:id", auth, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.id);
    await cart.save();
    res.json({ success:true });
});

module.exports = router;
