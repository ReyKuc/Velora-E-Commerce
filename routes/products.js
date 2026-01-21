// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Ürün listesi
router.get("/", async (req, res) => {
    try {
        // HATA DÜZELTME: isActive alanı false olmayanları (yani true olanları ve henüz tanımlanmamış olanları) getirir
        let filter = { isActive: { $ne: false } };
        
        // Kategori filtresi varsa sorguya ekle (Daha performanslı olması için find içine aldık)
        if (req.query.category) {
            filter.category = req.query.category;
        }

        let products = await Product.find(filter);
        
        // Eğer veritabanı tamamen boşsa örnek ürünler ekle
        if ((await Product.countDocuments()) === 0) {
            const sampleProducts = [
                // Kadın Kategorisi
                { name: "Yazlık Çiçekli Elbise", price: 1100, description: "Hafif kumaş, canlı renkli yazlık elbise.", category: "Kadın", image: "/resimler/elbise.jpeg", isActive: true },
                { name: "Yüksek Bel Pantolon", price: 1050, description: "Ofis ve günlük kullanım için ideal.", category: "Kadın", image: "/resimler/pantolon.jpg", isActive: true },
                { name: "Kadın Kaban", price: 1300, description: "Şık ve zarif tasarım.", category: "Kadın", image: "/resimler/kaban.jpeg", isActive: true },

                // Erkek Kategorisi
                { name: "Slim Fit Gömlek", price: 950, description: "Özel dokulu, dar kesim gömlek.", category: "Erkek", image: "/resimler/gomlek.png", isActive: true },
                { name: "Regular-Fit Keten Pantalon", price: 1020, description: "Rahat kesim, günlük kanvas pantolon.", category: "Erkek", image: "/resimler/erkekpant.png", isActive: true },
                { name: "Polo Yaka T-shirt", price: 870, description: "Yazlık, nefes alabilen kumaş.", category: "Erkek", image: "/resimler/polo.png", isActive: true },
                
                // Kozmetik Kategorisi
                { name: "Nemlendirici Yüz Kremi", price: 450, description: "Hassas ciltler için günlük nemlendirici.", category: "Kozmetik", image: "/resimler/kremi.jpg", isActive: true },
                { name: "Mat Ruj Seti", price: 380, description: "Uzun süre kalıcı 3'lü mat ruj seti.", category: "Kozmetik", image: "/resimler/ruj.jpg", isActive: true },
                { name: "Premium Parfüm (50ml)", price: 1800, description: "Unisex, odunsu ve ferahlatıcı koku.", category: "Kozmetik", image: "/resimler/parfum.webp", isActive: true },
                
                // Aksesuar Kategorisi
                { name: "Gümüş Kolye", price: 1500, description: "El yapımı, 925 ayar gümüş kolye.", category: "Aksesuar", image: "/resimler/kolye.jpg", isActive: true },
                { name: "Spor Saat", price: 950, description: "Su geçirmez, dijital spor saat.", category: "Aksesuar", image: "/resimler/saat.jpg", isActive: true },
                { name: "Kadın bere", price: 300, description: "Kış ayları için sıcak tutan yün şapka.", category: "Aksesuar", image: "/resimler/sapka.webp", isActive: true },
                
                // Çanta Kategorisi
                { name: "Büyük Deri Omuz Çantası", price: 2500, description: "Hakiki deriden, büyük boy günlük çanta.", category: "Çanta", image: "/resimler/canta.webp", isActive: true },
                { name: "Mini Sırt Çantası", price: 1400, description: "Şık ve fonksiyonel mini sırt çantası.", category: "Çanta", image: "/resimler/sirt.jpg", isActive: true },
                { name: "Erkek Evrak Çantası", price: 1900, description: "İş hayatı için profesyonel evrak çantası.", category: "Çanta", image: "/resimler/evrak.webp", isActive: true },

                // Ayakkabı Kategorisi
                { name: "Günlük Siyah Sneaker", price: 1200, description: "Konforlu, unisex spor ayakkabı.", category: "Ayakkabı", image: "/resimler/spor.webp", isActive: true },
                { name: "Klasik Topuklu Ayakkabı", price: 1600, description: "Özel günler için süet topuklu ayakkabı.", category: "Ayakkabı", image: "/resimler/topuklu.webp", isActive: true },
                { name: "Erkek Bot", price: 1800, description: "Kışlık, sağlam deri erkek botu.", category: "Ayakkabı", image: "/resimler/bot.webp", isActive: true },
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

module.exports = router;