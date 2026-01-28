const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const Favorite = require("../models/Favorite");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;
    
        const [orders, favorites] = await Promise.all([
            Order.find({ user: userId }).populate('items.product'),
            Favorite.findOne({ user: userId }).populate('items.product')
        ]);
        
        const interactedProductIds = new Set();
        const userCategories = new Set();
        
        orders.forEach(o => o.items.forEach(i => {
            if (i.product) {
                interactedProductIds.add(i.product._id.toString());
                userCategories.add(i.product.category);
            }
        }));
        
        if (favorites && favorites.items) {
            favorites.items.forEach(i => {
                if (i.product) {
                    interactedProductIds.add(i.product._id.toString());
                    userCategories.add(i.product.category);
                }
            });
        }

        const excludeList = Array.from(interactedProductIds);
        const categoryList = Array.from(userCategories);

   
        let recommendedProducts = await Product.find({
            category: { $in: categoryList },
            isActive: true,
            _id: { $nin: excludeList }
        }).limit(8).sort({ createdAt: -1 });

      
        if (recommendedProducts.length < 8) {
            const currentIds = recommendedProducts.map(p => p._id.toString());
            const fillCount = 8- recommendedProducts.length;
            
            const extraProducts = await Product.find({
                isActive: true,
                _id: { $nin: [...excludeList, ...currentIds] }
            }).limit(fillCount).sort({ createdAt: -1 });

            recommendedProducts = [...recommendedProducts, ...extraProducts];
        }
        
        res.json({
            success: true,
            recommendations: recommendedProducts,
            isPersonalized: categoryList.length > 0
        });
        
    } catch (err) {
        console.error("Öneri Hatası:", err);
        res.status(500).json({ success: false, message: "Hata" });
    }
});

module.exports = router;