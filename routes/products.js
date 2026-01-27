// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");
const auth = require("../middleware/auth");

// Ürün listesi
router.get("/", async (req, res) => {
    try {
        let filter = { isActive: { $ne: false } };
        
        if (req.query.category) {
            filter.category = req.query.category;
        }

        let products = await Product.find(filter);
        
        // Eğer veritabanı tamamen boşsa örnek ürünler ekle
        if ((await Product.countDocuments()) === 0) {
            const sampleProducts = [
                // Kadın Kategorisi
                { name: "Yazlık Çiçekli Elbise", price: 1100, description: "Hafif kumaş, canlı renkli yazlık elbise.", category: "Kadın", image: "/resimler/elbise.jpeg", isActive: true, stock: 50 },
                { name: "Yüksek Bel Pantolon", price: 1050, description: "Ofis ve günlük kullanım için ideal.", category: "Kadın", image: "/resimler/pantolon.jpg", isActive: true, stock: 30 },
                { name: "Kadın Kaban", price: 1300, description: "Şık ve zarif tasarım.", category: "Kadın", image: "/resimler/kaban.jpeg", isActive: true, stock: 20 },

                // Erkek Kategorisi
                { name: "Slim Fit Gömlek", price: 950, description: "Özel dokulu, dar kesim gömlek.", category: "Erkek", image: "/resimler/gomlek.png", isActive: true, stock: 40 },
                { name: "Regular-Fit Keten Pantalon", price: 1020, description: "Rahat kesim, günlük kanvas pantolon.", category: "Erkek", image: "/resimler/erkekpant.png", isActive: true, stock: 25 },
                { name: "Polo Yaka T-shirt", price: 870, description: "Yazlık, nefes alabilen kumaş.", category: "Erkek", image: "/resimler/polo.png", isActive: true, stock: 60 },
                
                // Kozmetik Kategorisi
                { name: "Nemlendirici Yüz Kremi", price: 450, description: "Hassas ciltler için günlük nemlendirici.", category: "Kozmetik", image: "/resimler/kremi.jpg", isActive: true, stock: 100 },
                { name: "Mat Ruj Seti", price: 380, description: "Uzun süre kalıcı 3'lü mat ruj seti.", category: "Kozmetik", image: "/resimler/ruj.jpg", isActive: true, stock: 75 },
                { name: "Premium Parfüm (50ml)", price: 1800, description: "Unisex, odunsu ve ferahlatıcı koku.", category: "Kozmetik", image: "/resimler/parfum.webp", isActive: true, stock: 50 },
                
                // Aksesuar Kategorisi
                { name: "Gümüş Kolye", price: 1500, description: "El yapımı, 925 ayar gümüş kolye.", category: "Aksesuar", image: "/resimler/kolye.jpg", isActive: true, stock: 100 },
                { name: "Spor Saat", price: 950, description: "Su geçirmez, dijital spor saat.", category: "Aksesuar", image: "/resimler/saat.jpg", isActive: true, stock: 80 },
                { name: "Kadın bere", price: 300, description: "Kış ayları için sıcak tutan yün şapka.", category: "Aksesuar", image: "/resimler/sapka.webp", isActive: true, stock: 120 },
                
                // Çanta Kategorisi
                { name: "Büyük Deri Omuz Çantası", price: 2500, description: "Hakiki deriden, büyük boy günlük çanta.", category: "Çanta", image: "/resimler/canta.webp", isActive: true, stock: 30 },
                { name: "Mini Sırt Çantası", price: 1400, description: "Şık ve fonksiyonel mini sırt çantası.", category: "Çanta", image: "/resimler/sirt.jpg", isActive: true, stock: 45 },
                { name: "Erkek Evrak Çantası", price: 1900, description: "İş hayatı için profesyonel evrak çantası.", category: "Çanta", image: "/resimler/evrak.webp", isActive: true, stock: 25 },

                // Ayakkabı Kategorisi
                { name: "Günlük Siyah Sneaker", price: 1200, description: "Konforlu, unisex spor ayakkabı.", category: "Ayakkabı", image: "/resimler/spor.webp", isActive: true, stock: 50 },
                { name: "Klasik Topuklu Ayakkabı", price: 1600, description: "Özel günler için süet topuklu ayakkabı.", category: "Ayakkabı", image: "/resimler/topuklu.webp", isActive: true, stock: 30 },
                { name: "Erkek Bot", price: 1800, description: "Kışlık, sağlam deri erkek botu.", category: "Ayakkabı", image: "/resimler/bot.webp", isActive: true, stock: 20 },
            ];
            await Product.insertMany(sampleProducts);
            products = await Product.find(filter);
        }

        res.json(products);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error:"Ürünler yüklenemedi" });
    }
});

// ÜRÜNE YORUM EKLE (Auth gerekli)
router.post("/:id/review", auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        
        const User = require("../models/User");
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Kullanıcı bulunamadı" 
            });
        }
      
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Ürün bulunamadı" 
            });
        }
        
  
        const newReview = new Review({
            product: req.params.id,
            user: req.user.id,
            userName: user.name,
            rating: Number(rating),
            comment: comment.trim()
        });
        
        await newReview.save();
        
        res.json({ 
            success: true, 
            message: "Yorumunuz başarıyla kaydedildi!",
            review: newReview
        });
    } catch (err) {
        console.error("Yorum ekleme hatası:", err);
        res.status(500).json({ 
            success: false, 
            message: "Yorum eklenirken hata oluştu: " + err.message 
        });
    }
});


router.get("/:id/reviews", async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id })
            .sort({ createdAt: -1 })
            .limit(100); 
        
       
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        
        res.json({ 
            success: true, 
            reviews,
            totalReviews: reviews.length,
            averageRating: avgRating
        });
    } catch (err) {
        console.error("Yorum getirme hatası:", err);
        res.status(500).json({ 
            success: false, 
            message: "Yorumlar yüklenirken hata oluştu: " + err.message 
        });
    }
});

module.exports = router;