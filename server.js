// server.js 
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

// CORS Ayarları
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
require("./models/Product");
require("./models/Review");
//require("./models/Order");
require("./models/User");

try {
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/cart", require("./routes/cart"));
    app.use("/api/orders", require("./routes/orders"));
    app.use("/api/favorite", require("./routes/favorite"));
    app.use("/api/products", require("./routes/products"));
    app.use("/api/admin", require("./routes/admin"));
    console.log('✅ Tüm API rotaları başarıyla yüklendi.');
} catch (err) {
    console.error('❌ Rotalar yüklenirken KRİTİK HATA:', err.message);
}

app.use(express.static(path.join(__dirname, "public")));


const pages = ["login", "register", "admin", "cart", "orders", "products", "stockupdate"];
pages.forEach(page => {
    app.get(`/${page}.html`, (req, res) => {
        res.sendFile(path.join(__dirname, "public", `${page}.html`));
    });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        console.log('⚠️ 404 API bulunamadı:', req.path);
        return res.status(404).json({ success: false, message: "API Endpoint bulunamadı" });
    }
    res.status(404).send("Sayfa bulunamadı");
});

app.use((err, req, res, next) => {
    console.error('💥 SUNUCU HATASI:', err.stack);
    res.status(500).json({ success: false, message: "Bir sunucu hatası oluştu" });
});
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/velora";
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('\n✅ MongoDB Bağlantısı Başarılı!');
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🎉 VELORA SUNUCUSU PORT ${PORT} ÜZERİNDE AKTİF`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log('='.repeat(50));
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Bağlantı Hatası:', err.message);
        process.exit(1);
    });