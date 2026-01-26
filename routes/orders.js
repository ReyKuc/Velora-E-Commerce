// routes/orders.js içeriği bu şekilde OLMALI:
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth"); // 'auth' olarak al

router.get("/my-orders", auth, async (req, res) => { // 'protect' değil 'auth' kullan
    try {
        const orders = await Order.find({ user: req.user.id })
                                  .populate('items.product')
                                  .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Hata oluştu" });
    }
});

module.exports = router;