// server.js - VELORA FINAL VERSION
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

console.log('\n🚀 VELORA Server Başlatılıyor...\n');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/.well-known', (req, res) => res.status(204).end());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
    next();
});

console.log('📁 Rotalar yükleniyor...\n');


try {
    app.use("/api/auth", require("./routes/auth"));
    console.log('✅ /api/auth yüklendi');
} catch (err) { console.error('❌ /api/auth YÜKLENEMEDI:', err.message); }


try {
    app.use("/api/cart", require("./routes/cart"));
    console.log('✅ /api/cart yüklendi');
} catch (err) { console.error('❌ /api/cart YÜKLENEMEDI:', err.message); }

try {
    app.use("/api/orders", require("./routes/orders"));
    console.log('✅ /api/orders yüklendi');
} catch (err) { console.error('❌ /api/orders YÜKLENEMEDI:', err.message); }


try {
    app.use("/api/favorite", require("./routes/favorite"));
    console.log('✅ /api/favorite yüklendi');
} catch (err) { console.error('❌ /api/favorite YÜKLENEMEDI:', err.message); }


try {
    app.use("/api/products", require("./routes/products"));
    console.log('✅ /api/products yüklendi');
} catch (err) { console.error('❌ /api/products YÜKLENEMEDI:', err.message); }


try {
    app.use("/api/admin", require("./routes/admin"));
    console.log('✅ /api/admin yüklendi');
} catch (err) { console.error('❌ /api/admin YÜKLENEMEDI:', err.message); }

try {

const recommendationRoutes = require("./routes/recommendations");

app.use("/api/recommendations", recommendationRoutes);


} catch (err) { 
    console.error('❌ /api/recommendations YÜKLENEMEDI:', err.message); 
}
console.log('\n📊 API Endpoints hazır:\n');
console.log('   POST /api/auth/register');
console.log('   POST /api/auth/login');
console.log('   GET  /api/products');
console.log('   POST /api/products/:id/review');
console.log('   GET  /api/products/:id/reviews');
console.log('   POST /api/cart/add');
console.log('   POST /api/cart/checkout');
console.log('   GET  /api/orders/my-orders');
console.log('   POST /api/favorite/add');

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/login.html", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register.html", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/admin.html", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/cart.html", (req, res) => res.sendFile(path.join(__dirname, "public", "cart.html")));
app.get("/orders.html", (req, res) => res.sendFile(path.join(__dirname, "public", "orders.html")));
app.get("/products.html", (req, res) => res.sendFile(path.join(__dirname, "public", "products.html")));
app.get("/stockupdate.html", (req, res) => res.sendFile(path.join(__dirname, "public", "stockupdate.html")));
app.get("/test-api.html", (req, res) => res.sendFile(path.join(__dirname, "public", "test-api.html")));
app.get("/addproduct.html", (req, res) => res.sendFile(path.join(__dirname, "public", "addproduct.html")));

console.log('\n✅ Static files ayarlandı (public klasörü)\n');

app.use((req, res) => {
    console.log('\n❌ 404 - Rota bulunamadı:', req.path);
    res.status(404).json({ success: false, message: "Endpoint bulunamadı", path: req.path });
});

app.use((err, req, res, next) => {
    console.error('\n💥 SUNUCU HATASI:', err.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/velora";
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('\n✅ MongoDB BAĞLANDI!');
        console.log('📦 Veritabanı: velora\n');
        
        app.listen(PORT, () => {
            console.log('='.repeat(60));
            console.log('🎉 VELORA SUNUCUSU ÇALIŞIYOR!');
            console.log('='.repeat(60));
            console.log(`🌐 Ana Sayfa: http://localhost:${PORT}`);
            console.log(`🛒 Sepet: http://localhost:${PORT}/cart.html`);
            console.log(`📦 Siparişler: http://localhost:${PORT}/orders.html`);
            console.log(`🔐 Login: http://localhost:${PORT}/login.html`);
            console.log('='.repeat(60));
            console.log('\n💡 Yeni Özellikler:');
            console.log('   ✅ Sipariş Geçmişi');
            console.log('   ✅ Ürün Yorumlama (1-5 Yıldız)');
            console.log('   ✅ Yorum Görüntüleme\n');
        });
    })
    .catch(err => {
        console.error('❌ MongoDB HATASI:', err.message);
        process.exit(1);
    });